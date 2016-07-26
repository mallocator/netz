# netz
[![npm version](https://badge.fury.io/js/netz.svg)](http://badge.fury.io/js/netz)
[![Build Status](https://travis-ci.org/mallocator/netz.svg?branch=master)](https://travis-ci.org/mallocator/netz)
[![Coverage Status](https://coveralls.io/repos/github/mallocator/netz/badge.svg?branch=master)](https://coveralls.io/github/mallocator/netz?branch=master)
[![Dependency Status](https://david-dm.org/mallocator/netz.svg)](https://david-dm.org/mallocator/netz)

A peer-2-peer service discovery and communication framework built on top of nanomsg

# About
Finding services is hard when you have to wire up everything by yourself, which is why I wrote this framework on top of nanomsg to make 
connecting services with each other easier. Rather than having to specify specific addresses when connecting to other services using
nanomsg, we only use service names to hook them up. This works by using a discovery service on top of nanomsg that knows what services
are available a the cluster. The discovery itself can be done through various means, such as broadcasts, lists of IPs or a discovery
implementation written for AWS. Using the service is very simple while leaving you with access to most basic functions given by nanomsg.

## What is nanomsg
Here's the description taken off of the official [web page](http://nanomsg.org):
nanomsg is a socket library that provides several common communication patterns. It aims to make the networking layer fast, scalable, and easy to use.

## Features
 * support for all socket types (Req, Rep, Sub, Pub, Push, Pull, Surveyor, Respondent, Pair, Bus)
 * Discovery using AWS, TCP broadcast, unicast or local file
 * Automatically connect/disconnect when services appear/disappear
 * Highly event driven, which allows you to react to service or node changes in addition to the available API
 * No need to use tcp addresses or ports for your services, the framework will assign them for you
 
 
# API

A detailed documentation will come, until then check out the [examples](test/examples.js) in the test directory.


# Future Development

* A monitor tool that shows what services/nodes are available on the cluster and general cluster information
