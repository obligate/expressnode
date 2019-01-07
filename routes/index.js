//var express = require('express');
import express from 'express';
import {WebhookClient,Card, Suggestion} from 'dialogflow-fulfillment';
//import  dialogflow  from  'dialogflow';
var apiai = require('apiai');
//const GOOGLE_APPLICATION_CREDENTIALS="/helloworld-10487020ccea.json";
import { dialogflow,Image,Carousel,SimpleResponse } from  'actions-on-google';
// Create an app instance
const app = dialogflow();
//const app = new dialogflow.AgentsClient();
// Register handlers for Dialogflow intents

app.intent('Default Welcome Intent', conv => {
    conv.ask('Hi, how is it going?');
    conv.ask(`Here's a picture of a cat`);
    conv.ask(new Image({
        url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
        alt: 'A cat',
    }))
});

// Intent in Dialogflow called `Goodbye`
app.intent('Goodbye', conv => {
    conv.close('See you later!');
});

app.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't understand. Can you tell me something else?`);
});
app.intent("Languages - custom",languagecustom);
app.intent("weatherlike",weatherlike);


let router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    // const agentClient=WebhookClient({req,res});
    // agentClient.ask("hello I am the agentClient!!");
    let json = {
        code: 200,
        msg: '请求成功',
        data: {
            userId: '123456',
            name: 'Terry',
            blog: 'https://yunm.coding.me'
        }
    }
    //res.render('index', { title: 'Express' });
   // res.send(json);
});
router.post('/test', function(req, res, next) {
    //Create an instance
    const agentClient = new WebhookClient({request: req, response: res});
    console.log("123========"+typeof agentClient);
    let json = {
        code: 200,
        msg: '请求成功',
        data: {
            userId: '123456',
            name: 'Terry',
            blog: 'https://yunm.coding.me'
        }
    };
    let conv= agentClient.conv();
    console.log("conv========"+Object.is(conv, null));
    console.log("678---"+JSON.stringify(agentClient));
    console.log("789---"+JSON.stringify(conv));
    conv.ask("hello client webhook!!!");
    //res.render('index', { title: 'Express' });
     //res.send(json);
});
function echo(intent,parameters)
{
    return "echo fullfillment result: intentname:"+intent.displayName+" ,parameters:"+parameters.echoText;
}
function weather(intent,parameters)
{
    return "weather fullfillment result: intentname:"+intent.displayName+" ,parameters:"+parameters.location.city+" "+parameters.date;
}
function weatherlikeII(intent,parameters) {
    let tempNum = Math.floor(Math.random()*100);
    return "weather city:"+parameters.location.city+" day:"+parameters.date.substring(0,10)+" sunny  "+(tempNum<40?tempNum:39)+"°C";
}
router.post('/add', function(req, res, next) {
    let speech =
        req.body.result &&
        req.body.result.parameters &&
        req.body.result.parameters.echoText
            ? req.body.result.parameters.echoText
            : "Seems like some problem. Speak again.";
    console.log(req.body.queryResult.intent);
    let parametersObject=req.body.queryResult.parameters;
    let intentObject=req.body.queryResult.intent;
    let intentName=req.body.queryResult.intent.displayName;
    console.log(intentName);
    console.log(parametersObject);
    switch(intentName){
        case "Echo":
            speech=echo(intentObject,parametersObject);
            break;
        case "weather":
            speech=weather(intentObject,parametersObject);
            break;
        case "weatherlike":
            speech=weatherlikeII(intentObject,parametersObject);
            break;
        default: speech="sorry, I can not understand\n what can I do for you?"
    }
    //res.render('index', { title: 'Express' });
    res.send({
        fulfillmentText: speech,
        //fulfillmentMessages: speech,
        source: "webhook-echo-sample"
    });
});
//intent anction========================================================
function welcome(agent) {
    agent.add(`Welcome to my agent!`);
}
function languagecustom(agent){
    console.log("json==="+JSON.stringify(agent.parameters));
    let req_duration=agent.parameters["duration"];
    console.log(JSON.stringify(agent.contexts));
    const contextweacher = agent.contexts.get("languages-followup").parameters.language;
    console.log("789---"+JSON.stringify(contextweacher));
    //let language=contextweacher.parameters.language;
    let language=contextweacher;
    let answer = "I can't believe you've known "+language+"for " +req_duration.amount+" "+req_duration.unit+" !";
    let result={
        fulfillmentText: answer,
        //fulfillmentMessages: speech,
        source: "webhook-echo-sample"
    };
    agent.json(result);
    //app.ask(answer);
}
function weatherlike(agent) {
     //const contextweacher = agent.contexts.get(`weather-followup`);
    //console.log(contextweacher.parameters.language);
    let day =agent.parameters.date;
    let city =agent.parameters.location.city;
    console.log(day);
    console.log(city);
    let tempNum = Math.floor(Math.random()*100);
    //let answer="weather fullfillment result: intentname:"+agent.intent.displayName+" ,parameters:"+parameters.location.city+" "+parameters.date
    let answer ="weather city:"+city+" day:"+day.substring(0,10)+" sunny  "+(tempNum<40?tempNum:39)+"°C";
    //agent.add(answer);
    console.log(answer);
    //agent.add(answer)
    let result={
        fulfillmentText: answer,
        //fulfillmentMessages: speech,
        source: "webhook-echo-sample"
    };
    agent.json(result);
}


router.post('/send',function(req,res,next){
    const client = apiai('38f5a7e2cb844a96a7b81053761178db');
        console.log(req.body.queryText);
        let request =client.textRequest(req.body.queryText,{
            sessionId: 'cb5a13e6-7503-9b0f-4203-031958dd8d06'
            });
        request.on('response', function(response) {
            console.log(response);
            res.send(response.result);
        });

        request.on('error', function(error) {
            console.log(error);
            res.send(" this is error function");
        });
        request.end();
});
function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
}
router.post('/put', app);
module.exports = router;
