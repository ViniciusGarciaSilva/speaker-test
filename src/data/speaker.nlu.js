const dialogflow = require('dialogflow');
const uuid = require('uuid');
const newAgent = require('../../resources/newagent-16dd6-2707dae8696b.json');
    
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
    
    // set request params
    const params = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'pt-BR',
        },
      },
    };

    // send request
    const responses = await client.detectIntent(params);
    const result = responses[0].queryResult;
    console.log(`NLU Query: ${result.queryText}`);
    console.log(`NLU Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`NLU Intent: ${result.intent.displayName}`);
      resolve(result.fulfillmentText);
    } else {
      console.log(`NLU: No intent matched.`);
    }
  })
}
exports.getNLUGoogle = getNLUGoogle;
