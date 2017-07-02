# Chat Express
Chat Express is full stack javascript chat app. It uses SocketIO to make chat realtime.

# DEMO
You can check out demo of app on [This link](https://chatexpress-io.herokuapp.com)
###### IMPORTANT: App server is sleeping when idle so first request to demo might take few seconds.

If you don't want to make new user account you can use these :
- Username: aleksandar, Password: 123
- Username: test, Password: 123

# Screenshot
![screenshot](https://github.com/aleksandar-babic/ChatExpress/raw/master/screenshot.png)
You can simulate 2 users if you login as one user in normal window and other user in incognito window.
- App is best working in Google Chrome.

### Installation
Chat Express requires [Node.js](https://nodejs.org/), [MongoDB](https://www.mongodb.com/) and [NPM](https://www.npmjs.com/) to run.

Install the dependencies and start the server.

```sh
$ git clone https://github.com/aleksandar-babic/ChatExpress.git
$ cd ChatExpress
$ npm install
$ npm start
```

For production environments...

```sh
$ git clone https://github.com/aleksandar-babic/ChatExpress.git
$ cd ChatExpress
$ npm install
$ npm start:prod
```

### Hints
Once started, app will be live on http://127.0.0.1:3000
In order to start app you must create chatexpress MongoDB database.


