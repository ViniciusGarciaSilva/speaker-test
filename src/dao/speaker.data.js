"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const newAgent = require('../../resources/newagent-16dd6-2707dae8696b.json');
const config = {
  credentials: {
    private_key: newAgent.private_key,
    client_email: newAgent.client_email
  }
}

function getSTT(audioBytes) {
  return new Promise( (resolve, reject) => {
    const speech = require('@google-cloud/speech'); 
    const client = new speech.SpeechClient(config);  // Creates a client
    const audio = {
      content: audioBytes,
    };
    const audio_config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 44100,
      languageCode: 'pt-BR',
    };
    const request = {
      audio: audio,
      config: audio_config,
    };
    client
      .recognize(request)
      .then(data => {
        const response = data[0];
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        console.log(`Transcription: ${transcription}`);
        resolve(transcription);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  })
}
exports.getSTT = getSTT;

function getNLU(speech) {
  return new Promise( async (resolve, reject) => {
    const dialogflow = require('dialogflow');
    const uuid = require('uuid');
    const sessionClient = new dialogflow.SessionsClient(config)
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.sessionPath(newAgent.project_id, sessionId);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: speech,
          languageCode: 'pt-BR',
        },
      },
    };
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
      resolve(result.fulfillmentText);
    } else {
      console.log(`No intent matched.`);
    }
  })
}
exports.getNLU = getNLU;

function getTTS(text) {
  return new Promise ( async (resolve, reject) => {
    const textToSpeech = require('@google-cloud/text-to-speech');
    const fs = require('fs');
    const util = require('util');
    const client = new textToSpeech.TextToSpeechClient(config);
    const request = {
      input: {text: text},
      voice: {languageCode: 'pt-BR', ssmlGender: 'NEUTRAL'},
      audioConfig: {audioEncoding: 'LINEAR16'},
    };
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.wav', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
  })
}
exports.getTTS = getTTS;

function getTTSPolly(text) {
  const AWS = require('aws-sdk')
  const Fs = require('fs')
  AWS.config.loadFromPath('resources/amazon_credentials.json');
  const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
  })

  let params = {
    'Text': 'Hi, my name is @anaptfox.',
    'OutputFormat': 'mp3',
    'VoiceId': 'Kimberly'
  }
  Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.log(err.code)
    } else if (data) {
      if (data.AudioStream instanceof Buffer) {
        Fs.writeFile("speech.mp3", data.AudioStream, function(err) {
          if (err) {
            return console.log(err)
          }
          console.log("The file was saved!")
        })
      }
    }
  })
}
exports.getTTSPolly = getTTSPolly;

