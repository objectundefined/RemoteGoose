'use strict';
var db = require('./db');

var ClientCollection = require('./ClientCollection');

//-------------------------------------------------------------------------
//
// Public Methods
//
//-------------------------------------------------------------------------

exports.client = function (Model) {

    //-------------------------------------------------------------------------
    //
    // Private Methods that mimic the mongoose api overriding the default driver
    //
    //-------------------------------------------------------------------------

    Model.prototype.collection = new ClientCollection(Model.prototype.collection, Model);
    Model.collection = Model.prototype.collection;

    return Model;
};

