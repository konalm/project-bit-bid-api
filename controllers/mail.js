const sgMail = require('@sendgrid/mail');

/**
 * email buyer to notify them off sale
 */
exports.sendMailNotificationToSeller = function (req, res) {
  sgMail.setApiKey('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');

  const msg = {
    to: 'connorlloydmoore@gmail.com',
    from: 'projectbb@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  sgMail.send(msg).catch(err => {
    console.log('ERROR');
    throw new Error(err);
  })

  res.send('mail notification sent to seller');
}
