/* global describe, it */

const chai = require('chai'),
  assert = chai.assert;

const rootPrefix = '../../..',
  constants = require(rootPrefix + '/mocha_test/lib/constants'),
  utils = require(rootPrefix + '/mocha_test/lib/utils'),
  apiErrorConfig = require(rootPrefix + '/config/api_error_config'),
  InstanceComposer = require(rootPrefix + '/instance_composer'),
  configStrategy = require(rootPrefix + '/mocha_test/scripts/config_strategy'),
  instanceComposer = new InstanceComposer(configStrategy);

require(rootPrefix + '/lib/contract_interact/workers');

const workersModule = instanceComposer.getWorkersInteractClass(),
  workers = new workersModule(constants.workersContractAddress, constants.chainId),
  web3ProviderFactory = instanceComposer.getWeb3ProviderFactory(),
  web3Provider = web3ProviderFactory.getProvider(web3ProviderFactory.typeWS);

describe('Remove', function() {
  it('should pass the initial address checks', function() {
    assert.isDefined(constants.deployer);
    assert.isDefined(constants.ops);
    assert.notEqual(constants.deployer, constants.ops);
  });

  it('should fail when gasPrice is null', async function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(100000);

    // set worker
    const response = await workers.remove(constants.ops, constants.opsPassphrase, 0, constants.optionsReceipt);

    // confirm failure reponse and message
    assert.equal(response.isFailure(), true);
    assert.equal(response.toHash().err.msg, apiErrorConfig['invalid_api_params'].message);
  });

  it('should fail when senderAddress is not valid', async function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(100000);

    // set worker
    const response = await workers.remove(0, constants.opsPassphrase, constants.gasUsed, constants.optionsReceipt);

    // confirm failure reponse and message
    assert.equal(response.isFailure(), true);
    assert.equal(response.toHash().err.msg, apiErrorConfig['invalid_api_params'].message);
  });

  it('should succeed', async function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(100000);

    // set worker
    const response = await workers.remove(
      constants.ops,
      constants.opsPassphrase,
      constants.gasUsed,
      constants.optionsReceipt
    );

    // verify if the transaction receipt is valid
    utils.verifyTransactionReceipt(response);

    // verify if the transaction has was actually mined
    await utils.verifyIfMined(workers, response.data.transaction_hash);

    // confirm worker address has no code
    const getCodeResult = await web3Provider.eth.getCode(constants.workersContractAddress);
    assert.equal(getCodeResult, '0x');
  });

  it('should pass for interaction layer test when return type is uuid', async function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(100000);

    // set worker
    const response = await workers.remove(
      constants.ops,
      constants.opsPassphrase,
      constants.gasUsed,
      constants.optionsUUID
    );

    // verify transaction UUID
    // we will not verify if it got mined as its just interaction layer testing
    utils.verifyTransactionUUID(response);
  });

  it('should pass for interaction layer test when return type is txHash', async function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(100000);

    // set worker
    const response = await workers.remove(
      constants.ops,
      constants.opsPassphrase,
      constants.gasUsed,
      constants.optionsHash
    );

    // verify transaction hash
    utils.verifyTransactionHash(response);
  });

  it('should pass for interaction layer test when return type is txReceipt', async function() {
    // eslint-disable-next-line no-invalid-this
    this.timeout(100000);

    // set worker
    const response = await workers.remove(
      constants.ops,
      constants.opsPassphrase,
      constants.gasUsed,
      constants.optionsReceipt
    );

    // verify transaction receipt
    utils.verifyTransactionReceipt(response);
  });
});
