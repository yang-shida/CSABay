"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME, 
      pass: process.env.EMAIL_PWD, 
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendConfirmationCode(_code, _email) {

  

  //token created??

  //disregard these next 2 lines - they were for testing
  //_email = 'sebastian.d.martinez1@gmail.com';
  //_code = 'bruhMoment';

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"CSABay Team" <csa.bay00@gmail.com>', 
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

module.exports.sendCC = function(_code, _email) {
  sendConfirmationCode(_code, _email).catch(console.error);
}

const sendCreatePostEmail = async (newPost, email) => {
    var timeOffset = new Date(Date.now()).getTimezoneOffset()*60*1000
    var endTimeUnix = newPost.durationDays * 24 * 3600 * 1000 + Date.parse(newPost.modifiedTimestamp) - timeOffset
    endTimeUnix=Math.ceil(endTimeUnix/1000/3600/24)*1000*3600*24 + timeOffset
    const endTimeStr = new Date(endTimeUnix).toLocaleString("en-US", { timeZone: 'America/New_York' })

    let info = await transporter.sendMail({
        from: '"CSABay Team" <csa.bay00@gmail.com>', 
        to: email, 
        subject: "[CSABay] New Post Created", 
        text:   "You created a new post on CSABay." + "\n"
                + "Your post will expire on " + endTimeStr + " EST" + "\n"
                + "You can extend the expiration date by updating your post later." + "\n"
                + "\n"
                + "\n"
                + "Below is the summary of your post: " + "\n"
                + "Title: " + newPost.title + "\n"
                + "Description: " + newPost.description + "\n"
                + "Post Duration (Days): " + newPost.durationDays + "\n"
                + "Type of Your Post: " + newPost.typeOfPost + "\n"
                + "Created Time: " + new Date(Date.parse(newPost.createdTimestamp)).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST"
    });
}

exports.sendCreatePostEmail = sendCreatePostEmail;

const sendUpdatePostEmail = async (newPost, email) => {
    var timeOffset = new Date(Date.now()).getTimezoneOffset()*60*1000
    var endTimeUnix = newPost.durationDays * 24 * 3600 * 1000 + Date.parse(newPost.modifiedTimestamp) - timeOffset
    endTimeUnix=Math.ceil(endTimeUnix/1000/3600/24)*1000*3600*24 + timeOffset
    const endTimeStr = new Date(endTimeUnix).toLocaleString("en-US", { timeZone: 'America/New_York' })

    let info = await transporter.sendMail({
        from: '"CSABay Team" <csa.bay00@gmail.com>', 
        to: email, 
        subject: "[CSABay] Post updated", 
        text:   "You updated your post on CSABay." + "\n"
                + "Your post will expire on " + endTimeStr + " EST" + "\n"
                + "You can extend the expiration date by updating your post later." + "\n"
                + "\n"
                + "\n"
                + "Below is the summary of your post: " + "\n"
                + "Title: " + newPost.title + "\n"
                + "Description: " + newPost.description + "\n"
                + "Post Duration (Days): " + newPost.durationDays + "\n"
                + "Type of Your Post: " + newPost.typeOfPost + "\n"
                + "Created Time: " + new Date(Date.parse(newPost.createdTimestamp)).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST" + "\n"
                + "Modified Time: " + new Date(Date.parse(newPost.modifiedTimestamp)).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST"
    });
}

exports.sendUpdatePostEmail = sendUpdatePostEmail;