# Confetti Cuisine

A cooking-class website built step by step while following the textbook **[Get Programming with Node.js](https://www.manning.com/books/get-programming-with-node-js)** by Jonathan Wexler (Manning). Visitors can browse courses and the menu and contact the school. Students read replies on a "My messages" page, and the admin answers from an inbox.

The project is the book's running example (Confetti Cuisine, from the Lesson 7, 12, 16, 21, 25, 29, 33 and 37 capstones), extended with a custom messaging system.

## Features

- Home, Courses, Menu and Contact pages rendered with EJS and a shared layout
- Contact form that saves messages and shows a thank-you page
- Student "My messages" page with admin replies (private link stored in a cookie)
- Password-protected admin inbox at `/admin/messages`
- Custom 404 and 500 error pages
- MongoDB connection (native driver, Lesson 13)

## Requirements

- [Node.js](https://nodejs.org) 18 or newer
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on the default port `27017`
- [mongosh](https://www.mongodb.com/try/download/shell) (MongoDB Shell) for inspecting data

## Run it locally

```
npm install
npm start
```

Then open http://localhost:3000

Make sure `mongod` is running first. On start, the app connects to `mongodb://localhost:27017`, uses the `confetti_cuisine` database, adds a sample contact if it is missing, and prints the contacts collection to the terminal.

To check the data in the shell:

```
mongosh
use confetti_cuisine
db.contacts.find()
```

## Admin inbox

Go to http://localhost:3000/admin/messages and sign in with any username and the admin password.

- If you set `ADMIN_PASSWORD` in your environment, that is the password.
- If not, a random password is printed in the terminal each time the server starts.

PowerShell example:

```
$env:ADMIN_PASSWORD="choose-a-password"
npm start
```


## Progress through the book

Checked items are done in this project.

- [x] **Unit 0** – Node.js setup (Lessons 0-2)
- [x] **Unit 1** – Web server basics, routes, serving files (Lessons 3-7)
- [x] **Unit 2** – Express.js, routing, EJS templates, error handling (Lessons 8-12)
- [ ] **Unit 3** – MongoDB and Mongoose
- [x] Lesson 13: Setting up a MongoDB database
- [ ] Lesson 14: Building models with Mongoose
- [ ] Lesson 15: Connecting controllers and models
- [ ] Lesson 16: Capstone: Saving user subscriptions
- [ ] **Unit 4** – Improving models and CRUD (Lessons 17-21)
- [ ] **Unit 5** – Sessions, flash messages, login and authentication (Lessons 22-25)
- [ ] **Unit 6** – API, AJAX and API security (Lessons 26-29)
- [ ] **Unit 7** – Socket.io chat (Lessons 30-33)
- [ ] **Unit 8** – Deployment, production and testing (Lessons 34-37)

## Notes

- The MongoDB block in `main.js` is a Lesson 13 exercise. Lesson 14 replaces it with Mongoose models.
- Messages from the contact form are still stored in `data/messages.json`. They may move to MongoDB in a later unit.

## Built with

Node.js, Express, EJS, express-ejs-layouts, http-status-codes, MongoDB

## Reference

Wexler, Jonathan. *Get Programming with Node.js*. Manning Publications.

## Author

FARID