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

function getSTTWatson(audioBytes) {
  return new Promise( (resolve, reject) => {
    const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
    const credentials_watson = require('../../resources/watson_credentials.json');
    const fs = require('fs');
    const speechToText = new SpeechToTextV1({
      iam_apikey: credentials_watson.iam_apikey,
      url: credentials_watson.url
    });
    const fileName = 'resources/eai_tv_liga_ai_kevin.wav';
    const file = fs.readFileSync(fileName);
    const params = {
      audio: file,
      content_type: 'audio/wav',
      word_alternatives_threshold: 0.9,
      model: 'pt-BR_BroadbandModel'
    };
    
    speechToText.recognize(params).then(speechRecognitionResults => {
      console.log(JSON.stringify(speechRecognitionResults, null, 2));
      resolve(speechRecognitionResults.results[0].alternatives[0].transcript);
    })
    .catch(err => {
      console.log('error:', err);
    });;
  });
  
}
exports.getSTTWatson = getSTTWatson;

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

function getTTSGoogle(text) {
  return new Promise ( async (resolve, reject) => {
    const textToSpeech = require('@google-cloud/text-to-speech');
    const util = require('util');
    const client = new textToSpeech.TextToSpeechClient(config);
    const request = {
      input: {text: text},
      voice: {languageCode: 'pt-BR', ssmlGender: 'NEUTRAL'},
      audioConfig: {audioEncoding: 'MP3'},
    };
    const [response] = await client.synthesizeSpeech(request);
    writeAudio(response.audioContent);
  })
}
exports.getTTSGoogle = getTTSGoogle;

function getTTSPolly(text) {
  const AWS = require('aws-sdk')
  AWS.config.loadFromPath('resources/amazon_credentials.2.json');
  const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
  })

  let params = {
    'Text': text,
    'OutputFormat': 'mp3',
    'VoiceId': 'Ricardo'
  }
  Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.log(err.code)
    } else if (data) {
      if (data.AudioStream instanceof Buffer) {
        writeAudio(data.AudioStream);
      }
    }
  })
}
exports.getTTSPolly = getTTSPolly;

function writeAudio(audio) {
  const fs = require('fs');
  fs.writeFile("speech.mp3", audio, function(err) {
    if (err) {
      return console.log(err)
    }
    console.log("The file was saved!")
  })
}
