import express from 'express';
import bodyParser from 'body-parser';
import { Script } from "vm"


process.on('message', (message: string) => {
    for (let i = 0; i < 1000; i++) {
        const script = new Script(message);
        script.runInThisContext();
    }

	// console.log(message);
});

const app = express();
const server = require('http').Server(app);
const port = 3001;

// app.use(helmet());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});
app.use(bodyParser.urlencoded({ extended: true }));

//pre-flight requests
app.options('*', function(req, res) {
	res.send(200);
});

server.listen(port, (err: any) => {
	if (err) {
		throw err;
	}
	/* eslint-disable no-console */
	console.log('Node Endpoints working :)');
});

module.exports = server;


