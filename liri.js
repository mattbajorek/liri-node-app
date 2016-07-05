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

// Log command
logData('', true);
logData('Command: node liri.js ' + selection + type, true);

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
			logData('');
			logData('--------------------------------------------------------------------------------');
			logData('Liri: I did not understand your input. Please try again.');
			logData('--------------------------------------------------------------------------------');
	}
}

// Gets 20 most recent tweets
function getTweets() {
	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	  	logData('');
	  	logData('--------------------------------------------------------------------------------');
	  	logData('Liri: Here are your most recent tweets:')
	  	logData('--------------------------------------------------------------------------------');
	  	for (var i=0; i<tweets.length; i++) {
	  		logData('');
	  		logData('Tweet ' + (i+1) + ':');
	  		logData(tweets[i].created_at);
	    	logData(tweets[i].text);
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
        logData('Error occurred: ' + err);
        return;
    }
    logData('');
  	logData('--------------------------------------------------------------------------------');
  	if (type === '') {
  		logData('Liri: Here is the spotify search results:');
  	} else {
  		logData('Liri: Here is the spotify search results for ' + type + ':');
  	}
  	logData('--------------------------------------------------------------------------------');
    var search = data.tracks.items;
    for (var i=0; i<search.length; i++) {
	  	logData('');
	  	logData('Result ' + (i+1) + ':');
	 		logData('Song title: ' + search[i].name);
	 		for (var j=0; j<search[i].artists.length; j++) {
	 			if (search[i].artists.length === 1) {
	 				logData('Artist: ' + search[i].artists[j].name);
	 			} else {
	 				logData('Artist ' + (j+1) + ': ' + search[i].artists[j].name);
	 			}
	 		}
	 		logData('Album title: ' + search[i].album.name);
	 		logData('Preview URL: ' + search[i].preview_url);
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
	  	logData('');
	  	logData('--------------------------------------------------------------------------------');
	  	if (type === '') {
	  		logData('Liri: Here is the OMDB search result:');
	  	} else {
	  		logData('Liri: Here is the OMDB search result for ' + type + ':');
	  	}
	  	logData('--------------------------------------------------------------------------------');
	  	var data = JSON.parse(body);
	  	logData('');
	    logData('Title: ' + data.Title);
	    logData('Year: ' + data.Year);
	    logData('IMDB Rating: ' + data.Rated);
	    logData('Country: ' + data.Country);
	    logData('Language: ' + data.Language);
	    logData('Plot: ' + data.Plot);
	    logData('Actors: ' + data.Actors);
	  }
	});
}

// Do what it says
function followFile() {
	fs.readFile('random.txt', 'utf8', function(error, data) {
		if (error) {
			logData('Error occurred: ' + error);
			return;
		}
		// Split the text file arguments by ,
		var output = data.split(',');
		// Send inputs into cases
		switchCases(output[0], output[1]);
	});
}

// Log data
function logData(log, printer) {
	fs.appendFileSync('log.txt', log + '\r\n');
	if (!printer) {
		console.log(log);
	}
}