const dialogflow = require('dialogflow');
const uuid = require('uuid');
const newAgent = require('../../resources/newagent-16dd6-2707dae8696b.json');
const axios = require('axios')

let contexts = [] 

// Rasa NLU
function getNLURasa(text) {
  return new Promise( async (resolve, reject) => {
    axios({
      method: 'post',
      url: 'http://localhost:5005/model/parse',
      data: {
        "text": "Ligar TV."
      }
    })
    .then( response => {
      axios({
        method: 'post',
        url: 'http://localhost:5005/conversations/default/execute',
        data: {
          "name": "utter_" + response.data.intent.name
        }
      })
      .then( response => {
        resolve(response.data.messages[0].text)
      })
      .catch( error => {
        reject(error)
      })
    })
    .catch( error => {
      reject(error)
    })
  })
}
exports.getNLURasa = getNLURasa;

// Google Dialog Flow NLU
function getNLUGoogle(text) {
  return new Promise( async (resolve, reject) => {
    
    // config client
    const client_config = {
      credentials: {
        private_key: newAgent.private_key,
        client_email: newAgent.client_email
      }
    }

    // instantiate client
    const client = new dialogflow.SessionsClient(client_config)
    
    // config session
    const projectId = newAgent.project_id;
    const sessionId = uuid.v4();
    
    // set session
    const sessionPath = client.sessionPath(projectId, sessionId);
    
    console.log('setando context: ', contexts)

    // set request params
    const params = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'pt-BR',
        },
      },
      queryParams: {
        contexts: contexts
      }
    };

    console.log('params: ', params)

    // send request
    try {
      const responses = await client.detectIntent(params);
      const result = responses[0].queryResult;
      console.log(`NLU Query: ${result.queryText}`);
      console.log(`NLU Response: ${result.fulfillmentText}`);
      if (result.intent) {
        console.log(`NLU Intent: ${result.intent.displayName}`);
        console.log(result)
        console.log('Contexts: ', result.outputContexts)
        contexts = result.outputContexts
        // result.outputContexts.forEach(outputContext => context.push(outputContext))
        resolve(result.fulfillmentText);
      } else {
        reject(`NLU: No intent matched.`);
      }
    } catch(error) {
      reject(error.details);
    }
    //.catch(error => reject(error.details))
   
  })
}
exports.getNLUGoogle = getNLUGoogle;
