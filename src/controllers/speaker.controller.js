const speakerNLU = require('../data/speaker.nlu');
const speakerTTS = require('../data/speaker.tts');
const speakerSTT = require('../data/speaker.stt');
var now = require("performance-now")
const fs = require('fs');

// Recebe um arquivo de audio em base 64, os nomes dos stt, tts e nlu
exports.post = async function (req, res, next) {
  console.log(req.body);
  try {
    let t0 = now();
    const transcription = await stt_execute(req.body.stt, req.body.audio);
    let t1 = now();
    logTime("SST_" + req.body.stt, (t1 - t0))

    t0 = now();
    const response = await nlu_execute(req.body.nlu, transcription);
    t1 = now();
    logTime("NLU_" + req.body.nlu, (t1 - t0))

    t0 = now();
    const audio = await tts_execute(req.body.tts, transcription); // response
    t1 = now();
    logTime("TTS_" + req.body.tts, (t1 - t0))

    writeAudio(audio);
    res.status(200).send({
      audio: audio
    });
  } catch (error) {
    console.log(error, "\nProcesso encerrado");
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
      reject("STT not recognized!")
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
      reject("TTS not recognized!")
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
      if (name == 'rasa') {
        const rasa_response = await speakerNLU.getNLURasa(text);
        resolve(rasa_response);
      }
      reject("NLU not recognized!")
    } catch (error) {
      reject(error);
    }
  })
}

function defaultAudio(base) {
  const fileName = 'resources/input_rogerio_ceni.wav';
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
async function logTime(name, time) {
  console.log('Call to ' + name + ' took ' + time + ' milliseconds.')
  await fs.appendFile('logs/' + name + '.txt', time + '\r\n', function (err) {
    if (err) {
      return console.log(err)
    }
  });
}
