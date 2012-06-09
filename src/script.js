(function(){
aC = {
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
resizeTO: null,
expressTO: null,
seekerInterval: null,
durationInterval: null,
settings: {
	random: true,
	express: true,
	playtime: 210,
	autostart: true
},
loadPlaylist: function(playlist){
	if (0 < playlist.length) {
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
		$(".ti").width(aC.dimension-74);
		$("#mainContainer").jScrollPane();
		$(".jspPane").width($(".jspContainer").width());
	} else console.log('Playlist is empty');
},
checkPlaylist: function(){
	var playlist = localStorage.getItem('playlist');
	if (sls() && Object.toType(playlist) != "null") {
		playlist = aC.playlist = $.parseJSON(playlist);
		aC.playlistLength = playlist.length;
		if ($.isArray(playlist) && 0 < aC.playlistLength) aC.loadPlaylist(playlist);
		else console.log("Error loading local playlist");
	}
	$.getJSON("playlist.json", function(a){
		var data = a.data;
		if ($.isArray(data) && 0 < data.length) {
			localStorage['playlist'] = JSON.stringify(data);
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
		if (0 < hash.length) clearHash();
		$('#widgetContainer').animate({opacity:1});
		var index = (aC.settings.random === false) ? 0 : getRandomInt(0,aC.playlistLength);
		if (aC.playlist[index].id == 0) index = getRandomInt(0,aC.playlistLength);
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
	var b = a/60, a = Math.floor(b), b = Math.round(60*(b-a));
	60 == b && (a++, b = 0);
	return 10 > b ? a + ":0" + b : a + ":" + b;
},
setDimensions: function(){
	var w = $(window), height = w.height(), width = w.width(), rchrome = /chrome/;
	var dimension = aC.dimension = height-$(".player").outerHeight()-1;
	$("#mainContainer").height(dimension).add(".player").add(".overlay").width(dimension);
	$("#widgetContainer").css("left",(w.width()-$("#widgetContainer").outerWidth())/2);
	$(".player .meta .progress-bar-container").width(dimension-123);
	if (0 < aC.index && aC.index < aC.playlistLength-1) $(".player .meta .controls .buffer").width(dimension-187);
	else $(".player .meta .controls .buffer").width(dimension-171);
	$(".ti").width(dimension-74);
	if (arguments.length == 1) {
		setTimeout(function(){
			aC.setPlayerDimensions();
			$(".jspScrollable").data('jsp').reinitialise();
			$(".jspPane").width($(".jspContainer").width());
		},1000);
	}
	if (!(rchrome.test(navigator.userAgent.toLowerCase()))) {
		aC.showNotification("This website works best while using Google Chrome. Wise up!");
		alert("Please Use Google Chrome. Wise Up!");
	}
},
setPlayerDimensions: function(){
	var w = $(window), height = w.height(), width = w.width();
	if (width < aC.playerWidth+100 || height < aC.playerHeight+100) {
		aC.newPlayerWidth = width-100;
		aC.newPlayerHeight = aC.newPlayerWidth*.5625;
		$(ytplayer).height(aC.newPlayerHeight).width(aC.newPlayerWidth);
		$("#vD").center();
	}
},
loadSettings: function(){
	var settings = localStorage.getItem('settings');
	if (sls() && Object.toType(settings) != "null") {
		aC.settings = $.parseJSON(settings);
		for (id in aC.settings) {
			if (aC.settings[id] === false) $("#"+id+" .on").attr('class','off').text('Off');
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
handleTrack: function(){
	if (aC.seekerInterval !== null) clearInterval(aC.seekerInterval), aC.seekerInterval = null;
	if (aC.durationInterval !== null) clearInterval(aC.durationInterval), aC.durationInterval = null;
	var player = $(".player.on"), seeker = player.find(".seeker"), s = player.find(".buffer").width();
	var b = seeker.width(), p = yt.getCurrentTime(), q = Number(aC.playlist[aC.index].duration)*1E3, g = Math.floor(q/s);
	if (aC.settings.express === true && p < 29) p = 29;
	if (arguments.length == 1) {
		var w = b = arguments[0], seek = w*g/1E3, p = g*w/1E3;
		yt.seekTo(seek);
	} else var w = b = Math.floor(s/q*p*1E3);
	seeker.width(w);
	aC.seekerInterval = setInterval(function(){
		b < s && seeker.width(++b)
	}, g);
	player.find(".time-spent").text(aC.niceDuration(--p));
	aC.durationInterval = setInterval(function(){
		player.find(".time-spent").text(aC.niceDuration(++p));
	}, 1E3);
},
triggerPlayPause: function(a){
	if (aC.playlist[a].id == 0) a = (aC.settings.random === false) ? (aC.index+1) : getRandomInt(0,aC.playlistLength);
	var player = $(".player"), item = aC.playlist[a], pid = item.id;
	if (a == aC.index && arguments.length == 1) {
		if (player.hasClass("on")) {
			player.removeClass("on").addClass("off");
			$("#content").find(".i").eq(a).removeClass("on").addClass("off");
			yt.pauseVideo();
			if (aC.expressTO !== null) clearTimeout(aC.expressTO), aC.expressTO = null;
		} else {
			player.removeClass("off").addClass("on");
			$("#content").find(".i").eq(a).removeClass("off").addClass("on");
			yt.playVideo();
			if (aC.settings.express === true) aC.expressTO = setTimeout("aC.goNextVideo()",aC.settings.playtime*1E3-yt.getCurrentTime()*1E3);
		}
	} else {
		if (arguments.length == 1) {
			aC.history.push(a);
			aC.historyPos = aC.history.length-1;
		}
		aC.index = a;
		aC.hideNotification();
		player.find(".seeker").width(0);
		player.find(".time-spent").text("0:00");
		player.find(".album-art-container").setData({index:a}).find(".art").attr('src',item.img);
		player.find(".track-name").text((a+1)+'. '+item.track).setData({index:a}).end().find(".artist-name").text(item.artist);
		player.removeClass("off").addClass("on");
		$("#content").find(".i").removeClass("on").eq(a).addClass("on");
		if (a > 0) {
			if (a == aC.playlistLength-1) {
				player.find(".buffer").css('margin-left',1).width(aC.dimension-171);
				player.find(".skip-fwd").hide().end().find(".skip-back").show();
			} else {
				player.find(".buffer").css('margin-left',1).width(aC.dimension-187);
				player.find(".skip-back").show().end().find(".skip-fwd").show();
			}
		} else {
			player.find(".skip-back").hide().end().find(".skip-fwd").show();
			player.find(".buffer").css('margin-left',4).width(aC.dimension-171);
		}
		
		if (aC.expressTO !== null) clearTimeout(aC.expressTO), aC.expressTO = null;
		if (aC.settings.express === true) {
			yt.cueVideo(pid);
			yt.seekTo(30);
			aC.expressTO = setTimeout("aC.goNextVideo()",aC.settings.playtime*1E3);
		} else yt.loadVideo(pid);
		setHash(pid);
	}
	aC.handleTrack();
},
goPrevVideo: function(){
	if (1 < aC.history.length && 0 < aC.historyPos) aC.triggerPlayPause(aC.history[aC.historyPos--],true);
},
goNextVideo: function(){
	var index = (aC.settings.random === false) ? (aC.index+1) : getRandomInt(0,aC.playlistLength);
	if (index == aC.index) index = getRandomInt(0,aC.playlistLength);
	if (arguments.length == 1) aC.triggerPlayPause(index, true);
	else aC.triggerPlayPause(index);
},
onKeyDown: function(e){
	if (aC.searchFocus === true) return;
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
			aC.goPrevVideo();
		break;
		case keys.NEXT:
		case keys.RIGHT_ARROW:
		case keys.RIGHT_ARROW2:
			aC.goNextVideo();
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
				var jsp = $('.jspScrollable').data('jsp'), offset = $("#content").find(".i").filter(":last").offset().top-$(".player").outerHeight();
				if (key == 1) jsp.scrollToY(0);
				else if (key == 0) jsp.scrollToY(offset);
				else {
					var increment = offset/9;
					jsp.scrollToY(increment*key);
				}
			}
		break;
	}
},
doSearch: function(){
	var val = $.trim($("#sB").val());
	if (0 < val.length && val != aC.search) {
		aC.search = val;
	}
}
};
})();

$(window).resize(function(){
	if (aC.resizeTO !== null) clearTimeout(aC.resizeTO);
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
	$("#settings").on('click','li',function(){
		var id = $(this).attr('id');
		aC.settings[id] = !aC.settings[id];
		if (aC.settings[id] === false) {
			$("#"+id+" .on").attr('class','off').text('Off');
		} else {
			$("#"+id+" .off").attr('class','on').text('On');
		}
		localStorage['settings'] = JSON.stringify(aC.settings);
		if (id == "express") {
			if (aC.settings.express === true) {
				aC.expressTO = setTimeout("aC.goNextVideo()",aC.settings.playtime*1E3-yt.getCurrentTime()*1E3);
			} else {
				if (aC.expressTO !== null) clearTimeout(aC.expressTO), aC.expressTO = null;
			}
		}
	});
	$("#widgetContainer").hover(function(){
		$(".player .meta .titles").animate({
			width: $(".player").width()-$('.player').outerHeight()-8-$(".right-bar-buttons").width()-8
		}, 100)
	}, function(){
		$(".player .meta .titles").animate({
			width: $(".player").width()-$('.player').outerHeight()-8-8-19
		}, 100)
	});
	$(".player .config").live('click',function(){
		$("#config").animate({top: 0}, "fast");
	});
	$(".player .meta .track-name").live('click',function(){
		var offset = $("#content").find(".i").eq(aC.index).offset().top;
		$('.jspScrollable').data('jsp').scrollToY(offset-$(".player").outerHeight());
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