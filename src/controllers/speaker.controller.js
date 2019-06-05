const speakerNLU = require('../dao/speaker.nlu');
const speakerTTS = require('../dao/speaker.tts');
const speakerSTT = require('../dao/speaker.stt');
const fs = require('fs');

// Recebe um arquivo de audio em base 64
exports.get = async function(req, res, next) {
  const audioBytes = defaultAudio(); // mock
  let transcription; 
  let response;
  // speakerSTT.getSTT(audioBytes)
  speakerSTT.getSTTWatson(fs.readFileSync('resources/eai_tv_liga_ai_kevin.wav'))
    .then( TTS_result => {
      transcription = TTS_result;
      speakerNLU.getNLUGoogle(transcription)
      .then (NLU_result => {
        response = NLU_result;
        speakerTTS.getTTSGoogle(response)
        //speakerTTS.getTTSPolly(response)
        .then( STT_result => {
          writeAudio(STT_result);
          res.status(200).send({
            transcription: transcription,
            response: response
          });
        })
      }); 
    })
}

function defaultAudio() {
  const fileName = 'resources/eai_tv_liga_ai_kevin.wav';
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');
  return audioBytes;
}

function writeAudio(audio) {
  fs.writeFile("output.mp3", audio, function(err) {
    if (err) {
      return console.log(err)
    }
    console.log("The file was saved!")
  })
}
