const net = require('net');
const mysql = require('mysql');

const PING_SERVER = 'pingServer';
const GET_USERS = 'getUsers';
const ADD_USER = 'addUser';

const server = net.createServer();

server.on('connection', (socket) => {
    console.log('client connected');

    socket.on('end', () => {
      console.log('client disconnected');
    });

    socket.on('data', (data) => {
      const req = JSON.parse(data);
      if (!data) socket.end();

      handleRequest(req.type)(req.data)
        .then((res) => {
          socket.end(JSON.stringify({response: res}));
        })
        .catch(e => 
          socket.end(JSON.stringify({error: e})));
    });
})

server.on('error', (err) => {
  throw err;
});

const TCP_PORT = process.env.TCP_PORT || 6603;

server.listen(TCP_PORT, () => {
  console.log(`TCP Server listening at port: ${TCP_PORT}`);
});


const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST || 'localhost',
	user: process.env.MYSQL_USER || 'tcpclient',
  password: process.env.MYSQL_PASSWORD || 'passWORD!1',
	database: process.env.MYSQL_DATABASE || 'test'
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting mysql: ', err);
  } else {
    console.log('MySQL connection successful');
  }
});

const handleRequest = (type) => {
  switch(type) {
    case PING_SERVER:
      return defaultResponse;
    case GET_USERS:
      return getUsers;
    case ADD_USER:
      return addUser;
    default:
      return defaultResponse;
  }
}

const defaultResponse = () => {
  return new Promise((resolve, reject) => {
    resolve('This message is from the server.');
  })
}

const getUsers = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
      if (err) {
        return reject(err);
      } 
      resolve(results);
    });
  })
}

const addUser = (newUser) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)';
    connection.query(query, [newUser.firstName, newUser.lastName, newUser.email], 
      (err) => {
        if (err) {
          return reject(err);
        }
      resolve('Successfully added user');
    });
  })
}
