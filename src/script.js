(function(){
aC = {
query: {},
playerHeight: 506,
newPlayerHeight: 0,
playerWidth: 900,
newPlayerWidth: 0,
dimension: 0,
index: -1,
history: [],
historyPos: -1,
playlist: [],
playlistLength: 0,
search: "",
searchResults: [],
searchLength: -1,
searchFocus: false,
starttimeFocus: false,
playtimeFocus: false,
resizeTO: null,
expressTO: null,
scrobbleTO: null,
scrobblePlayingTO: null,
seekerInterval: null,
durationInterval: null,
qualityChanged: false,
lastfm: {
	api: null,
	apiToken: '',
	sessionKey: '',
	sessionName: '',
	scrobbled: false,
	scrobbleAuthenticated: false,
	apiKey: 'a4a30dff7a34add7275a73deeb00364a',
	apiSecret: 'c1b632f0169f95381c9002d7a0d6575c',
	scrobblePlayingDelay: 5,
	scrobbleDelay: 45
},
settings: {
	random: true,
	express: true,
	autostart: true,
	quality: "small",
	starttime: 30,
	playtime: 90,
	sort: "artist",
	repeat: false,
	scrobble: false
},
getVideoImage: function(id){
	return 'http://i.ytimg.com/vi/' + id + '/default.jpg';
},
searchPlaylist: function(a,b){
	var retArr = [], search = a.split(' ');
	$.each(b, function(i,v){
		if (typeof v['id'] !== "string" || typeof v['artist'] !== "string" || typeof v['track'] !== "string") return;
		var artist = v['artist'].replace(/[^a-zA-Z 0-9]+/g,'').replace('   ',' ').replace('  ',' ');
		var track = v['track'].replace(/[^a-zA-Z 0-9]+/g,'').replace('   ',' ').replace('  ',' ');
		var song = artist + " " + track;
		var rg = new RegExp('^(?=.*?'+search.join(")(?=.*?")+')',"i");
		if (song.match(rg)) retArr.push(i);
	});
	aC.searchLength = retArr.length;
	return retArr;
},
loadPlaylist: function(playlist){
	if (0 < playlist.length) {
		var list = [];
		$.each(playlist, function(i,v){
			if (typeof v == "object") {
				var liclass="i",
					html = $("<div/>").attr('class','ppbtn'),
					duration = $("<div/>").attr('class','d').text(aC.niceDuration(v.duration)),
					itemlist = $("<ul/>").attr('class','ti'),
					item = '<li class="tt">'+(i+1)+'. '+v.track+'</li><li class="a">'+v.artist+'</li>';
				if (v.duration == 0 || v.id == "" || v.id == 0 || v.img == "") liclass += " un";
				if (0 < aC.searchLength && i == $.inArray(aC.index,aC.searchResults)) liclass += " on";
				else if (i == aC.index) liclass += " on";
				list.push($("<li/>").attr('class',liclass).setData(v).html(html).append(duration).append(itemlist.append(item))[0]);
			}
		});
		$("#content").html(list);
		$(".ti").width(aC.dimension-74);
	} else {
		if (0 < aC.playlist.length) {
			$("#sresultcount").empty();
			$("#content").html($("<li/>").attr('class','i none').text('No Search Results'));
		} else console.log('Playlist is empty');
	}
},
checkPlaylist: function(){
	if (sls()) {
		var playlist = localStorage.getItem('playlist');
		if (Object.toType(playlist) != "null") {
			aC.playlist = playlist = $.parseJSON(playlist);
			aC.playlistLength = playlist.length;
			if ($.isArray(playlist) && 0 < aC.playlistLength) aC.loadPlaylist(playlist);
			else console.log("Error loading local playlist");
		}
	}
	$.getJSON("playlist.json", function(a){
		var data = a.data;
		if ($.isArray(data) && 0 < data.length) {
			if (sls()) localStorage['playlist'] = JSON.stringify(data);
			if (!$.isArray(aC.playlist) || aC.playlistLength == 0) {
				aC.playlist = data;
				aC.playlistLength = data.length;
				aC.loadPlaylist(data);
			}
		} else console.log("Error loading playlist");
	});
},
checkHash: function(){
	var hash = getHash(), found = false;
	if (1 < hash.length) {
		for (var index in aC.playlist) {
			if (aC.playlist[index].id == hash) {
				aC.triggerPlayPause(+index);
				$('.player .meta .track-name').click();
				setTimeout("$('.player .list').click()",1000);
				setTimeout("$('#widgetContainer').animate({opacity:1})",1500);
				found = true;
				break;
			}
		}
	}
	if (found === false) {
		if (0 < hash.length) clearHash();
		$('#widgetContainer').animate({opacity:1});
		var plength = aC.playlistLength;
		if (0 < aC.searchLength) plength = aC.searchLength;
		var index = (aC.settings.random === false) ? 0 : getRandomInt(0,plength);
		if (aC.playlist[index].id == 0) index = getRandomInt(0,plength);
		var item = aC.playlist[index];
		$(".player .album-art-container").setData({index:index}).find(".art").attr('src',item.img);
		$(".player .meta .titles").find(".track-name").text((index+1)+'. '+item.track).setData({index:index}).end().find(".artist-name").text(item.artist);
		if (aC.settings.autostart === true) {
			aC.triggerPlayPause(index);
			$('.player .meta .track-name').click();
		}
		return false;
	}
},
niceDuration: function(a){
	if (0 < a) {
		var b = a/60, a = Math.floor(b), b = Math.round(60*(b-a));
		60 == b && (a++, b = 0);
		return 10 > b ? a + ":0" + b : a + ":" + b;
	} else return "0:00";
},
setDimensions: function(){
	var w = $(window), height = w.height(), width = w.width(), rchrome = /chrome/;
	var dimension = aC.dimension = height-$(".player").outerHeight()-1;
	$("#mainContainer").add(".player").add(".overlay").width(dimension);
	$("#widgetContainer,.player,.overlay").css("left",(w.width()-$("#widgetContainer").outerWidth())/2);
	$(".player .meta .progress-bar-container").width(dimension-123);
	if (0 < aC.index && aC.index < aC.playlistLength-1) $(".player .meta .controls .buffer").width(dimension-190);
	else $(".player .meta .controls .buffer").width(dimension-174);
	$(".ti").width(dimension-74);
	if (arguments.length == 1) {
		setTimeout(function(){
			aC.setPlayerDimensions();
		},1000);
	}
},
setPlayerDimensions: function(){
	var w = $(window), height = w.height(), width = w.width();
	if (width < aC.playerWidth+100 || height < aC.playerHeight+100) {
		aC.newPlayerWidth = width-100;
		aC.newPlayerHeight = aC.newPlayerWidth*.5625;
		$(ytplayer).height(aC.newPlayerHeight).width(aC.newPlayerWidth);
		$("#vD").center("fixed");
	}
},
loadQueryString: function(){
	aC.query = parseQueryString();
},
loadSettings: function(){
	if (sls()) {
		var settings = localStorage.getItem('settings');
		if (Object.toType(settings) != "null") {
			aC.settings = $.parseJSON(settings);
			for (id in aC.settings) {
				if (aC.settings[id] === false) $("#"+id+" .on").attr('class','off').text('Off');
				else if (aC.settings[id] === true) $("#"+id+" .off").attr('class','on').text('On');
				else if (Object.toType(aC.settings[id]) === "string") $("#"+id+" .on").text(aC.settings[id].capitalize());
				else if (Object.toType(aC.settings[id]) === "number") $("#"+id+" .on").text(aC.settings[id]);
			}
			if (aC.settings.scrobble === true) {
				aC.scrobbleAuthenticate();
			}
		}
	}
},
showNotification: function(a){
	$("#notifBar #message").html(a);
	$("#notifBar").animate({top: 0}, "fast");
},
hideNotification: function(){
	$("#notifBar").animate({top: -80}, "fast");
	$("#notifBar #message").empty();
},
handleScrobbling: function(){
	if (aC.settings.scrobble === true && aC.lastfm.scrobbled === false) {
		aC.lastfm.scrobbled = true;
		aC.scrobblePlayingTO = setTimeout("aC.scrobblePlaying()", aC.lastfm.scrobblePlayingDelay*1E3);
		aC.scrobbleTO = setTimeout("aC.scrobbleTrack()", aC.lastfm.scrobbleDelay*1E3);
	}
},
handleTrack: function(newSeekerWidth){
	if (aC.seekerInterval !== null) clearInterval(aC.seekerInterval), aC.seekerInterval = null;
	if (aC.durationInterval !== null) clearInterval(aC.durationInterval), aC.durationInterval = null;
	var $player = $(".player.on"), $seeker = $player.find(".seeker"), bufferWidth = $player.find(".buffer").width();
	var seekerWidth = $seeker.width(), ytCurrentTime = yt.getCurrentTime(), msDuration = Number(aC.playlist[aC.index].duration)*1E3, msPerSeekerPixel = Math.floor(msDuration/bufferWidth);
	if (aC.settings.express === true && ytCurrentTime < aC.settings.starttime-1) ytCurrentTime = aC.settings.starttime-1;
	if (0 < +newSeekerWidth) {
		seekerWidth = newSeekerWidth;
		ytCurrentTime = Math.floor(msPerSeekerPixel*seekerWidth/1E3);
		yt.seekTo(ytCurrentTime);
	} else {
		seekerWidth = Math.floor(bufferWidth/msDuration*ytCurrentTime*1E3);
	}
	$seeker.width(seekerWidth);
	aC.seekerInterval = setInterval(function(){
		seekerWidth < bufferWidth && $seeker.width(++seekerWidth);
	}, msPerSeekerPixel);
	$player.find(".time-spent").text(aC.niceDuration(--ytCurrentTime));
	aC.durationInterval = setInterval(function(){
		$player.find(".time-spent").text(aC.niceDuration(++ytCurrentTime));
	}, 1E3);
},
triggerPlayPause: function(i){
	if (arguments.length == 0) i = aC.index;
	var a = i, plength = aC.playlistLength;
	if (0 < aC.searchLength) {
		a = aC.searchResults[i];
		plength = aC.searchLength;
	}
	try {
		if (aC.playlist[a].id == 0) a = (aC.settings.random === false) ? (a+1) : getRandomInt(0,plength);
		var player = $(".player"), item = aC.playlist[a], pid = item.id;
	} catch(e) {
		return false;
	}
	if (a == aC.index && arguments.length == 1) {
		if (player.hasClass("on")) {
			player.removeClass("on").addClass("off");
			$("#content").find(".i").eq(i).removeClass("on").addClass("off");
			yt.pauseVideo();
			if (aC.expressTO !== null) clearTimeout(aC.expressTO), aC.expressTO = null;
		} else {
			player.removeClass("off").addClass("on");
			$("#content").find(".i").eq(i).removeClass("off").addClass("on");
			yt.playVideo();
			if (aC.settings.express === true) aC.expressTO = setTimeout("aC.goNextVideo()",aC.settings.playtime*1E3);
		}
	} else {
		if (arguments.length == 1) {
			aC.history.push(a);
			aC.historyPos = aC.history.length-1;
		}
		aC.hideNotification();
		player.find(".seeker").width(0);
		player.find(".time-spent").text("0:00");
		player.find(".album-art-container").setData({index:a}).find(".art").attr('src',item.img);
		player.find(".track-name").text((a+1)+'. '+item.track).setData({index:a}).end().find(".artist-name").text(item.artist);
		player.removeClass("off").addClass("on");
		$("#content").find(".i").removeClass("on").eq(i).addClass("on");
		if (a > 0) {
			if (a == aC.playlistLength-1) {
				player.find(".buffer").css('margin-left',1).width(aC.dimension-174);
				player.find(".skip-fwd").hide().end().find(".skip-back").show();
			} else {
				player.find(".buffer").css('margin-left',1).width(aC.dimension-190);
				player.find(".skip-back").show().end().find(".skip-fwd").show();
			}
		} else {
			player.find(".skip-back").hide().end().find(".skip-fwd").show();
			player.find(".buffer").css('margin-left',4).width(aC.dimension-174);
		}
		
		if (aC.expressTO !== null) clearTimeout(aC.expressTO), aC.expressTO = null;
		if (aC.settings.express === true) {
			yt.cueVideo(pid);
			var repeat = "true";
			if (aC.settings.repeat === true) repeat = "";
			yt.seekTo(aC.settings.starttime);
			aC.expressTO = setTimeout("aC.goNextVideo("+repeat+")",aC.settings.playtime*1E3);
		} else {
			if (aC.settings.repeat === false && a != aC.index) yt.loadVideo(pid);
			else yt.seekTo(0);
		}
		setHash(pid);
	}
	aC.index = a;
	aC.handleTrack();
	aC.handleScrobbling();
},
goPrevVideo: function(){
	if (1 < aC.history.length && 0 < aC.historyPos) aC.triggerPlayPause(aC.history[aC.historyPos--],true);
},
goNextVideo: function(){
	aC.lastfm.scrobbled = false;
	if (aC.scrobblePlayingTO !== null) clearTimeout(aC.scrobblePlayingTO), aC.scrobblePlayingTO = null;
	if (aC.scrobbleTO !== null) clearTimeout(aC.scrobbleTO), aC.scrobbleTO = null;
	if (aC.settings.repeat === false || arguments.length == 1) {
		var plength = aC.playlistLength;
		if (0 < aC.searchLength) plength = aC.searchLength;
		var index = (aC.settings.random === false) ? (aC.index+1) : getRandomInt(0,plength);
		if (index == aC.index) index = getRandomInt(0,plength);
		aC.triggerPlayPause(index, true);
	} else aC.triggerPlayPause(aC.index, true);
},
onKeyDown: function(e){
	if (aC.searchFocus === true || aC.starttimeFocus === true || aC.playtimeFocus === true) return;
	switch (e.which) {
		case keys.PLAY:
		case keys.SPACE:
		case keys.ENTER:
		case keys.ENTER2:
		case keys.NUMPAD_ENTER:
		case keys.PAUSE:
		case keys.PAUSE2:
			aC.triggerPlayPause(aC.index);
		break;
		case keys.PREV:
		case keys.LEFT_ARROW:
		case keys.LEFT_ARROW2:
			aC.goPrevVideo(true);
		break;
		case keys.NEXT:
		case keys.RIGHT_ARROW:
		case keys.RIGHT_ARROW2:
			aC.goNextVideo(true);
		break;
		case keys.ESCAPE:
			if ($("body").hasClass("engage")) $(".player .meta .list").click();
			if ($("#config").offset().top == 0) $("#config .closeButton").click();
			if ($("#search").offset().top == 0) $("#search .closeButton").click();
			if ($("#notifBar").offset().top == 0) aC.hideNotification();
		break;
		case keys.BACKSPACE:
			return false;
		break;
		default:
			var key = String.fromCharCode(e.which);
			if (/[A-Z]/.test(key)) {
				var playlist = aC.playlist;
				for (index in playlist) {
					//if (playlist[index].
				}
			} else if (/\d/.test(key)) {
				/*
				var jsp = $('.jspScrollable').data('jsp'), offset = $("#content").find(".i").filter(":last").offset().top-$(".player").outerHeight();
				if (key == 1) jsp.scrollToY(0);
				else if (key == 0) jsp.scrollToY(offset);
				else {
					var increment = offset/9;
					jsp.scrollToY(increment*key);
				}
				*/
			}
		break;
	}
},
doStarttimeKeys: function(e){
	var key = String.fromCharCode(e.which);
	if (!/\d/.test(key)) {
		switch (e.which) {
			case keys.BACKSPACE:
			case keys.DELETE:
			case keys.LEFT_ARROW:
			case keys.RIGHT_ARROW:
			case keys.LEFT_ARROW2:
			case keys.RIGHT_ARROW2:
				return true;
			break;
			default:
				return false;
			break;
		}
	} else {
		if ($(this).html().length >= 3) return false;
	}
	aC.settings.starttime = parseInt($(this).html());
	if (sls()) localStorage['settings'] = JSON.stringify(aC.settings);
	return false;
},
doPlaytimeKeys: function(e){
	var key = String.fromCharCode(e.which);
	if (!/\d/.test(key)) {
		switch (e.which) {
			case keys.BACKSPACE:
			case keys.DELETE:
			case keys.LEFT_ARROW:
			case keys.RIGHT_ARROW:
			case keys.LEFT_ARROW2:
			case keys.RIGHT_ARROW2:
				return true;
			break;
			default:
				return false;
			break;
		}
	} else {
		if ($(this).html().length >= 3) return false;
	}
	aC.settings.playtime = parseInt($(this).html());
	if (sls()) localStorage['settings'] = JSON.stringify(aC.settings);
	return false;
},
doSearch: function(){
	var val = $.trim($("#sB").val().replace(/[^a-zA-Z 0-9]+/g,'').replace('   ',' ').replace('  ',' '));
	if (2 < val.length && val != search) {
		aC.search = val;
		var rlength = aC.searchLength;
		aC.searchResults = aC.searchPlaylist(val, aC.playlist);
		if (0 < aC.searchLength) $("#sresultcount").text(aC.searchLength);
		if (rlength != aC.searchLength) {
			aC.loadPlaylist($.grep(aC.playlist, function(v,i){
				return $.inArray(i,aC.searchResults) > -1;
			}));
		}			
	} else if (0 == val.length) {
		aC.search = "";
		aC.searchLength = -1;
		$("#sresultcount").empty();
		aC.loadPlaylist(aC.playlist);
	}
},
scrobbleAuthenticate: function(){
	if (!aC.query.token) {
		window.location = "http://www.last.fm/api/auth?api_key="+aC.lastfm.apiKey+"&cb="+document.URL;
	} else {
		aC.lastfm.apiToken = aC.query.token;
		aC.lastfm.api = new LastFM({
			apiKey    : aC.lastfm.apiKey,
			apiSecret : aC.lastfm.apiSecret
		});
		try {
			aC.lastfm.api.auth.getSession({
				token: aC.lastfm.apiToken
			}, {
				success: function(data){
					aC.lastfm.sessionKey = data.session.key;
					aC.lastfm.sessionName = data.session.name;
				}
			});
		} catch(e) {}
	}
},
scrobblePlaying: function(){
	try {
		aC.lastfm.api.track.updateNowPlaying({
			artist: aC.playlist[aC.index].artist,
			track: aC.playlist[aC.index].track
		}, { key: aC.lastfm.sessionKey });
	} catch(e) {}
},
scrobbleTrack: function(){
	try {
		aC.lastfm.api.track.scrobble({
			artist: aC.playlist[aC.index].artist,
			track: aC.playlist[aC.index].track,
			timestamp: timestamp_sec()
		}, { key: aC.lastfm.sessionKey });
	} catch(e) {}
}
};
})();

$(window).resize(function(){
	if (aC.resizeTO !== null) clearTimeout(aC.resizeTO);
	aC.resizeTO = setTimeout(aC.setDimensions(true), 200);
});

$(document).ready(function(){
	aC.loadQueryString();
	aC.setDimensions();
	aC.loadSettings();
	$("#sB").on('focus',function(){
		aC.searchFocus = true;
		if ($(this).val() == "Search Music") $(this).val('');
	}).on('blur',function(){
		aC.searchFocus = false;
		if ($.trim($(this).val()) == "") $(this).val('Search Music');
	}).keyup(aC.doSearch);
	$("#notifBar .closeButton").on('click',function(){
		aC.hideNotification();
	});
	$("#search .closeButton").on('click',function(){
		$("#search").animate({top: -80}, "fast");
	});
	$("#config .closeButton").on('click',function(){
		$("#config").animate({top: -80}, "fast");
	});
	$("#config ul").on('click','.setting',function(){
		var id = $(this).attr('id');
		aC.settings[id] = !aC.settings[id];
		if (aC.settings[id] === false) {
			$("#"+id+" .on").attr('class','off').text('Off');
		} else {
			$("#"+id+" .off").attr('class','on').text('On');
		}
		if (sls()) localStorage['settings'] = JSON.stringify(aC.settings);
		if (id == "express") {
			if (aC.settings.express === true) {
				aC.expressTO = setTimeout("aC.goNextVideo()",aC.settings.playtime*1E3);
			} else {
				if (aC.expressTO !== null) clearTimeout(aC.expressTO), aC.expressTO = null;
			}
		}
	});
	$("#config #quality").on('click',function(){
		aC.qualityChanged = true;
		if (aC.settings["quality"] == "small") {
			aC.settings["quality"] = "medium";
			$("#quality .on").text('Medium');
		} else if (aC.settings["quality"] == "medium") {
			aC.settings["quality"] = "large";
			$("#quality .on").text('Large');
		} else if (aC.settings["quality"] == "large") {
			aC.settings["quality"] = "hd720";
			$("#quality .on").text('HD 720');
		} else if (aC.settings["quality"] == "hd720") {
			aC.settings["quality"] = "hd1080";
			$("#quality .on").text('HD 1080');
		} else {
			aC.settings["quality"] = "small";
			$("#quality .on").text('Small');
		}
		if (sls()) localStorage['settings'] = JSON.stringify(aC.settings);
	});
	$("#config #sort").on('click',function(){
		if (aC.settings["sort"] == "artist") {
			aC.settings["sort"] = "track";
			$("#sort .on").text('Track');
		} else if (aC.settings["sort"] == "track") {
			aC.settings["sort"] = "random";
			$("#sort .on").text('Random');
		} else {
			aC.settings["sort"] = "artist";
			$("#sort .on").text('Artist');
		}
		if (sls()) localStorage['settings'] = JSON.stringify(aC.settings);
	});
	$("#starttime").on('click',function(){
		$("#starttime .on").focus();
	});
	$("#starttime .on").on('focus',function(){
		aC.starttimeFocus = true;
	}).on('blur',function(){
		aC.starttimeFocus = false;
	}).keyup(aC.doStarttimeKeys);
	$("#playtime").on('click',function(){
		$("#playtime .on").focus();
	});
	$("#playtime .on").on('focus',function(){
		aC.playtimeFocus = true;
	}).on('blur',function(){
		aC.playtimeFocus = false;
	}).keyup(aC.doPlaytimeKeys);
	$("#widgetContainer").hover(function(){
		$(".player .meta .titles").animate({
			width: $(".player").width()-$('.player').outerHeight()-8-$(".right-bar-buttons").width()-8
		}, 100)
	}, function(){
		$(".player .meta .titles").animate({
			width: $(".player").width()-$('.player').outerHeight()-8-8-19
		}, 100)
	});
	$(".player .config").on('click',function(){
		$("#config").animate({top: 0}, "fast");
	});
	$(".player .meta .track-name").on('click',function(){
		var coffset = Math.abs($("#content").offset().top);
		var offset = $("#content").find(".i").eq(aC.index).offset().top;
	});
	$(".player .meta .embed").on('click',function(){
		$("#search").animate({top: 0}, "fast");
	});
	$(".player .meta .list").on('click',function(){
		if (aC.qualityChanged !== true) {
			if (aC.settings.quality == "small") aC.settings.quality = "hd720";
			else aC.settings.quality = "small";
		}
		$("body").toggleClass("engage");
		$("#vD").toggleClass("hide");
	});
	$(".player .album-art-container").on('click',function(){
		aC.triggerPlayPause($(this).data('index'));
	});
	$("#content").on('click','.i',function(){
		aC.triggerPlayPause($(this).index());
	});
	$(".player .skip-back").on('click',function(){
		aC.goPrevVideo(true);
	});
	$(".player .skip-fwd").on('click',function(){
		aC.goNextVideo(true);
	});
	$(".player .buffer").on('click',function(e){
		var x = e.pageX-$(this).offset().left;
		aC.handleTrack(x);
	});
	(function(){
		var a = {allowScriptAccess: "always"}, b = {id: "ytplayer"};
		swfobject.embedSWF("http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=ytplayer&key="+yt.devkey, "iVD", aC.playerWidth, aC.playerHeight, "8", null, null, a, b);
	})();
}).keydown(aC.onKeyDown);

function onYouTubePlayerReady(a){
	ytplayer = document.getElementById("ytplayer");
	ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onError", "onPlayerError");
	aC.setPlayerDimensions();
	$("#vD").center("fixed").addClass('hide').css('visibility','visible');
	aC.checkPlaylist();
	aC.checkHash();
}

function onPlayerStateChange(a){
	if (a == yt.ps.ended) {
		if (aC.settings.repeat === false) aC.goNextVideo(true);
		else aC.goNextVideo();
	}
}

function onPlayerError(a){
	$("#content").find(".i").eq(aC.index).addClass("un");
	aC.goNextVideo(true);
	console.log('Error! oPE Type: '+a);
}