"use strict";
const nodemailer = require("nodemailer");

// use username/password
// const transporter = nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE,
//     auth: {
//       user: process.env.EMAIL_USERNAME, 
//       pass: process.env.EMAIL_PWD, 
//     },
// });

// use OAUTH2
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        type: process.env.EMAIL_AUTH_TYPE,
        user: process.env.EMAIL_USERNAME, 
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN
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
    text:   "Verification Code: " + _code + "\n"
            + "The code will expire in 10 minutes."
  });
}

const sendCreatePostEmail = async (newPost, email) => {
    var endTimeUnix = newPost.durationDays * 24 * 3600 * 1000 + Date.parse(newPost.modifiedTimestamp)
    var endTimeStr = new Date(endTimeUnix+23*3600*1000+59*60*1000+59*1000+999).toLocaleString("en-US", { timeZone: 'America/New_York' })
    endTimeStr=endTimeStr.substring(0, endTimeStr.indexOf(',')).concat(", 12:00:00 AM EST")

    let info = await transporter.sendMail({
        from: '"CSABay Team" <csa.bay00@gmail.com>', 
        to: email, 
        subject: "[CSABay] New Post Created", 
        text:   "You created a new post on CSABay." + "\n"
                + "Your post will expire on " + endTimeStr + "\n"
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



const sendUpdatePostEmail = async (newPost, email) => {
    var endTimeUnix = newPost.durationDays * 24 * 3600 * 1000 + Date.parse(newPost.modifiedTimestamp)
    var endTimeStr = new Date(endTimeUnix+23*3600*1000+59*60*1000+59*1000+999).toLocaleString("en-US", { timeZone: 'America/New_York' })
    endTimeStr=endTimeStr.substring(0, endTimeStr.indexOf(',')).concat(", 12:00:00 AM EST")


    let info = await transporter.sendMail({
        from: '"CSABay Team" <csa.bay00@gmail.com>', 
        to: email, 
        subject: "[CSABay] Post updated", 
        text:   "You updated your post on CSABay." + "\n"
                + "Your post will expire on " + endTimeStr + "\n"
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

const sendExpireReminderEmail = async (newPost, email, isExpired) => {
    var endTimeUnix = newPost.durationDays * 24 * 3600 * 1000 + Date.parse(newPost.modifiedTimestamp)
    var endTimeStr = new Date(endTimeUnix+23*3600*1000+59*60*1000+59*1000+999).toLocaleString("en-US", { timeZone: 'America/New_York' })
    endTimeStr=endTimeStr.substring(0, endTimeStr.indexOf(',')).concat(", 12:00:00 AM EST")

    if(!isExpired){
        let info = await transporter.sendMail({
            from: '"CSABay Team" <csa.bay00@gmail.com>', 
            to: email, 
            subject: "[CSABay] Your post will expire SOON!", 
            text:   "Your post will expire on " + endTimeStr + "\n"
                    + "You can extend the expiration date by updating your post." + "\n"
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
    else{
        let info = await transporter.sendMail({
            from: '"CSABay Team" <csa.bay00@gmail.com>', 
            to: email, 
            subject: "[CSABay] Your post was expired", 
            text:   "Your post was deleted since it was expired on " + endTimeStr + "\n"
                    + "If you need to restore your post, contact a CSA IT department member ASAP." + "\n"
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
    
}

module.exports.sendCC = function(_code, _email) {
    sendConfirmationCode(_code, _email).catch(console.error);
}
exports.sendCreatePostEmail = sendCreatePostEmail;
exports.sendUpdatePostEmail = sendUpdatePostEmail;
exports.sendExpireReminderEmail = sendExpireReminderEmail;