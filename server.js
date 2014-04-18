'use strict';
var namespacedRequire = require('./lib/namespacedRequire');
var _ = require('lodash');
var axon = require('axon');
var rpc = require('axon-rpc');
var format = require('util').format;
var mongoose = namespacedRequire('mongoose','server');
var collectionMethods = ['ensureIndex','findAndModify','findOne','find','insert','save','update','getIndexes','mapReduce'];

module.exports = mongoose;

init();

function init () {

    var Models = {};
    var sock = axon.socket('rep');
    var rpcServer = new rpc.Server(sock);
    
    if (!mongoose.originalCreateConnection) {
        mongoose.originalCreateConnection = mongoose.createConnection;
        mongoose.originalConnect = mongoose.connect;
        mongoose.originalModel = mongoose.model;
    }

    mongoose.model = function (name, schema, collection, skipInit) {
        var model = mongoose.originalModel.apply(mongoose, arguments);
        var coll = model.collection;
        var conn = coll.conn;
        var collName = coll.name;
        var doExpose = function (){
            var dbName = conn.db.databaseName;
            collectionMethods.forEach(function(methodName){
                var rpcMethodName = format("%s::%s::%s",dbName,collName,methodName);
                rpcServer.expose(rpcMethodName, model.collection[methodName].bind(model.collection) );
            });
        }
        
        if ( conn._hasOpened ) {
            doExpose();
        } else {
            conn.once('connected',doExpose);
        }
        
        Models[name] = model;
        return model;
    };

    mongoose.createMongoConnection = function () {
        var connection = mongoose.originalCreateConnection.apply(mongoose, arguments);
        connection.model = mongoose.model;
        return connection;
    };
    
    mongoose.connectMongo = function () {
        var connection = mongoose.originalConnect.apply(mongoose, arguments);
        connection.model = mongoose.model;
        mongoose.connection.model = mongoose.model;
        return connection;
    };
    
    mongoose.listen = function ( rpcHost, callback ) {
        
        var cb = _.once(callback||function(){});
        sock.bind(rpcHost);
        sock.once('error',function(err){
            sock.close();
            cb(err);
        });
        sock.once('bind',function(){
            cb(null);
        })
        
    }
    
    return mongoose;
};