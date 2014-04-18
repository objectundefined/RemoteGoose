'use strict';
var namespacedRequire = require('./lib/namespacedRequire');
var _ = require('lodash');
var Model = require('./lib/Model');
var clientModel = Model.client;
var db = require('./lib/db');
var logger = require('./lib/Logger');
var rpc = require('axon-rpc');
var axon = require('axon');
var rpc = require('axon-rpc');
var mongoose = namespacedRequire('mongoose','client');

module.exports = mongoose;

function init () {

    var Models = {};
    
    if (!mongoose.originalCreateConnection) {
        mongoose.originalCreateConnection = mongoose.createConnection;
        mongoose.originalConnect = mongoose.connect;
        mongoose.originalModel = mongoose.model;
    }

    mongoose.model = function (name, schema, collection, skipInit) {
        var model = mongoose.originalModel.call(mongoose, name, schema, collection, skipInit);
        clientModel(model);
        if(model.schema.options.autoIndex){
            model.ensureIndexes();
        }
        Models[name] = model;
        return model;
    };

    mongoose.createConnection = function (rpcHost, database, callback) {
        var connection = mongoose.originalCreateConnection.call(mongoose, database, {}, function () {
            handleConnection(rpcHost, connection, callback);
        });
        connection.model = mongoose.model;
        return connection;
    };
    
    mongoose.connect = function (rpcHost, database, callback) {
        var connection = mongoose.originalConnect.call(mongoose, database, {}, function () {
            handleConnection(rpcHost, connection.connection, callback);
        });
        connection.model = mongoose.model;
        mongoose.connection.model = mongoose.model;
        return connection;
    };
    
    function handleConnection(rpcHost, connection, callback) {
        connection.emit('connecting');
        
        console.log('connecting to rpc host', rpcHost);
        
        if (callback) {
            //Always return true as we are faking it.
            callback(null, connection);
        }
        connection.emit('connected');
        connection.emit('open');
    }
    
    return mongoose;
};