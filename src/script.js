var durationTimer,
	clickedTrack,
	PLAYER_HEIGHT=80,
	PLAYER_MIN_WIDTH=250,
	ENGAGEVIEW_MIN_HEIGHT=249,
	BORDER_THICKNESS=1,
	DOUBLE_BORDER_THICKNESS=2;

function showNotificationBar(b){
	$("#notifBar #message")[0].innerHTML = b;
	$("#notifBar").animate({top: 0}, "fast")
}

function hideNotificationBar(){
	$("#notifBar").animate({top: -80}, "fast")
}

function playPauseTrack(datatrack, rel, context){
	console.log('datatrack',datatrack,'rel',rel,'context',context)
}

function triggerPlayPause(b, g, q){
	g && g.preventDefault();
	hideNotificationBar();
	clickedTrack = b;
	setTimeout(function(){
		if (clickedTrack) {
			clickedTrack.attr("class", clickedTrack.attr("class") + " loading");
			setTimeout(function(){
				clickedTrack && clickedTrack.removeClass("loading")
			}, 6E4)
		}
	}, 300);
	playPauseTrack(b.attr("data-track"), b.attr("rel"), context);
	return !1
}

function changePlayModeForTrack(b){
	var g = b.track, q = b.status;
	clickedTrack = null;
	trackId = getTrackId(g);
	seekerInterval && (clearInterval(seekerInterval), seekerInterval = null);
	durationTimer && (clearInterval(durationTimer), durationTimer = null);
	$(".music-playing").removeClass("music-playing").addClass("music-paused");
	g = $(".track-" + trackId);
	if (0 < g.length && (q && ($(".player").removeClass("music-paused").addClass("music-playing"), updateStatusBar(g)), $(".active").removeClass("active"), g.attr("class", q ? "track-" + trackId + " music-playing active item " + contextType : "track-" + trackId + " music-paused active item " + contextType), g.each(function(b, g){
		$(g)
	}), q)) {
		$("#engageView").removeClass("music-paused").addClass("music-playing");
		var s = $(".player .meta .progress-bar-container .buffer").width(),
			q = Number(g.attr("data-duration-ms")),
			g = Math.floor(q / s);
		$(".music-playing .seeker").width(Math.floor(s / q * 1E3 * b.playing_position));
		seekerInterval = setInterval(function(){
			var b = $(".music-playing .seeker").width();
			b < s && $(".music-playing .seeker").width(b + 1)
		}, g);
		var p = 1E3 * b.playing_position;
		$(".player .meta .progress-bar-container .time-spent")[0].innerHTML = readableTime(p);
		durationTimer = setInterval(function(){
			p = p + 1E3;
			$(".player .meta .progress-bar-container .time-spent")[0].innerHTML = readableTime(p)
		}, 1E3)
	}
}

function onClientError(b){
	showNotificationBar(b.message);
	$(".track-" + b.uri.split(":")[2]).addClass("unavailable")
}

function readableTime(b){
	var g = b / 1E3 / 60,
		b = Math.floor(g),
		g = Math.round(60 * (g - b));
	60 == g && (b++, g = 0);
	return 10 > g ? b + ":0" + g : b + ":" + g
}

function getTrackId(b){
	if (!b) return "";
	if ("ad" != b.track_type) {
		if (0 < $(".track-" + b.track_resource.uri.split(":")[2]).length) return b.track_resource.uri.split(":")[2];
		if (0 < $(".track-" + b.artist_resource.uri.split(":")[2]).length) return b.artist_resource.uri.split(":")[2];
		if (0 < $(".track-" + b.album_resource.uri.split(":")[2]).length) return b.album_resource.uri.split(":")[2]
	}
	return ""
}

$(document).ready(function(){
	//$("#mainContainer").jScrollPane();
	$(".jspPane").jScrollPane();
});

$(".player .album-art-container").click(function(b){
	triggerPlayPause($(".track-" + $(this).parent().attr("rel")), b)
});

$(".item").click(function(b){
	triggerPlayPause($(this), b)
});

$("#engageView .middle").click(function(b){
	triggerPlayPause($(".track-" + $(this).parent().parent().parent().attr("rel")), b)
});

$("#notifBar .notifCloseButton").click(function(){
	hideNotificationBar()
});

$("#widgetContainer").hover(function(){
	$(".player .meta .titles").animate({
		width: $(".player").width() - PLAYER_HEIGHT - 8 - $(".right-bar-buttons").width() - 8
	}, 100)
}, function(){
	$(".player .meta .titles").animate({
		width: $(".player").width() - PLAYER_HEIGHT - 8 - 8 - 19
	}, 100)
});

$(".player, #mainContainer, #engageView").mousedown(function(b){
	b.preventDefault()
});