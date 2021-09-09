# CSABay
A Craigslist/eBay type website where people can publicize selling information and contact information (React.js+Node.js)

## Our final demo video
https://drive.google.com/file/d/1rnEDUAPQ4CdswTtRtXc8a097vfgWMUWd/view?usp=sharing

## Installing Dependencies:
```npm install```

## To run locally:
Create (or get) a .env file and put it in the project root directory:
```
// database
MONGODB_KEY_DEV=[YOUR_MONGODB_DEV_URI]
MONGODB_KEY_PROD=[YOUR_MONGODB_PROD_URI]

// AWS to store pictures
AWS_S3_BUCKET_NAME=[YOUR_AWS_BUCKET]
AWS_S3_REGION=[YOUR_AWS_REGION]
AWS_S3_ACCESS_KEY_ID=[YOUR_AWS_ACCESS_KEY_ID]
AWS_S3_SECRET_ACCESS_KEY=[YOUR_AWS_SECRET_ACCESS_KEY]

// Email for verification and notification
EMAIL_SERVICE=[YOUR_EMAIL_SERVICE, like gmail, outlook, ...]
EMAIL_USERNAME=[YOUR_EMAIL_USERNAME]
EMAIL_PWD=[YOUR_EMAIL_PASSWORD]
```

then start your local server:
```npm run dev```

## Project Structure
The front end uses React.js, and the back end uses Node.js. The communication between the front end and the back end uses REST API.
### Important Folders and Files
- /client: stores all the files required for the front end
  - /src/App.js: the top-level front-end component
  - /src/auth: front-end authentication
  - /src/components: front-end components
  - /src/img: front-end local/default images
- /misc/mailer.js: functions related to sending emails (verification code and reminders)
- /models: the database schemas
- /routes: the back-end API routes
- /server.js: the back-end server code
