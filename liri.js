// Require libraries
var keys = require('./keys');
var Twitter = require('twitter');
var spotify = require('spotify');
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
var type = process.argv[3];
//var selection = process.argv.splice(2, process.argv.length-1).join(' ');

// Switch case to handle input
switch (selection) {
	case 'my-tweets': getTweets(); break;
	case 'spotify-this-song': searchSpotify(); break;
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
	  		console.log('');
	  		console.log('Tweet ' + (i+1) + ':');
	  		console.log(tweets[i].created_at);
	    	console.log(tweets[i].text);
	  	}
	  }
	});
}

// Search spotify
function searchSpotify() {
	var params = {type:'track', query:"what's my age again"};
	spotify.search(params, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }
    console.log('');
	  	console.log('--------------------------------------------------------------------------------');
	  	console.log('Liri: Here the spotify search results:')
	  	console.log('--------------------------------------------------------------------------------');
    var search = data.tracks.items;
    for (var i=0; i<search.length; i++) {
	  	console.log('');
	  	console.log('Result ' + (i+1) + ':');
	 		console.log('Song title: ' + search[i].name);
	 		for (var j=0; j<search[i].artists.length; j++) {
	 			if (search[i].artists.length === 1) {
	 				console.log('Artist: ' + search[i].artists[j].name);
	 			} else {
	 				console.log('Artist ' + (j+1) + ': ' + search[i].artists[j].name);
	 			}
	 		}
	 		console.log('Album title: ' + search[i].album.name);
	 		console.log('Preview URL: ' + search[i].preview_url);
	  	}
	});
}
