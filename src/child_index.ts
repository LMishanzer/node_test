import express from 'express';
import bodyParser from 'body-parser';
import { Script, createContext } from "vm"
// import fs from 'fs';
import child_process from 'child_process';



process.on('message', (message: string) => {
	try {
		const context = {
			require: require,
			console: console
		};

		const script = new Script(message);
		const newContext = createContext(context);
		const start = new Date();
		script.runInContext(newContext);
		const end = new Date();
		console.log('T:', (end.valueOf() - start.valueOf()));
	} catch (error) {
		console.log(error);
	}
});


console.log(`Child: DB_HOST is set to: ${process.env.DB_HOST}`);
console.log(`Child: DB_USER is set to: ${process.env.DB_USER}`);


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
