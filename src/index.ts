import express from 'express';
import bodyParser from 'body-parser';
import { fork } from "child_process";
// import { join } from "path"
import dotenv from 'dotenv';


const childLocation = './child_index.js';

dotenv.config();

console.log(`DB_HOST is set to: ${process.env.DB_HOST}`);

let child = fork(childLocation, {
	uid: 1500,
	gid: 1500,
	env: {
		DB_HOST: 'not_localhost'
	}
});

// let child = spawn('sudo', ['chroot', '--userspec=john:john', './chroot_jail', 'node', childLocation], {
// 	env: {
// 			DB_HOST: 'not_localhost'
// 	},
// 	stdio: 'inherit'
// });

child.on('exit', () => {
    child = fork(childLocation, {
		uid: 1500,
		gid: 1500,
		env: {
			DB_HOST: 'not_localhost'
		}
	});
});

const app = express();
const server = require('http').Server(app);
const port = 3000;

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

//pre-flight requests
app.options('*', function(req, res) {
	res.send(200);
});

app.get('/test', (req, res) => {
    console.log(new Date().toISOString());

    res.end();
});

app.post('/script', (req, res) => {
    const script = req.body.toString();

	child.send(script);

    console.log(script);

    res.end();
});

server.listen(port, (err: any) => {
	if (err) {
		throw err;
	}
	/* eslint-disable no-console */
	console.log('Node Endpoints working :)');
});

module.exports = server;
