(function(){
aC = {
devkey: "AI39si6-KJa9GUrvoNKGEh0rZWfJ2yFrPOxIN79Svnz9zAhosYHrbZfpADwJhd3v6TNl9DbvTtUS_deOcoNCodgvTqq3kxcflw",
playbackQuality: "small",
playerHeight: 506,
newPlayerHeight: 0,
playerWidth: 900,
newPlayerWidth: 0,
dimension: 0,
history: [],
historyPos: -1,
playlist: [],
playlistLength: 0,
index: -1,
search: "",
searchFocus: false,
resizeTO: false,
settings: {
	random: true,
	express: true,
	autostart: true
},
loadPlaylist: function(playlist){
	if (playlist.length > 0) {
		var index = (aC.settings.random === false) ? 0 : getRandomInt(0,aC.playlistLength);
		while (aC.playlist[index].id == 0) index = getRandomInt(0,aC.playlistLength);
		$(".player .album-art-container").setData({index:index}).find(".art").attr('src',playlist[index].img);
		$(".player .meta .titles").find(".track-name").text((index+1)+'. '+playlist[index].track).setData({index:index}).end().find(".artist-name").text(playlist[index].artist);
		aC.index = index;
		var list = [];
		$.each(playlist, function(i,v){
			if (typeof v == "object") {
				var liclass="i p",
					html = $("<div/>").attr('class','ppbtn'),
					duration = $("<div/>").attr('class','d').text(aC.niceDuration(v.duration)),
					itemlist = $("<ul/>").attr('class','ti'),
					item = '<li class="tt">'+(i+1)+'. '+v.track+'</li><li class="a">'+v.artist+'</li>';
				if (v.duration == 0 || v.id == "" || v.id == 0 || v.img == "") liclass = liclass + " un";
				list.push($("<li/>").attr('class',liclass).setData(v).html(html).append(duration).append(itemlist.append(item))[0]);
			}
		});
		$("#content").html(list);
		$(".ti").width(aC.dimension - 74);
		$("#mainContainer").jScrollPane();
		$(".jspPane").width($(".jspContainer").width());
	} else console.log('Playlist is empty');
},
checkPlaylist: function(){
	if (sls()) {
		if (localStorage.getItem('playlist')){
			aC.playlist = $.parseJSON(localStorage.getItem('playlist'));
			aC.playlistLength = aC.playlist.length;
			if ($.isArray(aC.playlist) && aC.playlistLength > 0) aC.loadPlaylist(aC.playlist);
			else console.log("Error loading local playlist");
		}
	}
	$.getJSON("playlist.json", function(a){
		if ($.isArray(a.data) && a.data.length > 0) {
			localStorage['playlist'] = JSON.stringify(a.data);
			if (!$.isArray(aC.playlist) || aC.playlistLength == 0) {
				aC.playlist = a.data;
				aC.playlistLength = aC.playlist.length;
				aC.loadPlaylist(aC.playlist);
			}
		} else console.log("Error loading playlist");
	});
},
checkHash: function(){
	var hash = getHash(), found = false;
	if (hash.length > 1) {
		for (var index in aC.playlist) {
			if (aC.playlist[index].id == hash) {
				aC.triggerPlayPause(parseInt(index));
				$('.player .meta .track-name').click();
				setTimeout("$('.player .list').click()",1000);
				setTimeout("$('#widgetContainer').animate({opacity:1})",1500);
				found = true;
				break;
			}
		}
	}
	if (found === false) {
		clearHash();
		$('#widgetContainer').animate({opacity:1});
		if (aC.settings.autostart === true) aC.triggerPlayPause(aC.index);
		return false;
	} else return true;
},
niceDuration: function(a){
	var b = a / 60, a = Math.floor(b), b = Math.round(60 * (b - a));
	60 == b && (a++, b = 0);
	return 10 > b ? a + ":0" + b : a + ":" + b;
},
setDimensions: function(){
	var w = $(window), height = w.height(), width = w.width(), rchrome = /chrome/;
	aC.dimension = height - $(".player").outerHeight() - 1;
	$("#mainContainer").height(aC.dimension).add(".player").add(".overlay").width(aC.dimension);
	$("#widgetContainer").css("left",(w.width() - $("#widgetContainer").outerWidth()) / 2);
	$(".player .meta .progress-bar-container").width(aC.dimension - 123);
	if (0 < aC.index && aC.index < aC.playlistLength-1) $(".player .meta .controls .buffer").width(aC.dimension - 187);
	else $(".player .meta .controls .buffer").width(aC.dimension - 171);
	$(".ti").width(aC.dimension - 74);
	if (arguments.length == 1) {
		setTimeout(function(){
			aC.setPlayerDimensions();
			$(".jspScrollable").data('jsp').reinitialise();
			$(".jspPane").width($(".jspContainer").width());
		},1000);
	}
	if (!(rchrome.test(navigator.userAgent.toLowerCase()))) aC.showNotification("This website works best while using Google Chrome. Wise up!");
},
setPlayerDimensions: function(){
	var w = $(window), height = w.height(), width = w.width();
	if (width < aC.playerWidth+100 || height < aC.playerHeight+100) {
		aC.newPlayerWidth = width - 100;
		aC.newPlayerHeight = aC.newPlayerWidth * .5625;
		$(ytplayer).height(aC.newPlayerHeight).width(aC.newPlayerWidth);
		$("#vD").center();
	}
},
loadSettings: function(){
	
},
showNotification: function(a){
	$("#notifBar #message").html(a);
	$("#notifBar").animate({top: 0}, "fast");
},
hideNotification: function(){
	$("#notifBar").animate({top: -80}, "fast");
	$("#notifBar #message").empty();
},
handleTrack: function(){
	var player = $(".player");
	/*
	seekerInterval && (clearInterval(seekerInterval), seekerInterval = null);
	durationTimer && (clearInterval(durationTimer), durationTimer = null);
	var s = player.find(".buffer").width(),
		q = Number(aC.playlist[a].duration),
		g = Math.floor(q / s);
	$(".on .seeker").width(Math.floor(s / q * 1E3 * b.playing_position));
	seekerInterval = setInterval(function(){
		var b = $(".on .seeker").width();
		b < s && $(".on .seeker").width(b+1);
	}, g);
	var p = 1E3 * b.playing_position;
	player.find(".time-spent")[0].text(aC.niceDuration(p));
	durationTimer = setInterval(function(){
		p = p + 1E3;
		player.find(".time-spent")[0].text(aC.niceDuration(p));
	}, 1E3);
	*/
},
triggerPlayPause: function(a){
	var player = $(".player");
	while (aC.playlist[a].id == 0) a = (aC.settings.random === false) ? (index+1) : getRandomInt(0,aC.playlistLength);
	if (a == aC.index) {
		if (player.hasClass("on")) {
			player.removeClass("on").addClass("off");
			$("#content").find(".i").eq(a).removeClass("on").addClass("off");
			yt.pauseVideo();
		} else {
			player.removeClass("off").addClass("on");
			$("#content").find(".i").eq(a).removeClass("off").addClass("on");
			yt.playVideo();
		}
	} else {
		aC.index = a;
		if (arguments.length == 1) {
			aC.history.push(a);
			aC.historyPos = aC.history.length-1;
		}
		aC.hideNotification();
		player.find(".time-spent").text("0:00");
		player.find(".album-art-container").setData({index:a}).find(".art").attr('src',aC.playlist[a].img);
		player.find(".track-name").text((a+1)+'. '+aC.playlist[a].track).setData({index:a}).end().find(".artist-name").text(aC.playlist[a].artist);
		player.removeClass("off").addClass("on");
		$("#content").find(".i").removeClass("on").eq(a).addClass("on");
		if (a > 0) {
			if (a == aC.playlistLength-1) {
				player.find(".buffer").css('margin-left',1).width(aC.dimension - 171);
				player.find(".skip-fwd").hide().end().find(".skip-back").show();
			} else {
				player.find(".buffer").css('margin-left',1).width(aC.dimension - 187);
				player.find(".skip-back").show().end().find(".skip-fwd").show();
			}
		} else {
			player.find(".skip-back").hide().end().find(".skip-fwd").show();
			player.find(".buffer").css('margin-left',4).width(aC.dimension - 171);
		}
		var pid = aC.playlist[a].id;
		yt.loadAndPlayVideo(pid);
		setHash(pid);
		aC.handleTrack();
	}
},
goPrevVideo: function(){
	if (aC.history.length > 1) aC.triggerPlayPause(aC.history[aC.historyPos],true);
},
goNextVideo: function(){
	var index = (aC.settings.random === false) ? (aC.index+1) : getRandomInt(0,aC.playlistLength);
	while (index == aC.index) index = getRandomInt(0,aC.playlistLength);
	if (arguments.length == 1) aC.triggerPlayPause(index);
	else aC.triggerPlayPause(index, true);
},
onKeyDown: function(e){
	if (aC.searchFocus === true) return;
	switch (e.which) {
		case keys.PLAY:
		case keys.SPACE:
		case keys.ENTER:
		case keys.ENTER_OLD:
		case keys.NUMPAD_ENTER_OLD:
		case keys.PAUSE:
		case keys.PAUSE_OLD:
			aC.triggerPlayPause(aC.index);
		break;
		case keys.PREV:
		case keys.LEFT_ARROW:
		case keys.LEFT_ARROW_OLD:
			aC.goPrevVideo();
		break;
		case keys.NEXT:
		case keys.RIGHT_ARROW:
		case keys.RIGHT_ARROW_OLD:
			aC.goNextVideo();
		break;
		case keys.ESCAPE:
			if ($("body").hasClass("engage")) $(".player .meta .list").click();
			if ($("#config").offset().top == 0) $("#config .closeButton").click();
			if ($("#search").offset().top == 0) $("#search .closeButton").click();
			if ($("#notifBar").offset().top == 0) aC.hideNotification();
		break;
	}
},
doSearch: function(){
	var val = $.trim($("#sB").val());
	if (0 < val.length && val != aC.search) {
		aC.search = val;
		alert(val);
	}
}
};
})();

$(window).resize(function(){
	if (aC.resizeTO !== false) clearTimeout(aC.resizeTO);
	aC.resizeTO = setTimeout(aC.setDimensions(true), 200);
});

$(document).ready(function(){
	aC.setDimensions();
	aC.loadSettings();
	aC.checkPlaylist();
	$("#sB").live('focus',function(){
		aC.searchFocus = true;
		if ($(this).val() == "Search Music") $(this).val('');
	}).live('blur',function(){
		aC.searchFocus = false;
		if ($.trim($(this).val()) == "") $(this).val('Search Music');
	}).keyup(aC.doSearch);
	$("#notifBar .closeButton").live('click',function(){
		aC.hideNotification();
	});
	$("#search .closeButton").live('click',function(){
		$("#search").animate({top: -80}, "fast");
	});
	$("#config .closeButton").live('click',function(){
		$("#config").animate({top: -80}, "fast");
	});
	$("#widgetContainer").hover(function(){
		$(".player .meta .titles").animate({
			width: $(".player").width() - $('.player').outerHeight() - 8 - $(".right-bar-buttons").width() - 8
		}, 100)
	}, function(){
		$(".player .meta .titles").animate({
			width: $(".player").width() - $('.player').outerHeight() - 8 - 8 - 19
		}, 100)
	});
	$(".player .config").live('click',function(){
		$("#config").animate({top: 0}, "fast");
	});
	$(".player .meta .track-name").live('click',function(){
		var offset = $("#content").find(".i").eq(aC.index).offset();
		$('.jspScrollable').data('jsp').scrollToY(offset.top-$(".player").outerHeight());
	});
	$(".player .meta .embed").live('click',function(){
		$("#search").animate({top: 0}, "fast");
	});
	$(".player .meta .list").live('click',function(){
		if (aC.playbackQuality == "small") aC.playbackQuality = "hd720";
		else aC.playbackQuality = "small";
		$("body").toggleClass("engage");
		$("#vD").toggleClass("hide");
	});
	$(".player .album-art-container").live('click',function(){
		aC.triggerPlayPause($(this).data('index'));
	});
	$("#content").on('click','.i',function(){
		aC.triggerPlayPause($(this).index());
	});
	$(".player .skip-back").live('click',function(){
		aC.goPrevVideo();
	});
	$(".player .skip-fwd").live('click',function(){
		aC.goNextVideo();
	});
	$(".player .buffer").live('click',function(e){
		var x = e.pageX - $(this).offset().left;
		alert(x);
	});
	(function(){
		var a = {allowScriptAccess: "always"}, b = {id: "ytplayer"};
		swfobject.embedSWF("http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=ytplayer&key="+aC.devkey, "iVD", aC.playerWidth, aC.playerHeight, "8", null, null, a, b);
	})();
}).keydown(aC.onKeyDown);

function onYouTubePlayerReady(a){
	ytplayer = document.getElementById("ytplayer");
	ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onError", "onPlayerError");
	aC.setPlayerDimensions();
	$("#vD").center().addClass('hide').css('visibility','visible');
	aC.checkHash();
}

function onPlayerStateChange(a){
	if (a == yt.ps.ended) aC.goNextVideo();
}

function onPlayerError(a){
	$("#content").find(".i").eq(aC.index).addClass("un");
	aC.goNextVideo(true);
	console.log('Error! oPE Type: '+a);
}