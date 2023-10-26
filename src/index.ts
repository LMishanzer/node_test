import express from 'express';
import bodyParser from 'body-parser';
import { fork } from "child_process";
// import helmet from 'helmet';

const child = fork('dist\\node_test_child\\child_index.js');

const app = express();
const server = require('http').Server(app);
const port = 3000;

// app.use(helmet());
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

    console.log(script);
    // console.time('my_time');

    child.send({
        message: script
    });

    // console.timeEnd('my_time');

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

