const Mailer = require('./mailer.js');
const mandrillTransport = require('nodemailer-mandrill-transport');


module.exports = MandrillMailer;


/**
 * Mailer instance to send emails using mandrill
 * @type {Mailer}
 */
function MandrillMailer(objConfig, strApiKey) {

  return new Mailer(objConfig, mandrillTransport({
    auth: {
      apiKey: strApiKey
    }
  }));

}