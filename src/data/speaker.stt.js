const fs = require('fs');
const google = require('@google-cloud/speech'); 
const watson = require('watson-developer-cloud/speech-to-text/v1');
const newAgent = require('../../resources/newagent-16dd6-2707dae8696b.json');

// Google speech-to-text
function getSTTGoogle(audioBytes) {
  return new Promise( (resolve, reject) => {
     
    // configure client
    const config = {
      credentials: {
        private_key: newAgent.private_key,
        client_email: newAgent.client_email
      }
    }
    
    // instantiate client
    const client = new google.SpeechClient(config);  // Creates a client
    
    // set request params
    const params = {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: 'pt-BR',
      },
    };

    // send request
    client.recognize(params)
      .then(data => {
        const response = data[0];
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        console.log("Speech-To-Text: ", transcription);
        resolve(transcription);
      })
      .catch(err => {
        console.error("Speech-To-Text ERROR: ", err);
      });
  });
}
exports.getSTTGoogle = getSTTGoogle;

// IBM Watson speech-to-text
function getSTTWatson(audio) {
  return new Promise( (resolve, reject) => {
    
    // configure client
    const credentials_watson = require('../../resources/watson_credentials.json');
    const config = {
      iam_apikey: credentials_watson.iam_apikey,
      url: credentials_watson.url
    }
    
    // instantiate client
    const speechToText = new watson(config);

    // set request parameters
    const params = {
      audio: audio,
      content_type: 'audio/wav',
      word_alternatives_threshold: 0.9,
      model: 'pt-BR_BroadbandModel'
    };
    
    // send request
    speechToText.recognize(params)
      .then(speechRecognitionResults => {
        console.log("Speech-To-Text: ", speechRecognitionResults.results[0].alternatives[0].transcript);
        resolve(speechRecognitionResults.results[0].alternatives[0].transcript);
      })
      .catch(err => {
        reject(err);
      });
  });
}
exports.getSTTWatson = getSTTWatson;