"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

function getTTS(audioBytes) {
  return new Promise( (resolve, reject) => {
    const speech = require('@google-cloud/speech'); 
    const TTS_config = require('../../resources/Idoso-Sarado-590a3ef36dc2.json');
    const session_config = {
      credentials: {
        private_key: TTS_config.private_key,
        client_email: TTS_config.client_email
      }
    }
    const client = new speech.SpeechClient(session_config);  // Creates a client
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
exports.getTTS = getTTS;

function getNLU(speech) {
  return new Promise( async (resolve, reject) => {
    const dialogflow = require('dialogflow');
    const uuid = require('uuid')
    const dialog_flow_config = require('../../resources/newagent-16dd6-2707dae8696b.json');
    const config = {
      credentials: {
        private_key: dialog_flow_config.private_key,
        client_email: dialog_flow_config.client_email
      }
    }
    const sessionClient = new dialogflow.SessionsClient(config)
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.sessionPath(dialog_flow_config.project_id, sessionId);
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