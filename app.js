/*************************************************************************************************

  Define global variables for NPM packages and Cloud Foundry environment

*************************************************************************************************/
"use strict";

var express = require('express'),
    cfenv = require("cfenv"),
    appEnv = cfenv.getAppEnv(),
    app = express(),
    bodyParser = require('body-parser'),
    watson = require('watson-developer-cloud');

/************************************************************************************************* 
  
  Start the server 
  
*************************************************************************************************/
app.use(bodyParser()); 

app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});

/*************************************************************************************************

50fd192d-fa16-49e9-bd4d-3be29dd54518



{
  "url": "https://gateway.watsonplatform.net/conversation/api",
  "username": "b10ff2db-6ac5-453b-af8d-6a0ad6e1a20d",
  "password": "6tW8twJI5BXf"
}






 Watson Conversation

*************************************************************************************************/
var conversation = watson.conversation({
    url: 'https://gateway.watsonplatform.net/conversation/api',   
    username: '31ffd869-a21b-4ea8-8511-e1096a576a8a',   // Set to your conversation username
    password: 'GbOFXRJvtaY7',   // Set to your conversation password
    version_date: '2016-07-11',
    version: 'v1'
});

// Allow clients to interact with the bot
app.post('/api/bot', function(req, res) {
    
    console.log("Got request for Le Bot");
    console.log("Request is: ",req);

    var workspace = '4bef4a09-4644-4bc8-96cb-329699c630e4'; // Set to your Conversation workspace ID

    if (!workspace) {
        console.log("No workspace detected. Cannot run the Watson Conversation service.");
    }

    var params = {
        workspace_id: workspace,
        context: {}, // Null context indicates new conversation
        input: {}    // Holder for message
    };

    // Update options to send to conversation service with the user input and a context if one exists
    if (req.body) {
        if (req.body.input) {
            params.input = req.body.input;
        }

        if (req.body.context) {
            params.context = req.body.context;
        }
    }

    // Send message to the conversation service with the current context
    conversation.message(params, function(err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            return res.status(err.code || 500).json(err);
        }

        console.log("Response: ", data);

        return res.json(data);
    });

}); // End app.post '/api/bot'

