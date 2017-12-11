const Mailer = require('./mailer.js');
const sendgridTransport = require('nodemailer-sendgrid-transport');


module.exports = SendgridMailer;


/**
 * Mailer instance to send emails using sendgrid
 * @type {Mailer}
 */
function SendgridMailer(objConfig, strApiKey) {

  return new Mailer(objConfig, sendgridTransport({
    auth: {
      api_key: strApiKey
    }
  }));

}