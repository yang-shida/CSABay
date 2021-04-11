"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendConfirmationCode(_code, _email) {

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'csa.bay00@gmail.com', 
      pass: 'gogators00', 
    },
  });

  //token created??

  //disregard these next 2 lines - they were for testing
  //_email = 'sebastian.d.martinez1@gmail.com';
  //_code = 'bruhMoment';

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"CSA Bay Team" <csa.bay00@gmail.com>', 
    to: _email, 
    subject: "Your Verification Code for CSABay", 
    text: "Verification Code: " + _code, 
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendConfirmationCode().catch(console.error);