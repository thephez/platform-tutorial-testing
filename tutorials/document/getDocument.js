/* const Dash = require('dash');

const clientOpts = {
  apps: {
    tutorialContract: {
      contractId: '6Ti3c7nvD1gDf4gFi8a3FfZVhVLiRsGLnQ7nCAF74osi',
    },
  },
};
const client = new Dash.Client(clientOpts); */

async function getDocuments(client) {
  return client.platform.documents.get(
    'tutorialContract.note',
    {
      limit: 2, // Only retrieve 1 document
    },
  );
}

/* getDocuments()
  .then((d) => console.log(d))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.getDocuments = getDocuments;
