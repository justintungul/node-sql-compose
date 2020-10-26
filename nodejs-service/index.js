const app = require('express')();
const mysql = require('mysql');

const bodyParser = require('body-parser');

// Accept JSON encoded bodies.
app.use(bodyParser.json({
    limit: '8mb'
}));

const PORT = process.env.PORT || 666;
const HOST = process.env.HOST || '0.0.0.0';

const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE
});


connection.connect((err) => {
	if (err) {
		console.error('Error connecting mysql: ', err);
	} else {
		console.log('Mysql connection successful');
		app.listen(PORT, HOST, (err) => {
			if (err) {
				console.error('Error starting  server', err);
			} else {
				console.log('Server listening at port ' + PORT);
			}
		});
	}
});

// Home page.
app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'Hello there'
	});
});

// Insert a user into database.
app.post('/add-user', (req, res) => {
	const user = req.body;
	const query = 'INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)';

	connection.query(query, [user.first_name, user.last_name, user.email], (err, results, fields) => {
		if (err) {
			console.error(err);
			res.json({
				success: false,
				message: 'Error occured'
			});
		} else {
			res.json({
				success: true,
				message: 'Successfully added user'
			});
		}
	});
});

// Fetch all users.
app.post('/get-users', (req, res) => {
	const query = 'SELECT * FROM users';
    connection.query(query, (err, results, fields) => {
    	if (err) {
    		console.error(err);
    		res.json({
    			success: false,
    			message: 'Error occured'
    		});
    	} else {
    		res.json({
    			success: true,
    			result: results
    		});
    	}
    });
});

