const DHT = require('bittorrent-dht')
const { NotFound, GeneralError } = require('@feathersjs/errors')
const ed = require('supercop.js')

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.dht = new DHT({verify: ed.verify})
    this.dht.on('ready', () => {
      console.log('The DHT is ready!')
    })
  }

  get (hash, params) {
    return new Promise( (resolve,reject) => {
     this.dht.get(hash, { verify: ed.verify }, (err, res) => {
      if (err || !res) {
        return resolve(new NotFound)
      } else {
        return resolve({ hash: hash, value: res.v.toString('utf8') })
      }
    })
   })
  }

  create (data, params) {
    const value = Buffer.from(data.value, 'utf8')//Buffer.alloc(100).fill(data.value)
    var publicKey = data.publicKey && Buffer.from(data.publicKey, 'base64')
    var secretKey = data.secretKey && Buffer.from(data.secretKey, 'base64')

    var opts = secretKey ? {
      k: publicKey,
      seq: 0,
      v: value,
      sign: (buf) => {
        return ed.sign(buf, publicKey, secretKey)
      }
    } : { v: value }

    return new Promise((resolve, reject) => {
    this.dht.put(opts, (err, hash ,n) => {
      if (err) {
        console.log(err)
        console.log('dht put failed!')
        return resolve(new GeneralError)
      } else {
        console.log(`DHT put: ${hash.toString('hex')}`)
        return resolve({hash: hash.toString('hex')})
      }
    }) })
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
