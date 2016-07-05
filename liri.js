// Require libraries
var keys = require('./keys');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var chalk = require('chalk');

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
		case '-h': helpDoc(); break;
		default:
			logData('');
			logData('--------------------------------------------------------------------------------', false, 'blue');
			logData('Liri: I did not understand your input. Type node liri.js -h for help.', false, 'blue');
			logData('--------------------------------------------------------------------------------', false, 'blue');
	}
}

// Gets 20 most recent tweets
function getTweets() {
	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	  	logData('');
	  	logData('--------------------------------------------------------------------------------', false, 'blue');
	  	logData('Liri: Here are your most recent tweets:', false, 'blue')
	  	logData('--------------------------------------------------------------------------------', false, 'blue');
	  	for (var i=0; i<tweets.length; i++) {
	  		logData('');
	  		logData('Tweet ' + (i+1) + ':', false, 'cyan');
	  		logData(tweets[i].created_at, false, 'yellow');
	    	logData(tweets[i].text);
	  	}
	  }
	});
}

// Search spotify
function searchSpotify(passQuery) {
	var params;
	if (passQuery !== undefined) {
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
  	logData('--------------------------------------------------------------------------------', false, 'blue');
  	if (type === '') {
  		logData('Liri: Here is the spotify search results:', false, 'blue');
  	} else {
  		logData('Liri: Here is the spotify search results for ' + type + ':', false, 'blue');
  	}
  	logData('--------------------------------------------------------------------------------', false, 'blue');
    var search = data.tracks.items;
    for (var i=0; i<search.length; i++) {
	  	logData('');
	  	logData('Result ' + (i+1) + ':', false, 'green');
	 		logData('Song title: ' + search[i].name, false, 'magenta');
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
	var queryURL = 'http://www.omdbapi.com/?t=' + title + '&y=&plot=short&tomatoes=true&r=json';
	request(queryURL, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	logData('');
	  	logData('--------------------------------------------------------------------------------', false, 'blue');
	  	if (type === '') {
	  		logData('Liri: Here is the OMDB search result:', false, 'blue');
	  	} else {
	  		logData('Liri: Here is the OMDB search result for ' + type + ':', false, 'blue');
	  	}
	  	logData('--------------------------------------------------------------------------------', false, 'blue');
	  	var data = JSON.parse(body,2,null);
	  	logData('');
	    logData('Title: ' + data.Title, false, 'yellow');
	    logData('Year: ' + data.Year);
	    logData('IMDB Rating: ' + data.Rated);
	    logData('Country: ' + data.Country);
	    logData('Language: ' + data.Language);
	    logData('Plot: ' + data.Plot);
	    logData('Actors: ' + data.Actors);
	    logData('Rotten Tomatoes Rating: ' + data.tomatoRating);
	    logData('Website: ' + data.Website);
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
function logData(log, printer, color) {
	fs.appendFileSync('log.txt', log + '\r\n');
	if (!printer) {
		if (color !== undefined) {
			console.log(chalk[color](log));
		} else {
			console.log(log);
		}
	}
}

// Help documentation
function helpDoc() {
	logData('Usage: node liri.js [arguments]');
	logData('');
	logData('Options:');
	logData('  my-tweets                             show last 20 tweets and when they were created');
	logData("  spotify-this-song '<song name here>'  show the song name, artist(s), album, and preview URL");
	logData("  movie-this '<movie name here>'        show the movie title, year, IMDB rating, country,");
	logData('                                        language, plot and actors');
	logData('  do-what-it-says                       reads random.txt with arguments separated by a comma');
}