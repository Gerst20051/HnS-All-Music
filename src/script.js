/* Body gets class engage when showing big album covers with slide */
/* Toggle body class engage when right bar button is clicked */
/* .music-playing and .music-paused classes get applied to .player and #engageView */
/* .music-playing is also applied to that li item in the list all others have .music-paused class */

/* Determine the pixel interval of change per second based off of the width of the buffer line */
/* Skip back button is hidden by default and when the first song in list is playing */
/* Slip forward button is shown by default and is hidden when the last song in list is playing. */

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

(function(){
aC = {
devkey: "AI39si6-KJa9GUrvoNKGEh0rZWfJ2yFrPOxIN79Svnz9zAhosYHrbZfpADwJhd3v6TNl9DbvTtUS_deOcoNCodgvTqq3kxcflw",
playerWidth: 720,
playerHeight: 405,
playlist: [],
index: -1,
loadPlaylist: function(playlist){
	if (playlist.length > 0) {
		$(".player .album-art .art").attr('src',playlist[0].img).setData({index:0});
		$(".player .meta .titles").find(".track-name").text('1. '+playlist[0].track).setData({index:0}).end().find(".artist-name").text(playlist[0].artist);
		alert($(".track-name").data('index'));
		var list = [];
		$.each(playlist, function(i,v){
			if (typeof v == "object") {
				var html = $("<div/>").attr('class','ppbtn'),
					itemlist = $("<ul/>").attr('class','ti'),
					item = $('<li class="d">'+aC.niceDuration(v.duration)+'</li><li class="tt">'+(i+1)+'. '+v.track+'</li><li class="a">'+v.artist+'</li>');
				list.push($("<li/>").attr('class','off i p').setData(v).html(html).append(itemlist.append(item))[0]);
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
			if ($.isArray(aC.playlist)) aC.loadPlaylist(aC.playlist);
			else console.log("Error loading local playlist");
		}
	}
	$.getJSON("playlist.json", function(a){
		if ($.isArray(a.data)) {
			localStorage['playlist'] = JSON.stringify(a.data);
			if (!$.isArray(aC.playlist)) {
				aC.playlist = a.data;
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
	var w = $(window), height = w.height(), width = w.width();
	var dimension = height - $(".player").outerHeight() - 1;
	$("#mainContainer,.jspContainer,.jspPane,.jspTrack").height(dimension).add(".player").width(dimension);
	if (dimension < width) {
		$("#widgetContainer").css("left",(w.width() - $("#widgetContainer").outerWidth()) / 2);
		$(".player .meta .progress-bar-container").width(dimension - 123);
		$(".player .meta .progress-bar-container .controls .buffer").width(dimension - 171);
		$(".ti").width(dimension - 31); /* not updating */
	} else { // bigger
		//$("").width(width);
	}
},
showNotificationBar: function(a){
	$("#notifBar #message")[0].html(a);
	$("#notifBar").animate({top: 0}, "fast");
},
hideNotificationBar: function(){
	$("#notifBar").animate({top: -80}, "fast");
},
changePlayModeForTrack: function(b){
	var g = b.track, q = b.status;
	clickedTrack = null;
	trackId = getTrackId(g);
	seekerInterval && (clearInterval(seekerInterval), seekerInterval = null);
	durationTimer && (clearInterval(durationTimer), durationTimer = null);
	$(".music-playing").removeClass("music-playing").addClass("music-paused");
	g = $(".track-" + trackId);
	if (0 < g.length && (q && ($(".player").removeClass("music-paused").addClass("music-playing"),
	updateStatusBar(g)),
	$(".active").removeClass("active"),
	g.attr("class", q ? "track-" + trackId + " music-playing active item " + contextType : "track-" + trackId + " music-paused active item " + contextType),
	g.each(function(b, g){
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
},
changeTrack: function(a){
	seekerInterval && (clearInterval(seekerInterval), seekerInterval = null);
	durationTimer && (clearInterval(durationTimer), durationTimer = null);
	$(".on").removeClass("on").addClass("off");
	$(".player").removeClass("off").addClass("on");
		$("#engageView").removeClass("off").addClass("on");
		var s = $(".player .meta .progress-bar-container .buffer").width(),
			q = Number(aC.playlist[a].duration),
			g = Math.floor(q / s);
		$(".on .seeker").width(Math.floor(s / q * 1E3 * b.playing_position));
		seekerInterval = setInterval(function(){
			var b = $(".on .seeker").width();
			b < s && $(".on .seeker").width(b+1);
		}, g);
		var p = 1E3 * b.playing_position;
		$(".player .meta .progress-bar-container .time-spent")[0].html(readableTime(p));
		durationTimer = setInterval(function(){
			p = p + 1E3;
			$(".player .meta .progress-bar-container .time-spent")[0].html(readableTime(p));
		}, 1E3);
},
triggerPlayPause: function(a){ /* Pass Index */
	if (a == aC.index) { /* pause */
		
	} else { /* play this song */
		$(".player .meta .controls .time-spent").text("0:00");
		aC.hideNotificationBar();
		$(".player .meta .progress-bar-container .controls .buffer").width($(this).width() - 16);
		if (a > 1) $(".player .meta .progress-bar-container .controls .buffer").css('margin-left',1);
		console.log(a);
			
	}
	/*
	var clickedTrack = a;
	setTimeout(function(){
		if (clickedTrack) {
			clickedTrack.attr("class", clickedTrack.attr("class") + " loading");
			setTimeout(function(){
				clickedTrack && clickedTrack.removeClass("loading")
			}, 6E4);
		}
	}, 300);
	playPauseTrack(a.attr("data-track"), a.attr("rel"), context);
	return !1
	*/
}
};
})();

$(document).ready(function(){
	aC.setDimensions();
	aC.checkPlaylist();
	loadPlayer();
	$("#notifBar .notifCloseButton").live('click',function(){
		hideNotificationBar();
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
	$(".player .album-art-container").live('click',function(a){
		aC.triggerPlayPause($(this).data('index'));
	});
	$("#content").on('click','.i',function(a){
		aC.triggerPlayPause($(this).data('index'));
	});
});

function loadPlayer(){
	var a = {allowScriptAccess: "always"};
	var b = {id: "ytplayer"};
	swfobject.embedSWF("http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=ytplayer&key="+aC.devkey, "iVD", aC.playerWidth, aC.playerHeight, "8", null, null, a, b);
}

function onYouTubePlayerReady(a){
	ytplayer = document.getElementById("ytplayer");
	ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onError", "onPlayerError");
	$("#vD").center().addClass('hidden');
}

function onPlayerStateChange(a){
	if (a == 0) goNextVideo();
}

function onPlayerError(a){
	goNextVideo();
	console.log('Error! oPE Type: '+a);
}


function goNextVideo(){

}

function loadAndPlayVideo(a){
	if (ytplayer){
		ytplayer.loadVideoById(a[0]);
		currentVideoId = a[0];
	}
}

function loadVideo(a){if (ytplayer){ytplayer.cueVideoById(a);currentVideoId=a}}
function playVideo(){if (ytplayer) ytplayer.playVideo()}
function pauseVideo(){if (ytplayer) ytplayer.pauseVideo()}
function stopVideo(){if (ytplayer) ytplayer.stopVideo()}
function setVolume(v){if (ytplayer) ytplayer.setVolume(v)}
function getDuration(){if (ytplayer) return ytplayer.getDuration()}
function getCurrentTime(){if (ytplayer) return ytplayer.getCurrentTime()}
function setSize(w,h){if (ytplayer) return ytplayer.setSize(w,h)}
function seekTo(s){if (ytplayer) return ytplayer.seekTo(s,false)}

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