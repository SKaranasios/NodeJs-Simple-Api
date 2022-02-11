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

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const replaceTemplate = (temp,product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g , 'not-organic');

    return output;
    
}


//array.map
//el is what holds data


const server=http.createServer((req,res) => {
    console.log(req.url);
    //console.log(req);
    //console.log(url.parse(req.url,true));
    const {query , pathname} = url.parse(req.url,true);

    //Overview Page
    if (pathname=== "/overview" ||  pathname === "/")  {
        res.writeHead(200,{
            'Content-type': 'text/html'
        });
        //loop over dataObj and with each itteration will replace tempalte-product/card
        //in arrow fnction not neccesary to write return
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        //console.log(cardsHtml);
        const output = tempOverview.replace('{%PRODUCTS_CARDS%}', cardsHtml);
        //console.log(cardsHtml);
        //read template overview
        res.end(output);
    }
    else if(pathname === "/product"){
        const product = dataObj[query.id];
        //console.log(query);
        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    }

    else if (pathname === "/api"){
        
            res.writeHead(200,{
                'Content-type': 'application/json'});
            res.end(data);
    }
    
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