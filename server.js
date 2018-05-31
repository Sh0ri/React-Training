const express = require('express');
const pSettle = require('p-settle');
var elasticsearch = require('elasticsearch');


//ELASTICSEARCH CLIENT
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});
//END

const app = express();
const port = 9292;

app.listen(port, () => console.log(`Listening on port ${port}`));

//API POPULATE
app.get('/api/create-account', (req, res) => {
	console.log("create account");
	var req_query = req.query;
	console.log(req_query);
	create_account(res,req_query);
});

//API CREATE INDEX
app.get('/api/create/index', (req, res) => {
	console.log("API CALL CREATE INDEX");

	client.indices.create({
		index: 'account_test'
	}, function(err, resp, status) {
		if (err) {
			console.log(err);
		} else {
			console.log("create", resp);
		}
	});

	res.send("DONE");

});


async function create_account(res,req_query){
	client.index({
		type: 'account_test',
		body: req_query.value
	},function(err,resp,status) {
		console.log(resp);
	});
	res.send("DONE");
}