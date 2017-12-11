'use strict';


module.exports = Email;


/**
 * Mail Object
 * @param {Array} listTo     List of targets
 * @param {[type]} strSubject Mail subject
 * @param {Object} objBody    Mail body
 * @param {Array} listBcc    List of bcc targets
 * @param {Object} objHeaders Headers object
 * @param {Object} objExtend  Mail extended.
 */
function Email(strFrom, strReplyTo, listTo, strSubject, objBody, listBcc, objHeaders, objExtend) {
  this.to = listTo;
  this.from = strFrom;
  this.subject = strSubject;
  this.bcc = listBcc;
  this.replyto = strReplyTo,
  this.headers = objHeaders;

  if (objBody.type == 'html') {
    this.html = objBody.value;
    this.headers = {
      'Content-Type': 'text/html'
    }
  }
  else {
    this.text = objBody.value;
  }

  Object.assign(this, objExtend);
}