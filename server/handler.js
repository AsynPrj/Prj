'use strict';
var fs = require('fs');
const PATH=require('path');

function home(response,params){
    console.log("Excuting home for handler.")
    response.writeHead(200,{'Content-Type':'text/html'}); 
    fs.createReadStream(PATH.resolve(__dirname, '../user/index.html'),'utf-8').pipe(response);
}

function admin(response,params){
    console.log("Excuting home for handler.")
    response.writeHead(200,{'Content-Type':'application/json'}); 
    //fs.createReadStream(PATH.resolve(__dirname, '../user/admin.html'),'utf-8');
    fs.createReadStream(PATH.resolve(__dirname, '../test/test.json'),'utf-8').pipe(response);
    response.end(JSON.stringify(params));
}

function post(response,params){
    console.log("Excuting post for handler.")
    response.writeHead(200,{'Content-Type':'text/html'}); 
    fs.createReadStream(PATH.resolve(__dirname, '../user/post.html'),'utf-8').pipe(response);
}

function categories(response,params){
    console.log("Excuting catefories for handler.")
    response.writeHead(200,{'Content-Type':'text/html'}); 
    fs.createReadStream(PATH.resolve(__dirname, '../user/categories.html'),'utf-8').pipe(response);
}

function tags(response,params){
    console.log("Excuting tags for handler.")
    response.writeHead(200,{'Content-Type':'text/html'}); 
    fs.createReadStream(PATH.resolve(__dirname, '../user/tags.html'),'utf-8').pipe(response);
}

function edit(response,params){
    console.log("Excuting edit for handler.")
    response.writeHead(200,{'Content-Type':'text/html'}); 
    fs.createReadStream(PATH.resolve(__dirname, '../user/edit.html'),'utf-8').pipe(response);
}




module.exports = {
    home:home,
    admin:admin,
    post:post,
    tags:tags,
    categories:categories,
    edit:edit
}