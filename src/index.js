/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

const ADMIN_EMAIL = "admin@toast.org.nz"
const ADMIN_PASSWORD = require("uuid/v4")()

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () => {
  logger.info('Feathers application started')
 
  // if there are no admin users in the system, create an admin user.
  const users = app.service('users')
  users.find({query: {'role': 'admin'}}).then((res) => { 
    if (res.total === 0) {
       users.create({email:ADMIN_EMAIL, password:ADMIN_PASSWORD, role:'admin'}).then((res) => {
         console.log('Created an admin user!')
         console.log(`Email: ${ADMIN_EMAIL}`)
         console.log(`Password: ${ADMIN_PASSWORD}`)
       })
     }
   } )
});
