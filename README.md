# CSABay
A Craigslist/eBay type website where people can publicize selling information and contact information for sellers

## Installing Dependencies:
- antd
  - yarn add antd
  - yarn add @craco/craco
  - yarn add craco-less
- antd-password-input-strength
  - npm install --save antd-password-input-strength
- JSON Server (used as fake DB)
  - npm install -g json-server
- axion
- aws-sdk (will eventually be backend)
- antd-img-crop

## To run the front end for demo (need two terminals):
- npm start
- json-server --watch fake_db/db.json -p 8080
