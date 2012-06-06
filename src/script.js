$.fn.setData = function(obj){
	if (typeof obj != "object") return this;
	return this.each(function(){
		for (key in obj) {
			$(this).data(key, obj[key]);
		}
	});
};

$.fn.center = function(){
	var w = $(window);
	return this.each(function(){
		$(this).css("position","absolute");
		$(this).css("top",((w.height() - $(this).outerHeight()) / 2) + w.scrollTop() + "px");
		$(this).css("left",((w.width() - $(this).outerWidth()) / 2) + w.scrollLeft() + "px");
	});
};

function sls(){
	return ('localStorage' in window) && window['localStorage'] !== null;
}

function getRandomInt(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Array.prototype.diff = function(a){ return this.filter(function(i){return!(a.indexOf(i)>-1)}); };
Array.prototype.random = function(){ return this[getRandomInt(0,this.length-1)]; };

window.keys = {
DOWN_ARROW: 40,
DOWN_ARROW_OLD: 63233,
END: 35,
END_OLD: 63275,
ENTER: 13,
ESCAPE: 27,
HOME: 36,
HOME_OLD: 63273,
LEFT_ARROW: 37,
LEFT_ARROW_OLD: 63234,
NEXT: 176,
NUMPAD_ENTER_OLD: 108,
PAGE_DOWN: 34,
PAGE_DOWN_OLD: 63277,
PAGE_UP: 33,
PAGE_UP_OLD: 63276,
PAUSE: 19,
PAUSE_OLD: 63250,
PLAY: 179,
PREV: 177,
RIGHT_ARROW: 39,
RIGHT_ARROW_OLD: 63235,
SPACE: 32,
TAB: 9,
UP_ARROW: 38,
UP_ARROW_OLD: 63232
};

(function(){
aC = {
devkey: "AI39si6-KJa9GUrvoNKGEh0rZWfJ2yFrPOxIN79Svnz9zAhosYHrbZfpADwJhd3v6TNl9DbvTtUS_deOcoNCodgvTqq3kxcflw",
playbackQuality: "small",
playerWidth: 900,
playerHeight: 506,
dimension: 0,
history: [],
historyPos: -1,
playlist: [],
playlistLength: 0,
index: -1,
mode: "order",
autostart: false,
loadPlaylist: function(playlist){
	if (playlist.length > 0) {
		var index = (aC.mode == "order") ? 0 : getRandomInt(0,aC.playlistLength);
		$(".player .album-art-container").setData({index:index}).find(".art").attr('src',playlist[index].img);
		$(".player .meta .titles").find(".track-name").text((index+1)+'. '+playlist[index].track).setData({index:index}).end().find(".artist-name").text(playlist[index].artist);
		if (aC.autostart === true) triggerPlayPause(index);
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
niceDuration: function(a){
	var b = a / 60, a = Math.floor(b), b = Math.round(60 * (b - a));
	60 == b && (a++, b = 0);
	return 10 > b ? a + ":0" + b : a + ":" + b;
},
setDimensions: function(){
	var w = $(window), height = w.height(), width = w.width(), rchrome = /chrome/;
	aC.dimension = height - $(".player").outerHeight() - 1;
	$("#mainContainer,.jspContainer,.jspPane,.jspTrack").height(aC.dimension).add(".player").width(aC.dimension);
	if (aC.dimension < width) {
		$("#widgetContainer").css("left",(w.width() - $("#widgetContainer").outerWidth()) / 2);
		$(".player .meta .progress-bar-container").width(aC.dimension - 123);
		$(".player .meta .progress-bar-container .controls .buffer").width(aC.dimension - 171);
		$(".ti").width(aC.dimension - 31); /* not updating */
	} else { // bigger
		//$("").width(width);
	}
	if ((rchrome.test(navigator.userAgent.toLowerCase()))) aC.showNotification("This website works best while using Google Chrome. Wise up!");
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
},
triggerPlayPause: function(a){
	var player = $(".player");
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
		if (arguments[1] === "undefined") {
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
		yt.loadAndPlayVideo(aC.playlist[a].id);
		aC.handleTrack();
	}
},
goNextVideo: function(){
	var index = (aC.mode == "order") ? (aC.index+1) : getRandomInt(0,aC.playlistLength);
	while (index == aC.index) index = getRandomInt(0,aC.playlistLength);
	aC.historyPos = aC.history.length-1;
	aC.triggerPlayPause(index);
},
onKeyDown: function(e){
	var keyCode = e.keyCode || e.which;
	switch (keyCode) {
		case keys.PLAY:
		case keys.SPACE:
		case keys.ENTER:
		case keys.ENTER_OLD:
		case keys.NUMPAD_ENTER_OLD:
		case keys.PAUSE:
		case keys.PAUSE_OLD:
			aC.triggerPlayPause(aC.index);
		break;
		case keys.NEXT:
			aC.goNextVideo();
		break;
		case keys.PREV:
			if (aC.history.length > 1) aC.triggerPlayPause(aC.history[aC.historyPos],true);
		break;
	}
}
};
})();

$(document).ready(function(){
	aC.setDimensions();
	aC.checkPlaylist();
	$("#notifBar .notifCloseButton").live('click',function(){
		aC.hideNotification();
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
		// scroll to this in list.
	});
	$(".player .meta .list").live('click',function(){
		if (aC.playbackQuality == "small") aC.playbackQuality = "hd720";
		else aC.playbackQuality = "small";
		$("body").toggleClass("engage");
		$("#vD").toggleClass("hidden");
	});
	$(".player .album-art-container").live('click',function(){
		aC.triggerPlayPause($(this).data('index'));
	});
	$("#content").on('click','.i',function(){
		aC.triggerPlayPause($(this).index());
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
	$("#vD").center().addClass('hidden').css('visibility','visible');
}

function onPlayerStateChange(a){
	if (a == yt.ps.ended) aC.goNextVideo();
}

function onPlayerError(a){
	aC.goNextVideo();
	console.log('Error! oPE Type: '+a);
}

yt={
	ps: {
		unstarted: -1,
		ended: 0,
		playing: 1,
		paused: 2,
		buffering: 3,
		cued: 5
	},
	size: {
		small: {h:240,w:320},
		medium: {h:360,w:640},
		large: {h:480,w:853},
		hd720: {h:720,w:1280},
		hd1080: {h:1080,w:1920}
	},
	setQuality: function(a){if (ytplayer) ytplayer.setPlaybackQuality(a)},
	loadAndPlayVideo: function(a){if (ytplayer) ytplayer.loadVideoById(a,aC.playbackQuality)},
	loadVideo: function(a){if (ytplayer) ytplayer.cueVideoById(a,aC.playbackQuality)},
	playVideo: function(){if (ytplayer) ytplayer.playVideo()},
	pauseVideo: function(){if (ytplayer) ytplayer.pauseVideo()},
	stopVideo: function(){if (ytplayer) ytplayer.stopVideo()},
	setVolume: function(v){if (ytplayer) ytplayer.setVolume(v)},
	getDuration: function(){if (ytplayer) return ytplayer.getDuration()},
	getCurrentTime: function(){if (ytplayer) return ytplayer.getCurrentTime()},
	setSize: function(w,h){if (ytplayer) return ytplayer.setSize(w,h)},
	seekTo: function(s){if (ytplayer) return ytplayer.seekTo(s,false)}
};

tfObjSort={
	init:function(){
		Array.prototype.objSort=function(){
			tfObjSort.setThings(this);
			var a=arguments;
			var x=tfObjSort;
			x.a=[];x.d=[];
			for(var i=0;i<a.length;i++){
				if(typeof a[i]=="string"){x.a.push(a[i]);x.d.push(1)};
				if(a[i]===-1){x.d[x.d.length-1]=-1}
			}
			return this.sort(tfObjSort.sorter);
		};
		Array.prototype.strSort=function(){
			tfObjSort.setThings(this);
			return this.sort(tfObjSort.charSorter)
		}
	},
	sorter:function(x,y){
		var a=tfObjSort.a
		var d=tfObjSort.d
		var r=0
		for(var i=0;i<a.length;i++){
			if(typeof x+typeof y!="objectobject"){return typeof x=="object"?-1:1};
			var m=x[a[i]]; var n=y[a[i]];
			var t=typeof m+typeof n;
			if(t=="booleanboolean"){m*=-1;n*=-1}
			else if(t.split("string").join("").split("number").join("")!=""){continue};
			r=m-n;
			if(isNaN(r)){r=tfObjSort.charSorter(m,n)};
			if(r!=0){return r*d[i]}
		}
		return r
	},
	charSorter:function(x,y){
		if(tfObjSort.ignoreCase){x=x.toLowerCase();y=y.toLowerCase()};
		var s=tfObjSort.chars;
		if(!s){return x>y?1:x<y?-1:0};
		x=x.split("");y=y.split("");l=x.length>y.length?y.length:x.length;
		var p=0;
		for(var i=0;i<l;i++){
			p=s.indexOf(x[i])-s.indexOf(y[i]);
			if(p!=0){break};
		};
		if(p==0){p=x.length-y.length};
		return p
	},
	setThings:function(x){
		this.ignoreCase=x.sortIgnoreCase;
		var s=x.sortCharOrder;
		if(!s){this.chars=false;return true};
		if(!s.sort){s=s.split(",")};
		var a="";
		for(var i=1;i<1024;i++){a+=String.fromCharCode(i)};
		for(var i=0;i<s.length;i++){
			z=s[i].split("");
			var m=z[0]; var n=z[1]; var o="";
			if(z[2]=="_"){o=n+m} else {o=m+n};
			a=a.split(m).join("").split(n).join(o);
		};
		this.chars=a
	}
};
tfObjSort.init();