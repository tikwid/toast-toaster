const { authenticate } = require('@feathersjs/authentication').hooks;
const { Forbidden } = require('@feathersjs/errors');
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const checkAdmin = (context) => {
  if (context.params.provider
      && context.params.user.role !== 'admin') {
    throw new Forbidden()
  }
}

module.exports = {
  before: {
    all: [ checkAdmin ],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ hashPassword(), authenticate('jwt') ],
    update: [ hashPassword(),  authenticate('jwt') ],
    patch: [ hashPassword(),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
