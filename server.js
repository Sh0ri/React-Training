const express = require('express');
const pSettle = require('p-settle');
var elasticsearch = require('elasticsearch');
var nodemailer = require("nodemailer");


//ELASTICSEARCH CLIENT
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});
//END

//SMTP FOR EMAIL
var smtpTransport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "quent.dasilva@gmail.com",
		pass: "Candice78780"
	}
});
var rand,mailOptions,host,link;

const connection_adress = "http://localhost:3000/#Form";
const app = express();
const port = 9292;
var clickHere = "Click here to verify";

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/api/send',function(req,res){
	rand=Math.floor((Math.random() * 100) + 54);
	host="localhost:9292";
	link=req.get('host')+"/api/verify?id="+rand;
	mailOptions={
		to : req.query.to,
		subject : "Please confirm your Email account",
		html : "<h3>Verify your email</h3><br> Please Click on the link to verify your email. <br> "+link+" <br> <label>If the link doesn't work, copy it into your navigator</label>" 
	}
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
			res.end("error");
		}else{
			console.log("Message sent: " + response.message);
			create_email_to_verify(mailOptions,rand);
			res.end("sent");
		}
	});
});

app.get('/api/verify',function(req,res){
	verify(req,res);
});

async function validate_account(email) {
	
	const result = await get_account_by_email(email);
	pSettle(result).then(result => {
		let temp_value = result[0].value._id;
		console.log("id : " + temp_value);

		client.update({
			index: 'account_test',
			type: 'account',
			id: temp_value,
			body: {
				script: 'ctx._source.verified = \"true\"'
			}
		})
	});
	//console.log("MAMA : " + result["_id"]);	
	/*
	var script = "ctx._source.verified = \"true\";";

	client.updateByQuery({
		index: 'account_test',
		type: 'account_test',
		body: {
			query: query,
			script: script
		}
	})
	*/
}

async function verify(req,res) {
	console.log(req.protocol+":/"+req.get('host'));
	if((req.protocol+"://"+req.get('host'))==("http://"+host))
	{
		console.log("Domain is matched. Information is from Authentic email");
		const result = await check_if_email_to_verify_exists(req.query.id);
		pSettle(result).then(result => {
			console.log('ok result');
		});
		console.log("RESULT");
		console.log(result);
		if(result.length > 0)
		{
			console.log("email is verified");
			validate_account(result[0]._source.email);
			res.end("<h3>Email has been Successfully verified</h3><br><a href="+connection_adress+">Click here to connect</a>");
		}
		else
		{
			console.log("email is not verified");
			res.end("<h1>Bad Request</h1>");
		}
	}
	else
	{
		res.end("<h1>Request is from unknown source</h1>");
	}
}

//API POPULATE
app.get('/api/create-account', (req, res) => {
	console.log("create account");
	var req_query = req.query;
	console.log(req_query);
	create_account(res,req_query);
});

//API CHECK IF ACCOUNT EXISTS
app.get('/api/checkIfAccountExist', (req, res) => {
	console.log("checkIfAccountExist");
	var req_query = req.query;
	console.log(req_query);
	connect(res,req_query);
});

//API GET ALL ACCOUNTS
app.get('/api/get/all', (req, res) => {
	get_all_accounts(res);
});

//API CREATE INDEX
app.get('/api/create/index', (req, res) => {

	console.log("CREATE INDEX");

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

//API CREATE INDEX EMAIL TO VERIFY
app.get('/api/create/index/email', (req, res) => {

	console.log("CREATE INDEX");

	client.indices.create({
		index: 'email_to_verity'
	}, function(err, resp, status) {
		if (err) {
			console.log(err);
		} else {
			console.log("create", resp);
		}
	});

	res.send("DONE");

});

//API DELETE INDEX
app.get('/api/delete/index', (req, res) => {
	console.log("DELETE INDEX");

	client.indices.delete({index: 'account_test'},function(err,resp,status) {  
		console.log("delete",resp);
	});

	res.send("DONE");
});

//API DELETE INDEX EMAIL TO VERIFY
app.get('/api/delete/index/email', (req, res) => {
	console.log("DELETE INDEX");

	client.indices.delete({index: 'email_to_verity'},function(err,resp,status) {  
		console.log("delete",resp);
	});

	res.send("DONE");
});


async function create_account(res,req_query){


	console.log("CREATE ACCOUNT");
	var number_of_existing_account = await check_if_account_exists(req_query);
	console.log("APRES LE GET ACCOUNT");

	console.log('existing : ' + number_of_existing_account);

	if(number_of_existing_account === 0){
		client.index({
			index: 'account_test',
			type: 'account',
			body: req_query
		},function(err,resp,status) {
			console.log(resp);
		});
		res.send({result:'done'});
	}
	else {
		console.log("ALREADY EXISTING ACCOUNT");
		res.send({result:'already existing account'});
	}
}

async function create_email_to_verify(emailAccount, random){

	console.log("CREATE EMAIL TO VERIFY");
	return new Promise((resolve, reject) => {
		client.index({
			index: 'email_to_verity',
			type: 'email_to_verify',
			body: {
				email:emailAccount.to,
				random:random
			}
		},function(err,resp,status) {
			console.log(resp);
		});
		resolve({result:'done'});
	});

	
}

async function delete_all_accounts(res) {
	client.delete({
		index: 'account_test',
		type: 'account'
	});
	res.send("DONE");
}

async function check_if_account_exists(obj) {
	console.log("GET ACCOUNT");
	return new Promise((resolve, reject) => {

		/*
		var query = {
			"bool": {
				"must": [{"match":{ "email":  obj.email }},{"match":{ "firstname":  obj.firstname }},{"match":{ "lastname":  obj.lastname }}]
			}
		}
		*/
		var query = {
			"bool": {
				"must": {"match":{ "email":  obj.email }}
			}
		}

		client.search({
			index: 'account_test',
			type: 'account',
			size: 200,
			body: {
				query: query
			}
		}).then(function (body) {
			resolve(body.hits.total);
		});

		//resolve(acc);
	});
}

async function connect(res,obj) {
	console.log("GET ACCOUNT");

		var query = {
			"bool": {
				"must": [{"match":{ "email":  obj.email }},{"match":{ "password":  obj.password }}]
			}
		}

		client.search({
			index: 'account_test',
			type: 'account',
			size: 200,
			body: {
				query: query
			}
		}).then(function (body) {
			if(body.hits.total > 0)
				res.send({result:body.hits.hits[0]._source});
			else
				res.send({result:false});
		});

}

async function get_account_by_email(email) {
	console.log("GET ACCOUNT");
	return new Promise((resolve, reject) => {

		var query = {
			"bool": {
				"must": {"match":{ "email":  email }}
			}
		}

		client.search({
			index: 'account_test',
			type: 'account',
			size: 200,
			body: {
				query: query
			}
		}).then(function (body) {
			resolve(body.hits.hits);
		});

		//resolve(acc);
	});
}

async function check_if_email_to_verify_exists(random) {
	console.log("GET EMAIL TO VERIFY");
	return new Promise((resolve, reject) => {

		var query = {
			"bool": {
				"must": {"match":{ "random":  random }}
			}
		};

		console.log(query);

		client.search({
			index: 'email_to_verity',
			type: 'email_to_verify',
			size: 200,
			body: {
				query: query
			}
		}).then(function (body) {
			resolve(body.hits.hits);
		});

		//resolve(acc);
	});
}

async function get_all_accounts(res){

	console.log("GET ALL ACCOUNTS");

	var query = {match_all:{}};

	client.search({
		index: 'account_test',
		type: 'account',
		size: 200,
		body: {
			query: query
		}
	}).then(function (body) {
		if(body.hits.total>0){
			var source_array = [];
			body.hits.hits.forEach(function(object){
				source_array.push(object._source);
			})
			res.send(source_array);
		}
		else{
			res.send(body.hits.hits);
		}
		
	}, function (err) {
		res.send(err.message);
	});
}