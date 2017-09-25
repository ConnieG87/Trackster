var Trackster = {};
var tracklist = $('#track-list');
const API_KEY = '6a1715aeff4d212449508fa7dbaf63bc';

$(document).ready(function () {
	var searchinput = $('#search-input');
	var searchbutton = $('#search-button');

	searchbutton.click(function () {
		var keyword = searchinput.val();

		if (keyword !== '') {
			Trackster.searchTracksByTitle(keyword);
		}
		else {
			console.log("no keyword entered");
		}
	});

	searchinput.keyup(function () {
		if (event.keyCode === 13) {
			Trackster.searchTracksByTitle($('#search-input').val());
		}
	});

	searchinput.click(function () {
		searchinput.attr('placeholder', '');
		$('#search-input').val('');
	});

	searchinput.focusout(function () {
		searchinput.attr('placeholder', 'Search');
	});

	$('#random-button').click(function () {
		Trackster.searchbyRandomKeyword(Trackster.generateRandomWord());
	});
});

Trackster.searchbyRandomKeyword = function (keyword) {
	$('#search-input').val(keyword);
	Trackster.searchTracksByTitle(keyword);
};


/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks. 
*/
Trackster.renderTracks = function (tracks) {
	tracklist.empty();
	if (tracks.length > 0) {
		for (var i = 0; i < tracks.length; i++) {
			var track = '<div class="row track">\n' +
				'\t\t\t\t\t\t<div class="col-xs-1 col-xs-offset-1 play-button">\n' +
				'\t\t\t\t\t\t\t<a href="' + tracks[i].url + '" target="_blank"><i class="fa fa-play-circle-o fa-2x"></i></a>\n' +
				'\t\t\t\t\t\t</div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-4">' + tracks[i].name + '</div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-2">' + tracks[i].artist + '</div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-2">\n' +
				'\t\t\t\t\t\t\t<img src="' + tracks[i].image[1]["#text"] + '"/></div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-1 listeners">' + numeral(tracks[i].listeners).format('0,0') + '</div>\n' +
				'\t\t\t\t\t</div>';
			tracklist.append(track);
		}
	}
	else {
		var nosongs = '<div class="row">\n'+
			'<div class="col-xs-12 startmessage">No songs found with that keyword. Try a different one, check your spelling or\n'+
		'<button id="random-button">try a random keyword</button>\n'+
		'</div>\n'+
		'</div>';
		tracklist.append(nosongs);
		$('#random-button').click(function () {
			Trackster.searchbyRandomKeyword(Trackster.generateRandomWord());
		});
	}
};

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function (title) {
	$.ajax('http://ws.audioscrobbler.com/2.0/?method=track.search&track=' + title + '&api_key=' + API_KEY + '&format=json').done(function (data) {

		Trackster.renderTracks(data.results.trackmatches.track);
	});
};


Trackster.generateRandomWord = function () {
	var words = ['connect', 'discover', 'dream', 'stretch', 'stop', 'risk', 'explore', 'death', 'dive', 'dance', 'climb'];
	return words[Math.ceil(Math.random() * words.length)];
};