/* const Dash = require('dash');

const clientOpts = {
  wallet: {
    mnemonic: 'a Dash wallet mnemonic with evonet funds goes here',
  },
};
const client = new Dash.Client(clientOpts); */

async function registerAlias(client, identityId, alias) {
  const platform = client.platform;
  const identity = await platform.identities.get(identityId);
  console.log(`Register alias for ${identityId}\n${identity}`);
  const aliasRegistration = await platform.names.register(
    `${alias}.dash`,
    { dashAliasIdentityId: identity.getId() },
    identity,
  );

  return aliasRegistration;
}

/* registerAlias()
  .then((d) => console.log('Alias registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect()); */

module.exports.registerAlias = registerAlias;
