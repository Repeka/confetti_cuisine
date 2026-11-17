# Confetti Cuisine

A cooking-class website built with Node.js, Express and EJS. Visitors can browse courses and the menu, and send a message through the contact form. Students read replies on a "My messages" page, and the admin answers from an inbox.

## Features

- Home, Courses, Menu and Contact pages using an EJS layout
- Contact form that saves messages
- Student "My messages" page with admin replies
- Password-protected admin inbox at `/admin/messages`
- Custom 404 and 500 error pages

## Requirements

- [Node.js](https://nodejs.org) 18 or newer

## Run it locally

```
npm install
npm start
```

Then open http://localhost:3000

## Admin inbox

Go to http://localhost:3000/admin/messages and sign in with any username and the admin password.

- If you set `ADMIN_PASSWORD` in your environment, that is the password.
- If not, a random password is printed in the terminal each time the server starts.

PowerShell example:

```
$env:ADMIN_PASSWORD="choose-a-password"
npm start
```


## Built with

Node.js, Express, EJS, express-ejs-layouts, http-status-codes