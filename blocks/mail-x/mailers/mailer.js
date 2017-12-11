const nodemailer = require('nodemailer');


module.exports = Mailer;


/**
 * Mailer for MailX using SMTP
 * @param {Object} objConfig              Configuration object
 * @param {Variable} varNodeMailerTransport nodemailer transport
 */
function Mailer(objConfig, varNodeMailerTransport) {
  this.send = send;


  /**
   * NodeMailer Transporter object
   * @type {Object}
   */
  this.mailer = nodemailer.createTransport(varNodeMailerTransport);


  /**
   * Send email using MailX Email object
   * @param  {[type]} objEmail [description]
   * @return {[type]}          [description]
   */
  function send(objEmail) {
    let objEmailOptions = {
      from: objConfig.from,
      replyTo: objConfig.replyTo,
      to: objEmail.to.join(', '),
      subject: objEmail.subject
    };

    if (objEmail.text) {
      objEmailOptions.text = objEmail.text;
    } else {
      objEmailOptions.html = objEmail.html;
    }

    return new Promise((fnResolve, fnReject) => {
      this.mailer.sendMail(objEmailOptions, (error, info) => {
        if (error) {
          return fnReject(error);
        }
        return fnResolve(info);
      });
    });
  }
}