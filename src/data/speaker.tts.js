const aws = require('aws-sdk');
const google = require('@google-cloud/text-to-speech');
const newAgent = require('../../resources/newagent-16dd6-2707dae8696b.json');

// Google text-to-speech
function getTTSGoogle(text) {
  return new Promise ( async (resolve, reject) => {
    
    // configure client
    const config = {
      credentials: {
        private_key: newAgent.private_key,
        client_email: newAgent.client_email
      }
    }
    
    // instantiate client
    const client = new google.TextToSpeechClient(config);
    
    // set request paramaters
    const params = {
      input: {text: text},
      voice: {languageCode: 'pt-BR', ssmlGender: 'NEUTRAL'},
      audioConfig: {audioEncoding: 'MP3'},
    };
    
    // send request
    const [response] = await client.synthesizeSpeech(params);
    if(response && response.audioContent) {
      console.log('Text-To-Speech Success!');
      resolve(response.audioContent);
    }
    else {
      console.log('Text-To-Speech ERROR');
      reject('error');
    }
  });
}
exports.getTTSGoogle = getTTSGoogle;

// Amazon Polly text-to-speech
function getTTSPolly(text) {
  return new Promise ( async (resolve, reject) => {
    
    // configure client
    aws.config.loadFromPath('resources/amazon_credentials.json');
    
    // instantiate client
    const client = new aws.Polly({
      signatureVersion: 'v4',
      region: 'us-east-1'
    })

    // set request parameters
    const params = {
      'Text': text,
      'OutputFormat': 'mp3',
      'VoiceId': 'Ricardo'
    }

    // send request
    client.synthesizeSpeech(params, (err, data) => {
      if (err) {
        console.log('Text-To-Speech ERROR', err.code);
        reject(err.code)
      } else if (data) {
        console.log('Text-To-Speech Success!');
        resolve(data.AudioStream);
      }
    });
  });
}
exports.getTTSPolly = getTTSPolly;
