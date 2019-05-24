const speakerData = require('../dao/speaker.data');

exports.get = async function(req, res, next) {
  const fileName = 'resources/eai_tv_liga_ai_kevin.wav';
  const fs = require('fs');
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');
  let transcription; 
  let response;
  speakerData.getTTS(audioBytes)
    .then( TTS_result => {
      transcription = TTS_result;
      speakerData.getNLU(TTS_result)
      .then (NLU_result => {
        response = NLU_result;
        res.status(200).send({
          transcription: transcription,
          response: response
        })
      }); 
    })
}