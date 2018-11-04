'use strict';
var server = require('../server/server.js');
var router = require('../server/router.js');
var handler = require('../server/handler.js');

var handle={};
handle["/"]=handler.home;
handle["/home"]=handler.home;
handle["/admin"]=handler.admin;
handle["/post"]=handler.post;
handle["/edit"]=handler.edit;
handle["/categories"]=handler.categories;
handle["/tags"]=handler.tags;

server.startServer(router.route,handle);

