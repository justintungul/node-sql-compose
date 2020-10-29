const app = require('express')();

const bodyParser = require('body-parser');

// Accept JSON encoded bodies.
app.use(bodyParser.json({
    limit: '8mb'
}));

const HTTP_PORT = process.env.HTTP_PORT || 8080;

app.listen(HTTP_PORT, (err) => {
  if (err) {
    console.error('Error starting  server', err);
  } else {
    console.log('Server listening at port ' + HTTP_PORT);
  }
});

const net = require('net');

const TCP_PORT = process.env.TCP_PORT;
const TCP_HOST = process.env.TCP_HOST;
const PING_SERVER = 'pingServer';
const GET_USERS = 'getUsers';
const ADD_USER = 'addUser';

const createTcpConnection = (callback, handleResponse) => {
  const client = net.createConnection({ port: TCP_PORT, host: TCP_HOST });

  client.on('connect', () => {
    console.log('Connected to tcp server!');
    callback(client)
  })

  client.on('data', (data) => {
    client.end();
    handleResponse(JSON.parse(data));
  });

  client.on('end', () => {
    console.log('Disconnected from tco server.');
  });
}

// Home page.
app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'This message is from the HTTP Server.'
	});
});

app.get('/pingtcpserver', (req, res) => {
  createTcpConnection((client) => {
    client.write(JSON.stringify({type: PING_SERVER}));
  }, 
  (tcpRes) => res.json(tcpRes));
});

// Create a user.
app.post('/add-user', (req, res) => {
  createTcpConnection((client) => {
    let tcpReq = { type: ADD_USER, data: req.body };
    client.write(JSON.stringify(tcpReq));
  }, 
  (tcpRes) => res.json(tcpRes));
});

// Fetch all users.
app.post('/get-users', (req, res) => {
  createTcpConnection((client) => {
    client.write(JSON.stringify({type: GET_USERS}));
  }, 
  (tcpRes) => res.json(tcpRes));
});
