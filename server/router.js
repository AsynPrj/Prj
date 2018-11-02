'use strict';
var fs = require('fs');
const PATH=require('path');

function route(handle,pathname,response,params){
    console.log('Routing a request for '+ pathname);
    if (typeof handle[pathname] === 'function'){
        handle[pathname](response,params);
    } else {
        console.log("No handler for "+ pathname);
        response.writeHead(200,{'Content-Type':'text/html'}); 
        fs.createReadStream(PATH.resolve(__dirname, '../user/404.html'),'utf-8').pipe(response);
    }
}

module.exports.route = route;