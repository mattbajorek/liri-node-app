// Require libraries
var keys = require('./keys');
var Twitter = require('twitter');
var fs = require('fs');

// Initialize twitter client with keys
var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
}); 

// Get input argument
var selection = process.argv[2];
//var selection = process.argv.splice(2, process.argv.length-1).join(' ');

// Switch case to handle input
switch (selection) {
	case 'my-tweets': getTweets(); break;
	default:
		console.log('');
		console.log('--------------------------------------------------------------------------------');
		console.log('Liri: I did not understand your input. Please try again.');
		console.log('--------------------------------------------------------------------------------');
}

// Gets 20 most recent tweets
function getTweets() {
	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	  	console.log('');
	  	console.log('--------------------------------------------------------------------------------');
	  	console.log('Liri: Here are your most recent tweets:')
	  	console.log('--------------------------------------------------------------------------------');
	  	for (var i=0; i<tweets.length; i++) {
	  		console.log('')
	  		console.log('Tweet ' + (i+1) + ':')
	  		console.log(tweets[i].created_at);
	    	console.log(tweets[i].text);
	  	}
	  }
	});
}