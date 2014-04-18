'use strict';
var namespacedRequire = require('./lib/namespacedRequire');
var _ = require('lodash');
var axon = require('axon');
var rpc = require('axon-rpc');
var mongoose = namespacedRequire('mongoose','client');
var collectionMethods = ['ensureIndex','findAndModify','findOne','find','insert','save','update','getIndexes','mapReduce'];

module.exports = mongoose;

init();

function init () {

    var Models = {};
    
    if (!mongoose.originalCreateConnection) {
        mongoose.originalCreateConnection = mongoose.createConnection;
        mongoose.originalConnect = mongoose.connect;
        mongoose.originalModel = mongoose.model;
        mongoose.createConnection = undefined;
        mongoose.connect = undefined;
    }
    
    mongoose.model = function (name, schema, collection, skipInit) {
        var model = clientModel(mongoose.originalModel.call(mongoose, name, schema, collection, skipInit));
        if(model.schema.options.autoIndex){
            model.ensureIndexes();
        }
        Models[name] = model;
        return model;
    };

    mongoose.createRemoteConnection = function (rpcHost, database, callback) {
        var connection = mongoose.originalCreateConnection.call(mongoose, database, {}, function () {
            handleConnection(rpcHost, database, connection, callback);
        });
        connection.model = mongoose.model;
        return connection;
    };
    
    mongoose.connectRemote = function (rpcHost, database, callback) {
        var connection = mongoose.originalConnect.call(mongoose, database, {}, function () {
            handleConnection(rpcHost, database, connection.connection, callback);
        });
        connection.model = mongoose.model;
        mongoose.connection.model = mongoose.model;
        return connection;
    };
    
    function handleConnection(rpcHost, database, connection, callback) {
        connection.emit('connecting');
        var sock = axon.socket('req');
        var rpcClient = connection.rpcClient = new rpc.Client(sock);
        var cb = _.once(callback||function(){});
        sock.connect(rpcHost);
        sock.once('error',function(err){
            sock.close();
            cb(err);
        });
        sock.once('connect',function(){
            connection.emit('connected');
            connection.emit('open');
            cb(null,connection);
        })
    }
    
    return mongoose;
};