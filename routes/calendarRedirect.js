const router = require("express").Router();
var https = require('https');
const querystring = require('querystring');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/rest/v1/calendar/redirect/";

router.get('/', (req, res) => {

	// Get the authorization code from the query string
	const authCode = req.query.code;

	// Prepare the data to be sent to the token endpoint
	const postData = querystring.stringify({
		code: authCode,
		client_id: client_id,
		client_secret: client_secret,
		redirect_uri: redirect_uri,
		grant_type: 'authorization_code'
	});

	// Prepare the options for the token request
	const options = {
		hostname: 'oauth2.googleapis.com',
		path: '/token',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		}
	};

	// Make the request to the token endpoint
	const req_token = https.request(options, (res_token) => {

		let data = '';
		res_token.on('data', (chunk) => {
			data += chunk;
		});
		res_token.on('end', () => {
			// Parse the response
			const jsonData = JSON.parse(data);
			// Get the access token
			const access_token = jsonData.access_token;
			// Store the access token in the session
			req.session.access_token = access_token;
			// Use the access token to make API calls
			const options = {
				hostname: 'www.googleapis.com',
				path: '/calendar/v3/calendars/primary/events',
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${access_token}`
				}
			};
			// Make the request to the events endpoint
			const req_events = https.request(options, (res_events) => {
				let data = '';
				res_events.on('data', (chunk) => {
					data += chunk;
				});
				res_events.on('end', () => {
					// Parse the response
					const jsonData = JSON.parse(data);
					// Get the user's name
					// const name = jsonData.items[0].summary;
					// Get the list of events
					const events = jsonData.items;

					// Render the events in the view
					res.render('calendarredirect', { events: events });
				});
			});
			req_events.end();
		});
	});
	req_token.write(postData);
	req_token.end();
});

module.exports = router;