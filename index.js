'use strict';
process.setMaxListeners(0);
const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.20c102b2-d8fe-4823-bb50-8674d031b450';  
const log = require('lambda-log');
const https = require('https');

const welcomeOutput = '';
const welcomeReprompt = '';
const hostname = "7a524b3c.ngrok.io";

let speechOutput;

const handlers = {
    'LaunchRequest': function () {
		this.response.speak(welcomeOutput).listen(welcomeReprompt);
		this.emit(':responseReady');
    },
    'pptnextslide': function () {
		let myHandler = this;
		let reprompt;

		let request_options = {
			host: hostname, //Change this to your webhook setting.
			path: "/?next",
			method: "GET",
		}
		let request = https.request(request_options, function(r) {
			console.log("RESPONSE - STATUS:" + r.statusCode);
			r.on("data", function(d) {
				console.log("RESPONSE:" + d);
			});
			r.on("end", function() {
				console.log("END: returning speech output");
				myHandler.emit(":responseReady");
			});
			r.on("error", function(e) {
				console.log("ERROR:");
				console.error(e);
				speechOutput = "Sorry, there was problem";
				myHandler.emit(":responseReady");
			});
		});
		request.end();

    },

	'pptprevslide': function () {
		let myHandler = this;
		let reprompt;

		let request_options = {
			host: hostname, //Change this to your webhook setting.
			path: "/?previous",
			method: "GET",
		}
		let request = https.request(request_options, function(r) {
			console.log("RESPONSE - STATUS:" + r.statusCode);
			r.on("data", function(d) {
				console.log("RESPONSE:" + d);
			});
			r.on("end", function() {
				console.log("END: returning speech output");
				myHandler.emit(":responseReady");
			});
			r.on("error", function(e) {
				console.log("ERROR:");
				console.error(e);
				speechOutput = "Sorry, there was problem";
				myHandler.emit(":responseReady");
			});
		});
		request.end();	
    },


	'ppttoslide': function () {
		let myHandler = this;
		let reprompt;

        let slidenumber = isSlotValid(this.event.request, 'slidenumber');
		
		let request_options = {
			host: hostname, //Change this to your webhook setting.
			path: "/?slide=" + slidenumber,
			method: "GET",
		}
		let request = https.request(request_options, function(r) {
			console.log("RESPONSE - STATUS:" + r.statusCode);
			r.on("data", function(d) {
				console.log("RESPONSE:" + d);
			});
			r.on("end", function() {
				console.log("END: returning speech output");
				myHandler.emit(":responseReady");
			});
			r.on("error", function(e) {
				console.log("ERROR:");
				console.error(e);
				speechOutput = "Sorry, there was problem";
				myHandler.emit(":responseReady");
			});
		});
		request.end();
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = '';
        reprompt = '';
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = '';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        speechOutput = '';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        let speechOutput = '';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
};

exports.handler = (event, context) => {
	log.config.meta.event = event;
	log.config.tags.push(event.env);
	log.info('my lambda function is running!');
    let alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function isSlotValid(request, slotName){
	let slot = request.intent.slots[slotName];
    let slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
		//we have a value in the slot
        slotValue = slot.value.toLowerCase().trim();
		return slotValue;
	} else {
		//we didn't get a value in the slot.
        return false;
    }
}
