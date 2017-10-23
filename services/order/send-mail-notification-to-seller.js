const sgMail = require('@sendgrid/mail');


sendMailNotificationToSeller = function (order, item, user) {
  sgMail.setApiKey('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');

  const email = user.email;
  /* item.user.email */

  const msg = {
    to: `${email}`,
    from: 'projectbb@gmail.com',
    subject: `New Sale #${order.id}`,
    html: `<strong>Well Done.</strong>
      <br />
      You have sold a new item. ${item.title} for £${item.price}.</strong>
      <br />
      to ${user.username}. Please Disaptch it in the next 48hours. `,
  };

  sgMail.send(msg).catch(err => {
    throw new Error(err);
  })
}

module.exports = sendMailNotificationToSeller;
