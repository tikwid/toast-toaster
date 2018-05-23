const assert = require('assert');
const app = require('../../src/app');

describe('\'dht\' service', () => {
  it('registered the service', () => {
    const service = app.service('dht');

    assert.ok(service, 'Registered the service');
  });
});
