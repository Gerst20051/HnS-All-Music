/* Body gets class engage when showing big album covers with slide */
/* Toggle body class engage when right bar button is clicked */
/* .music-playing and .music-paused classes get applied to .player and #engageView */
/* .music-playing is also applied to that li item in the list all others have .music-paused class */
/* How to calculate left position of #widgetContainer based on screen size? */
/* How to calculate height of #mainContainer based on screen size? Width of .player, #mainContainer, and .jspContainer is based off of this height */
/* When we set the width and height of mainContainer also set the width of .jspPane height is 11px less than #mainContainer */
/* When we set the height of #mainContainer also set the height of .jspTrack */
/* How to calculate negative top position of pane and drag? */
/* Why choose dimensions of 618px when screen dimensions are availHeight: 760px, availWidth: 1280px */
/* Available screen height = 699px Diff = 61px */
/* Player height is 78px + 2px for border (760 - 80 = 680) Diff = 62 */
/* Determine the pixel interval of change per second based off of the width of the buffer line */
/* Skip back button is hidden by default and when the first song in list is playing */
/* Slip forward button is shown by default and is hidden when the last song in list is playing. */
/* Width of meta titles changes to width of titles - (width of right buttons - 26px) on hover */

(function(){
aC = {
playlist: [],
loadPlaylist: function(){
	var list = [];
	if (aC.playlist.length == 0) console.log('Playlist is empty');
	$.each(aC.playlist, function(i,v){
		list.push($("<li/>").text(v)[0]);
	});
	$("#content").html(list);
}
};

$(document).ready(function(){
	$.getJSON("playlist.json", function(a){
		if ($.isArray(a.data)) aC.playlist = a.data;
		else console.log("Error loading playlist");
		aC.loadPlaylist();
	});
});
})();