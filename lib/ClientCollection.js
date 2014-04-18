'use strict';

var logger = require('./Logger');
var ObjectId = require('mongodb').BSONPure.ObjectID;
var _ = require('lodash');

var db = require('./db');
var utils = require('./utils');
var filter = require('./options/Options');
var validation = require('./validation/Validation');
var operations = require('./operations/Operations');

module.exports = Collection;
function Collection(mongoCollection) {
    
    var collName = this.name = mongoCollection.name;
    var dbName = mongoCollection.conn.name;
    
    //-------------------------------------------------------------------------
    //
    // un implemented methods. If you need them why not contribute at
    // https://github.com/mccormicka/Mockgoose
    //
    //-------------------------------------------------------------------------


    this.ensureIndex = function (index, options, callback) {
      
    };

    this.getIndexes = function (callback) {
      
    };

    this.mapReduce = function () {
    };

    this.save = function () {

    };

    
    this.findAndModify = function (conditions, sort, castedDoc, options, callback) {
      
    };
    
    this.findOne = function (conditions, options, callback) {
      
    };

    this.find = function (conditions, options, callback) {

    };

    this.insert = function (obj, options, callback) {

    };

    this.update = function (conditions, update, options, callback) {

    };

    this.remove = function (conditions, options, callback) {

    };

    this.count = function (conditions, options, callback) {

    };

}
