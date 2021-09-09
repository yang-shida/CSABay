# CSABay
A Craigslist/eBay type website where people can publicize selling information and contact information

# Our final demo video
https://drive.google.com/file/d/1rnEDUAPQ4CdswTtRtXc8a097vfgWMUWd/view?usp=sharing

## Installing Dependencies:
```npm install```

## To run locally:
Create (or get) a .env file and put it in the project root directory, then
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
