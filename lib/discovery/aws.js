'use strict';

var _ = require('lodash');
var aws = require('aws-sdk');

var Factory = require('../Factory');


/**
 * Connects to the AWS api to look up instances in your project.
 */
exports.discover = () => {
  var opts = Factory.options.discovery;
  var ec2options = {
    region: opts.region,
    maxRetries: opts.maxRetries,
    sslEnabled: opts.sslEnabled == undefined ? true : opts.sslEnabled
  };
  opts.credentials && Object.assign(ec2options, opts.credentials);
  var ec2 = new aws.EC2(ec2options);
  var requestParams = {
    Filters: opts.filters,
    MaxResults: opts.maxResults
  };
  ec2.describeInstances(requestParams, function (err, data) {
    if (err) {
      return Factory.emitter.emit('error', err);
    }
    var hosts = [];
    var port = opts.port || Factory.options.listen.substr(Factory.options.listen.lastIndexOf(':') + 1);
    for (var reservation of data.Reservations) {
      for (var instance of reservation.Instances) {
        if (!_.isEmpty(instance.PublicDnsName)) {
          hosts.push('tcp://' + instance.PublicDnsName + ':' + port);
        } else if (!_.isEmpty(instance.PrivateDnsName)) {
          hosts.push('tcp://' + instance.PrivateDnsName + ':' + port);
        } else {
          Factory.debug('Ignoring instance as it has neither public nor private dns name:', instance);
        }
      }
    }
    Factory.emitter.emit('discovered', hosts);
  });
};
