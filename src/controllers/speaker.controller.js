const speakerNLU = require('../data/speaker.nlu');
const speakerTTS = require('../data/speaker.tts');
const speakerSTT = require('../data/speaker.stt');
// for tests: var now = require("performance-now")
const fs = require('fs');

// Recebe um arquivo de audio em base 64, os nomes dos stt, tts e nlu
exports.post = async function (req, res, next) {
  console.log(req.body);
  try {
    const transcription = await stt_execute(req.body.stt, req.body.audio);
    const response = await nlu_execute(req.body.nlu, transcription);
    const audio = await tts_execute(req.body.tts, response);
    t1 = now();
    logTime("TTS_" + req.body.tts, (t1 - t0));

    writeAudio(audio);
    res.status(200).send({
      audio: audio
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      Erro: `${error}`
    });
  }
}

function stt_execute(name, audio) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!name) {
        reject("No STT defined!");
      }
      if (name == 'watson') {
        const watson_transcription = await speakerSTT.getSTTWatson(defaultAudio());
        resolve(watson_transcription);
      }
      if (name == 'google') {
        const google_transcription = await speakerSTT.getSTTGoogle(defaultAudio(true));
        resolve(google_transcription);
      }
    } catch (error) {
      reject(error);
    }
  })
}

function tts_execute(name, text) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!name) {
        reject("No TTS defined!");
      }
      if (!text) {
        reject("No text provided for tts!");
      }
      if (name == 'polly') {
        const polly_audio = await speakerTTS.getTTSPolly(text);
        resolve(polly_audio);
      }
      if (name == 'google') {
        const google_audio = await speakerTTS.getTTSGoogle(text);
        resolve(google_audio);
      }
    } catch (error) {
      reject(error);
    }
  })
}

function nlu_execute(name, text) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!name) {
        reject("No NLU defined!");
      }
      if (!text) {
        reject("No text provided for NLU!");
      }
      if (name == 'dialog_flow') {
        const dialog_flow_response = await speakerNLU.getNLUGoogle(text);
        resolve(dialog_flow_response);
      }
    } catch (error) {
      reject(error);
    }
  })
}

function defaultAudio(base) {
  const fileName = 'resources/input.wav';
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');
  return base ? audioBytes : file;
}

function writeAudio(audio) {
  fs.writeFile("resources/output.wav", audio, function (err) {
    if (err) {
      return console.log(err)
    }
    console.log("The audio was saved!")
  })
}

// FUNCAO USADA PARA TESTES
// Para testes de tempo:
// let t0 = now();
// function();
// let t1 = now();
// logTime("TIPO_" + req.body.TIPO, (t1 - t0))
//
function logTime(name, time) {
  console.log('Call to ' + name + ' took ' + time + ' milliseconds.')
  fs.appendFile('logs/' + name + '.txt', time + '\r\n', function (err) {
    if (err) {
      return console.log(err)
    }
  });
}
