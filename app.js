require("dotenv").config();
const PORT = process.env.PORT || 3000;

const express = require('express');
var cors = require('cors')

const app = express()
app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const session = require('express-session');
app.use(session({
	secret: 'your_secret_key',
	resave: false,
	saveUninitialized: true
}));

const authRoute = require("./routes/auth");
const redirectRoute = require("./routes/calendarRedirect");

app.use("/rest/v1/calendar/init", authRoute);
app.use("/rest/v1/calendar/redirect", redirectRoute);

app.set("view-engine", "ejs");

const path = require('path');
__dirname = path.resolve();
app.use(express.static((path.join(__dirname, 'views'))));

app.get('/', (req, res) => {
	res.render('signup');
});

app.listen(PORT, () => {
	console.log(`Calendar app listening at http://localhost:${PORT}`);
});

