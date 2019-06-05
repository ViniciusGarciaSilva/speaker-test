const speakerData = require('../dao/speaker.data');

// Recebe um arquivo de audio em base 64
exports.get = async function(req, res, next) {
  const audioBytes = defaultAudio(); // mock
  let transcription; 
  let response;
  // speakerData.getSTT(audioBytes)
  speakerData.getSTTWatson(audioBytes)
    .then( TTS_result => {
      transcription = TTS_result;
      speakerData.getNLU("tv")
      .then (NLU_result => {
        response = NLU_result;
        speakerData.getTTSGoogle(response);
        //speakerData.getTTSPolly(response);
        res.status(200).send({
          transcription: transcription,
          response: response
        })
      }); 
    })
}

function defaultAudio() {
  const fileName = 'resources/eai_tv_liga_ai_kevin.wav';
  const fs = require('fs');
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');
  return audioBytes;
}