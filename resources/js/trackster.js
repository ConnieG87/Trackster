var Trackster = {};
var tracklist = $('#track-list');
var curTrackList = [];
//column name and direction
var sortedBy = ['', 'up'];
var sortableColumns = ['name', 'artist', 'listeners'];

const API_KEY = '6a1715aeff4d212449508fa7dbaf63bc';

$(document).ready(function () {
	var searchinput = $('#search-input');
	var searchbutton = $('#search-button');

	//set event listeners

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

	Trackster.initSortableColumns();

});

Trackster.initSortableColumns = function () {

	//add event-listeners to each sortable column
	for (var i=0; i<sortableColumns.length; i++) {
		$('#' + sortableColumns[i] + '-sort').click({ column: sortableColumns[i] }, Trackster.sortColumn);
	}

	//add a sort-arrow to each sortable column
	var sortArrow = '<i class="fa fa-arrow-down sort-arrow arrow-disabled"></i>';
	$('.sortable').append(sortArrow);
};

Trackster.setSortArrow = function (column, dir) {

	for (var i=0; i<sortableColumns.length; i++) {

		var columnheader = $('#' + sortableColumns[i] + '-sort');

		columnheader.children('i').removeClass('arrow-disabled');
		columnheader.children('i').removeClass('fa-arrow-down');
		columnheader.children('i').removeClass('fa-arrow-up');

		if (column === sortableColumns[i]) {

			//add the right class for sort direction
			columnheader.children('i').addClass('fa-arrow-' + dir);
		}
		else {
			columnheader.children('i').addClass('fa-arrow-down');
			columnheader.children('i').addClass('arrow-disabled');
		}
	}
};

Trackster.getSortDirection = function (curDir) {
	if (curDir === 'down') {
		return 'up';
	}
	else {
		return 'down';
	}
};

Trackster.searchbyRandomKeyword = function (keyword) {
	$('#search-input').val(keyword);
	Trackster.searchTracksByTitle(keyword);
};


/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks. 
*/
Trackster.renderTracks = function (tracks) {
	curTrackList = [];
	tracklist.empty();
	if (tracks.length > 0) {
		for (var i = 0; i < tracks.length; i++) {
			curTrackList.push({
				url: tracks[i].url,
				name: tracks[i].name,
				artist: tracks[i].artist,
				image: tracks[i].image,
				listeners: parseInt(tracks[i].listeners)
			});
			var track = $('<div class="row track">\n' +
				'\t\t\t\t\t\t<div class="col-xs-1 col-xs-offset-1 play-button">\n' +
				'\t\t\t\t\t\t\t<a href="' + curTrackList[i].url + '" target="_blank"><i class="fa fa-play-circle-o fa-2x"></i></a>\n' +
				'\t\t\t\t\t\t</div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-4">' + curTrackList[i].name + '</div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-2">' + curTrackList[i].artist + '</div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-1">\n' +
				'\t\t\t\t\t\t\t<img src="' + curTrackList[i].image[1]["#text"] + '"/></div>\n' +
				'\t\t\t\t\t\t<div class="col-xs-2 listeners">' + numeral(curTrackList[i].listeners).format('0,0') + '</div>\n' +
				'\t\t\t\t\t</div>');
			tracklist.append(track);
		}

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
		Trackster.setSortArrow('none','none');
	});
};


Trackster.generateRandomWord = function () {
	var words = ['connect', 'discover', 'dream', 'stretch', 'stop', 'risk', 'explore', 'death', 'dive', 'dance', 'climb'];
	return words[Math.ceil(Math.random() * words.length)];
};


Trackster.sortColumn = function (event) {
	var newTrackList = [];
	var colData = [];
	var column=event.data.column;

	//store the data from the column to be sorted on in a new array for sorting
	for (var i = 0; i < curTrackList.length; i++) {
		colData.push(curTrackList[i][column]);
	}

	//if the list is not already sorted by this column, sort the array with column data
	if (sortedBy[0] !== column) {
		if (column === 'listeners') {
			//add compare function for accurate numeric comparison
			colData.sort(function (a, b) {
				return a - b
			});
		}
		else {
			colData.sort();
		}
		sortedBy[0] = column;
		sortedBy[1] = 'down';
	}
	//if the list was already sorted by this column, reverse the array with column data
	else {
		colData.reverse();
		sortedBy[1] = Trackster.getSortDirection(sortedBy[1]);
	}

	Trackster.setSortArrow(column, sortedBy[1]);

	//find the corresponding data for each subseqent item in the column data array in the current track list
	// and store the complete sorted list in the new track list
	for (var i = 0; i < colData.length; i++) {
		for (var j = 0; j < curTrackList.length; j++) {

			if (colData[i] === curTrackList[j][column]) {
				newTrackList.push(curTrackList[j]);
				//remove the item from the current track list to make the operation quicker at each run
				curTrackList.splice(j, 1);
			}
		}
	}
	Trackster.renderTracks(newTrackList);
};