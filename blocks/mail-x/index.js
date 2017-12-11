"use strict";


module.exports = MailX;


let Sendgrid = require("sendgrid");
let EmailObject = require('./email.js');
let MandrillMailer = require('./mailers/mandrill_mailer.js');
let SendgridMailer = require('./mailers/sendgrid_mailer.js');


////////////////////////////////////////////////////////////


function MailX(objMailConfig, strMailerName) {
  this.send = send;
  this.Email = Email;
  this.mailer = getMailer(strMailerName, objMailConfig);


  /**
   * This function send the email
   * @param  {Object} objNewMail Email object to send
   * @return {Promise}           Email promise
   */
  function send(objNewMail) {
    return this.mailer.send(objNewMail).then(() => true).catch(() => false);
  }


  /**
   * Standard mail object
   * @param {Array} listTo     List of targets
   * @param {[type]} strSubject Mail subject
   * @param {Object} objBody    Mail body
   * @param {Array} listBcc    List of bcc targets
   * @param {Object} objHeaders Headers object
   * @param {Object} objExtend  Mail extended.
   */
  function Email(listTo, strSubject, objBody, listBcc, objHeaders, objExtend) {
    return new EmailObject(objMailConfig.from, objMailConfig.replyTo, listTo, strSubject, objBody, listBcc, objHeaders, objExtend);
  }
}


/**
 * Returns a mailer based on its name, if an invalid or null name is given the
 * returned mailer is the default.
 *
 * @param  {String} strMailerName Mailer name
 * @param  {Object} objMailConfig Email configuration for mailer
 * @return {Object}               Mailer instance
 */
function getMailer(strMailerName, objMailConfig) {
  let objMailers = {
    'sendgrid': getSendgridMailer(objMailConfig),
    'mandrill': getMandrillMailer(objMailConfig)
  };
  return objMailers[strMailerName] || objMailers[objMailConfig.defaultMailer];
}


/**
 * Returns a mandrill mailer based on the given configuration
 * @param  {Object} objMailConfig Mail configuration
 * @return {Object}               Mandrill Mailer
 */
function getMandrillMailer(objMailConfig) {
  return MandrillMailer(objMailConfig, objMailConfig.mandrill.key)
}


/**
 * Returns a sendgrid mailer based on the given configuration
 * @param  {Object} objMailConfig Mail configuration
 * @return {Object}               Sendgrid Mailer
 */
function getSendgridMailer(objMailConfig) {
  return SendgridMailer(objMailConfig, objMailConfig.sendgrid.key)
}
