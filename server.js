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
        html : "<h3>Verify your email</h3><br> Please Click on the link to verify your email. <a href="+link+">https://www.google.com/</a>" 
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
});
});

app.get('/api/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
        console.log("email is verified");
        res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
}
else
{
    res.end("<h1>Request is from unknown source");
}
});

//API POPULATE
app.get('/api/create-account', (req, res) => {
	console.log("create account");
	var req_query = req.query;
	console.log(req_query);
	create_account(res,req_query);
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

//API DELETE INDEX
app.get('/api/delete/index', (req, res) => {
	console.log("DELETE INDEX");

	client.indices.delete({index: 'account_test'},function(err,resp,status) {  
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

		var query = {
			"bool": {
				"must": [{"match":{ "email":  obj.email }},{"match":{ "firstname":  obj.firstname }},{"match":{ "lastname":  obj.lastname }}]
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