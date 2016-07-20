var _ = require('lodash');
var aws = require('aws-sdk');


/**
 * Connects to the AWS api to look up instances in your project.
 */
exports.discover = () => {
  var opts = this._context.discovery;
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
  ec2.describeInstances(requestParams, (err, data) => {
    if (err) {
      return this._context.emit('error', err);
    }
    var hosts = [];
    var port = opts.port || this._context.listen.substr(this._context.listen.lastIndexOf(':') + 1);
    for (var reservation of data.Reservations) {
      for (var instance of reservation.Instances) {
        if (!_.isEmpty(instance.PublicDnsName)) {
          hosts.push('tcp://' + instance.PublicDnsName + ':' + port);
        } else if (!_.isEmpty(instance.PrivateDnsName)) {
          hosts.push('tcp://' + instance.PrivateDnsName + ':' + port);
        } else {
          this._context.debug('Ignoring instance as it has neither public nor private dns name:', instance);
        }
      }
    }
    this._context.emit('discovered', hosts);
  });
};
