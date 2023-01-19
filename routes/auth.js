const { OAuth2Client } = require('google-auth-library');
const router = require("express").Router();
const querystring = require('querystring');

const client = new OAuth2Client(process.env.CLIENT_ID);
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/rest/v1/calendar/redirect/";

router.get('/', (req, res) => {
	const authUrl = 'https://accounts.google.com/o/oauth2/auth?' +
		querystring.stringify({
			client_id: client_id,
			redirect_uri: redirect_uri,
			scope: 'https://www.googleapis.com/auth/calendar',
			response_type: 'code'
		});
	res.redirect(authUrl);
});

module.exports = router;