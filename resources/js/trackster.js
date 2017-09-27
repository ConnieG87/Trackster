var Trackster = {};
var tracklist = $('#track-list');
//var artist = [];
var curTrackList = [];
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

	$('#artist-header').click(function () {
		Trackster.sortColumn('artist');
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
	console.log(tracks);
	tracklist.empty();
	if (tracks.length > 0) {
		for (var i = 0; i < tracks.length; i++) {
			var track = $('<div class="row track">\n' +
				'\t\t\t\t\t\t<div class="col-xs-1 col-xs-offset-1 play-button">\n' +
				'\t\t\t\t\t\t\t<a href="' + tracks[i].url + '" target="_blank"><i class="fa fa-play-circle-o fa-2x"></i></a>\n' +
				'\t\t\t\t\t\t</div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-4">' + tracks[i].name + '</div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-2">' + tracks[i].artist + '</div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-2">\n' +
				'\t\t\t\t\t\t\t<img src="' + tracks[i].image[1]["#text"] + '"/></div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-1 listeners">' + numeral(tracks[i].listeners).format('0,0') + '</div>\n' +
				'\t\t\t\t\t</div>');
			track.data( { tdata: [tracks[i].url, tracks[i].name, tracks[i].artist, tracks[i].image, tracks[i].listeners] } );
			//artist[i] = track.data('tdata')[1];

			curTrackList.push(track);
			//console.log("Trackdata: "+ curTrackList[i].data('tdata'));
			tracklist.append(track);
		}
		//console.log(curTrackList);
	}
	else {
		var nosongs = '<div class="row">\n' +
			'<div class="col-xs-12 startmessage">No songs found with that keyword. Try a different one, check your spelling or\n' +
			'<button id="random-button">try a random keyword</button>\n' +
			'</div>\n' +
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

Trackster.sortColumn = function (column) {
	//console.log(curTrackList);
	var colIndex;
	var newTrackList = [];

	if (column === 'name') {
		colIndex = 1;
	}
	else if (column === 'artist') {
		colIndex = 2;
	}
	else if (column === 'listeners') {
		colIndex = 3;
	}
	else {
		console.log("colum not found");
	}

	var colData = [];
	for (var i=0; i<curTrackList.length; i++) {
		colData.push(curTrackList[i].data('tdata')[colIndex]);
	}

	console.log("sort");
	colData.sort();

	for (var i=0; i<colData.length; i++ ) {
		for (var j=0; j<curTrackList.length; j++) {
			if (colData[i] === curTrackList[j].data('tdata')[colIndex]) {
				var url = curTrackList[j].data('tdata')[0];
				var name = curTrackList[j].data('tdata')[1];
				var artist = curTrackList[j].data('tdata')[2];
				var image = curTrackList[j].data('tdata')[3];
				var listeners = curTrackList[j].data('tdata')[4];
				newTrackList.push({name, image, artist, url, listeners});
				//newTrackList.push({ curTrackList[j].data('tdata')[0], curTrackList[j].data('tdata')[1], curTrackList[j].data('tdata')[2], curTrackList[j].data('tdata')[3], curTrackList[j].data('tdata')[4], curTrackList[j].data('tdata')[5] });
				curTrackList.splice(j, 1);
			}
		}
	}

	console.log(newTrackList);



	Trackster.renderTracks(newTrackList);
};