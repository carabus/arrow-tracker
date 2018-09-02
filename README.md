# Archery Tracker

Archery Tracker keeps track of your target archery training scores and organizes your data into charts that help you answer the following qustions:

- does my ability improve over time
- how external factors (e.g. slightly different equipment set) affect my training
- how do I rate against other app users

## Demo

- [Live Demo](https://arrow-track.herokuapp.com/)<br/>
  Click demo link on the intro page to login as demo user.

## Links

- [Archery Tracker client](https://github.com/carabus/archery-tracker-client)
- [Archery Tracker api](https://github.com/carabus/archery-tracker-api)

## Technologies used

### Front End:

- React
- Redux
- HTML
- CSS
- Enzyme
- Jest

### Back End:

- Node.js
- Express
- MongoDB
- Mongoose
- Mocha
- Chai, Chai-http

### Responsive

- The app is responsive and optimized for both desktop and mobile use

## API Documentation

### Training Records

- GET /trainingRecords - get latest training records
- POST /trainingRecords - create new training record
- PUT /trainingRecords/:id - update training record
- DELETE /trainingRecords/:id - delete training record

### Training Factors

- GET /trainingFactors - get training factors for a user

### Ranks

- POST /rank - calculate and persist user rank
- GET /rank - get users rank percentile

### Charts

- GET /progress - get overall progress chart
- POST /compare - get training factor specific progress chart (training factors are passed in request body)

## Screenshots

### Dashboard - Rating and Progress chart

![Rating and Progress chart](https://raw.githubusercontent.com/carabus/archery-tracker-client/master/screenshots/progress.png)

### Dashboard - Compare Chart

![Compare Chart](https://raw.githubusercontent.com/carabus/archery-tracker-client/master/screenshots/compare.png)

### Training Session Summary

![Training Session Summary](https://raw.githubusercontent.com/carabus/archery-tracker-client/master/screenshots/session-top.png)

### Training Session Ends

![Training Session Ends](https://raw.githubusercontent.com/carabus/archery-tracker-client/master/screenshots/session-ends.png)

### Entering Scores

![Entering Scores](https://raw.githubusercontent.com/carabus/archery-tracker-client/master/screenshots/enter-scores.png)

## Nice to have features

- Support for different sizes and types of targets
- Ability to take and save photo of your target as proof of entered scores or to be able to enter scores later
- Ability to create user profile with user details such as their equipment set
- A system of achievements that adds badges to user profile, e.g. "x number of bullseyes", "training frequency"
- Predict optimal training length (from previous data)

## Attribution

- Front page photo by Andreas Overland
- Beautiful responsive charts - [Recharts](http://recharts.org/)
- Awesome training factors autocomplete - [React Select](https://github.com/JedWatson/react-select)
- Helpful tooltips - [React Tooltip](https://github.com/wwayne/react-tooltip)
- Design was very heavily inspired by Bootstrap
