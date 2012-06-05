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

function sls(){
	return ('localStorage' in window) && window['localStorage'] !== null;
}

(function(){
aC = {
playlist: [],
loadPlaylist: function(playlist){
	if (playlist.length > 0) {
		$(".player .album-art .art").attr('src',playlist[0].img);
		$(".player .meta .titles").find(".track-name").text(playlist[0].track).end().find(".artist-name").text(playlist[0].artist);
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
		}
	}
	$.getJSON("playlist.json", function(a){
		localStorage['playlist'] = JSON.stringify(a);
		if ($.isArray(a.data)) {
			aC.playlist = a.data;
			aC.loadPlaylist(aC.playlist);
		} else console.log("Error loading playlist");
	});
},
niceDuration: function(a){
	var b = a / 60, a = Math.floor(b), b = Math.round(60 * (b - a));
	60 == b && (a++, b = 0);
	return 10 > b ? a + ":0" + b : a + ":" + b;
},
setDimensions: function(){
	/* How to calculate left position of #widgetContainer based on screen size? */
	/* How to calculate height of #mainContainer based on screen size? Width of .player, #mainContainer, and .jspContainer is based off of this height */
	/* When we set the width and height of mainContainer also set the width of .jspPane height is 11px less than #mainContainer */
	/* When we set the height of #mainContainer also set the height of .jspTrack */
	
	/* Why choose dimensions of 618px when screen dimensions are availHeight: 760px, availWidth: 1280px */
	/* Available screen height = 699px Diff = 61px */
	/* Player height is 78px + 2px for border (760 - 80 = 680) Diff = 62 */
	var height = $(window).height(), width = $(window).width();
	
},
showNotificationBar: function(a){
	$("#notifBar #message")[0].html(a);
	$("#notifBar").animate({top: 0}, "fast");
},
hideNotificationBar: function(){
	$("#notifBar").animate({top: -80}, "fast");
}
};
})();

$(document).ready(function(){
	aC.setDimensions();
	aC.checkPlaylist();
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
		alert("Trigger Play Pause");
	});
	$("#content").on('click','.i',function(b){
		console.log($(this).data());
		$(".player .meta .controls .time-spent").text("0:00");
		alert("Trigger Play Pause");
	});
});

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