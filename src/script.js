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

(function(){
aC = {
playlist: [],
setData: function(obj){
	for (key in json){
		$('body').data(key, json[key])
	}
},
loadPlaylist: function(){
	if (aC.playlist.length > 0) {
		var list = [];
		$.each(aC.playlist, function(i,v){
			if (typeof v == "object") {
				var html = $("<div/>").attr('class','ppbtn'),
					itemlist = $("<ul/>").attr('class','track-info'),
					item = $('<li class="duration">'+aC.niceDuration(v.duration)+'</li><li class="track-title">'+v.track+'</li><li class="artist">'+v.artist+'</li>');
				list.push($("<li/>").attr('class','music-paused item playlist').setData(v).html(html).append(itemlist.append(item))[0]);
			} else {
				var name = v.split(" - ");
				var html = $("<ul/>").attr('class','ppbtn'),
					itemlist = $("<ul/>").attr('class','track-info'),
					item = $('<li class="duration"></li><li class="track-title">'+name[0]+'</li><li class="artist">'+name[1]+'</li>');
				list.push($("<li/>").attr('class','music-paused item playlist').html(html).append(itemlist.append(item))[0]);
			}
		});
		$(".player .album-art .art").attr('src',aC.playlist[0].img);
		$(".player .meta .titles").find(".track-name").text(aC.playlist[0].track).end().find(".artist-name").text(aC.playlist[0].artist);
		$("#content").html(list);
		$("#mainContainer").jScrollPane();
		$(".jspPane").width($(".jspContainer").width());
	} else console.log('Playlist is empty');
	/*
<li class="track-1tJkic0TURTCXw3rBhYgWu music-paused item playlist" data-id="0" data-duration="175">
	<div class="ppbtn"></div>
	<ul class="track-info">
		<li class="duration">2:56</li>
		<li class="track-title">1. What Would You Do?</li>
		<li class="artist">City High</li>
	</ul>
</li>
	*/
},
niceDuration: function(b){
	var g = b / 60,
		b = Math.floor(g),
		g = Math.round(60 * (g - b));
	60 == g && (b++, g = 0);
	return 10 > g ? b + ":0" + g : b + ":" + g;
},
getDimensions: function(){
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
	$("#notifBar #message")[0].innerHTML = a;
	$("#notifBar").animate({top: 0}, "fast");
},
hideNotificationBar: function(){
	$("#notifBar").animate({top: -80}, "fast");
}
};

$(document).ready(function(){
	aC.getDimensions();
	$.getJSON("playlist.json", function(a){
		if ($.isArray(a.data)) {
			aC.playlist = a.data;
			aC.loadPlaylist();
		} else console.log("Error loading playlist");
	});
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
	$("#content").on('click','.item',function(b){
		console.log($(this).data());
		alert("Trigger Play Pause");
	});
});
})();