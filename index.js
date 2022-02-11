const fs = require('fs');
const http = require ('http');
const path = require('path');
const url =require('url');

//FIles
// //Blocking
// const textIn=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `this is what we know about the avocado : ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut)
// console.log('FIle written');

// //Non-Blocking
// fs.readFile('./txt/start.txt','utf-8' , (err,data) => {
//     console.log(data);
// })


//Server


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);


const server=http.createServer((req,res) => {
    console.log(req.url);
    //console.log(req);
    const pathName = req.url;
    if (pathName=== "/overview")  {
        res.end("This is overview");
    }
    else if (pathName === "/api"){
        
            res.writeHead(200,{
                'Content-type': 'application/json'});
            res.end(data);
    }
    else if (pathName=== "/html")  {
        res.end("This is html");}
    else {
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        });
        //headers and status code needs to sent before sending respons
        res.end('<h1>Page not Found</h1>');
    }

});

//setting up port
server.listen(3000,()=>{
    console.log('server has been started on port 8000')
})