# Medical Booking System

P's Get Degrees designed a Data Warehouse that allows patients to schedule medical bookings with doctors. \
The Project was initially a Restful API that is Open API 3.0 Compliant. \
But project requirements insisted on making a user friendly UI to interface with the API.\
The UI currently allows patients to make bookings and for doctors to make record the results of the meeting. \
Extra features that do not appear in the UI is usable through the Swagger UI [here](https://web-medical-booking.herokuapp.com/api)

## Group members

-   Mark Gutierrez (Project Manager)

-   Mark Gutierrez (Technical Lead)

-   Mark Gutierrez (Software Engineer)

-   Mark Gutierrez (Technical Writer)

-   Adam Kabbara (CSS Designer)

## Installation Instruction

### Run website locally

1. Download [Node.js](https://nodejs.org/en/download/current/)

2. Download [MongoDB](https://www.mongodb.com/try/download/community)

3. Clone this project using `git clone`

4. Download dependencies by running `npm install` in a console while in the root of the folder.

5. Create a `.env` file and place in the root of the folder with variables `JWT_SECRET (String), JWT_LIFETIME (String), PORT (int), MONGO_URI`

6. Run server by executing `npm run dev` or `npm start` in the console.

7. Navigate the browser to `localhost:3000` or the assigned PORT value in the .env file

### Deployment

The project is hosted on Heroku and database on MongoDB Atlas. \
A CD/CI pipeline is created directly from Github to Heroku so any changes to the code will automatically redeploy the server with the new implemeted features.

## Getting Started

Access Website at [Medical Booking Website](https://web-medical-booking.herokuapp.com/) \
Access API at [Medical Booking API](https://web-medical-booking.herokuapp.com/api)
