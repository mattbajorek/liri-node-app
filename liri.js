// Require libraries
var keys = require('./keys');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
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
var type = process.argv.splice(3, process.argv.length-1).join(' ');

// First run switch cases
switchCases();

function switchCases(passSelection, passQuery) {
	if (passSelection !== undefined) {
		selection = passSelection;
	}
	// Switch case to handle input
	switch (selection) {
		case 'my-tweets': getTweets(passQuery); break;
		case 'spotify-this-song': searchSpotify(passQuery); break;
		case 'movie-this': omdbRequest(passQuery); break;
		case 'do-what-it-says': followFile(); break;
		default:
			console.log('');
			console.log('--------------------------------------------------------------------------------');
			console.log('Liri: I did not understand your input. Please try again.');
			console.log('--------------------------------------------------------------------------------');
	}
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
function searchSpotify(passQuery) {
	var params;
	if (passQuery !== null) {
		params = {type:'track', query:passQuery};
	} else if (type === '') {
		params = {type:'track', query:"what's my age again"};
	} else {
		params = {type:'track', query:type};
	}
	spotify.search(params, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }
    console.log('');
  	console.log('--------------------------------------------------------------------------------');
  	if (type === '') {
  		console.log('Liri: Here is the spotify search results:');
  	} else {
  		console.log('Liri: Here is the spotify search results for ' + type + ':');
  	}
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

// Search OMDB
function omdbRequest() {
	var title;
	if (type === '') {
		title = 'Mr. Nobody';
	} else {
		title = type;
	}
	var queryURL = 'http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json';
	request(queryURL, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	console.log('');
	  	console.log('--------------------------------------------------------------------------------');
	  	if (type === '') {
	  		console.log('Liri: Here is the OMDB search result:');
	  	} else {
	  		console.log('Liri: Here is the OMDB search result for ' + type + ':');
	  	}
	  	console.log('--------------------------------------------------------------------------------');
	  	var data = JSON.parse(body);
	  	console.log('');
	    console.log('Title: ' + data.Title);
	    console.log('Year: ' + data.Year);
	    console.log('IMDB Rating: ' + data.Rated);
	    console.log('Country: ' + data.Country);
	    console.log('Language: ' + data.Language);
	    console.log('Plot: ' + data.Plot);
	    console.log('Actors: ' + data.Actors);
	  }
	});
}

// Do what it says
function followFile() {
	fs.readFile('random.txt', 'utf8', function(error, data) {
		if (error) {
			console.log('Error occurred: ' + error);
			return;
		}
		// Split the text file arguments by ,
		var output = data.split(',');
		// Send inputs into cases
		switchCases(output[0], output[1]);
	});
}