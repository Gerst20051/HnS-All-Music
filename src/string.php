<?php
$f = file("playlist.txt"); $l = (count($f) - 1); $textarea = false; $capitalize = false; $writetofile = false; $clean = true;
if ($textarea) {
echo '<script type="text/javascript">function selectAll(){document.dform.demo.focus();document.dform.demo.select()}</script>';
echo '<body onload="selectAll();"><form name="dform"><textarea name="demo" style="height:98%;width:100%">';
}

function clean($s){
	$s = str_replace('–', '-', $s);
	$s = str_replace(array("à","á","â","ã","å","ä","æ"), 'a', $s);
	$s = str_replace(array("è","é","ê","ë"), 'e', $s);
	$s = str_replace(array("ì","í","î","ï"), 'i', $s);
	$s = str_replace(array("ò","ó","ô","õ","ö","ø"), 'o', $s);
	$s = str_replace(array("ù","ú","û","ü"), 'u', $s);
	$s = str_replace(array("À","Á","Â","Ã","Ä","Å"), 'A', $s);
	$s = str_replace(array("ÿ","ñ","ç","Ç","ß","Ž","¥","É","Ë","Í","°","º","×","¡","’","–","—","\"","½","²","·"), array("y","n","c","C","B","Z","Y","E","E","I"," Degrees"," Degrees"," x ","!","'","-","-","'","1/2","2","-"), $s);
	return $s;
}

$data = "{\"data\":[\n";
for ($k = 0; $k <= $l; $k++) {
	if ($clean) $s = clean($f[$k]);
	else $s = $f[$k];
	$s = explode(' - ', $s);-
	$artist = array_shift($s);
	$track = trim(implode(" - ", $s));
	$data .= "\t{\"id\":\"\",\"artist\":\"".$artist."\",\"track\":\"".$track."\",\"img\":\"\",\"duration\":0}";
	if ($k !== $l) $data .= ",\n"; else $data .= "\n";
}
$data .= "]}";

if ($textarea){echo "</textarea></form></body>";}
if ($writetofile){
$f="playlist.json";
if (is_writable($f)) {
	if (!$handle = fopen($f, 'w')) {
		 echo "Cannot open file ($f)";
		 exit;
	}
	if (fwrite($handle, $data) === false) {
		echo "Cannot write to file ($f)";
		exit;
	}
	echo "Success, wrote data to file ($f)";
	fclose($handle);
} else echo "The file $f is not writable";
}
?>

<!DOCTYPE html>
<html lang="en" dir="ltr"><head><meta charset="utf-8">
<title>Create Playlist JSON</title>
<script>(function(){var s=["https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js","https://raw.github.com/kvz/phpjs/master/functions/json/json_encode.js"];
var sc="script",ce="createElement",sa="setAttribute",d=document,tn="getElementsByTagName",ua=window.navigator.userAgent,agent=false;if(ua.indexOf("Firefox")!==-1||ua.indexOf("Opera")!==-1)agent=true;
for(var i=0,l=s.length;i<l;++i){if(agent){var t=d[ce](sc);t[sa]("src",s[i]);d[tn]("head")[0].appendChild(t);}else{d.write("<"+sc+" src=\""+s[i]+"\"></"+sc+">");}}
})();
<?php echo "var JSON = ".$data.";"; ?>
</script>
</head>
<body>
<script>
function doInstantSearch(){
	if (xhrWorking){
		pendingSearch = true;
		return;
	}
	var c = $("input[type='text']#sB");
	if ($.trim(c.val()) == currentSearch) return;
	currentSearch = $.trim(c.val());
	if (currentSearch == ''){
		cleanInterface();
		return;
	}
	c.attr('class', 'sL');
	var d = 'http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&jsonp=window.yt.www.suggest.handleResponse&q=' + encodeURIComponent(currentSearch) + '&cp=1';
	xhrWorking = true;
	$.ajax({
		type: "GET",
		url: d,
		dataType: "script",
		timeout: 2000,
		error: function(a, b){
			addAlert('<b class="error">Error!</b> dIS Type: ' + b, 5000, 2000);
			doneWorking();
		}
	});
}

yt = {}, yt.www = {}, yt.www.suggest = {};
yt.www.suggest.handleResponse = function(a){
	if (!dC.exactSearch){
		if (a[1][0]) var suggest = a[1][0][0];
		else var suggest = null;
		var l = 1;
	} else var suggest = null, l = 0;
	instantHash(currentSearch);
	if (dC.exactSearch || !suggest){
		suggest = currentSearch;
		updateSuggestedKeyword(suggest + ' (Exact search)');
	} else updateSuggestedKeyword(suggest);
	var c = ['<ul id="suggest">'], cs = currentSearch.toLowerCase().replace(/[^a-z0-9]/g, " ");
	var d = cs.indexOf("  ");
	while (d != -1){
		cs = cs.replace("  ", " ");
		d = cs.indexOf("  ");
	}
	for (var i = l; i < a[1].length; i++){
		if (a[1][i][0] != cs){
			c.push("<li content=\"" + a[1][i][0] + "\">" + a[1][i][0].replace(cs, "<b>" + cs + "</b>") + "</li>");
		}
	}
	c.push('</ul>');
	$("div#sug").html(c.join(''));
	if (!dC.exactSearch){
		if (suggest == currentSuggestion){
			doneWorking();
			return;
		} else currentSuggestion = suggest;
	}
	getTopSearchResult(suggest);
};

function getTopSearchResult(e){
	var f = 'http://gdata.youtube.com/feeds/api/videos?q=' + encodeURIComponent(e) + '&format=5&max-results=' + dC.vThumbs + '&v=2&alt=jsonc';
	$.ajax({
		type: "GET",
		url: f,
		dataType: "jsonp",
		timeout: 2000,
		success: function(a, b, c){
			if (a.data.items){
				var d = a.data.items;
				playlistArr = [];
				playlistArr.push(d);
				updateVideoDisplay(d);
				pendingDoneWorking = true;
			} else {
				updateSuggestedKeyword('No results for "' + e + '"');
				doneWorking();
			}
		},
		error: function(a, b){
			addAlert('<b class="error">Error!</b> gTSR Type: ' + b, 5000, 2000);
			doneWorking();
		}
	});
}

function updateVideoDisplay(b){
	var c = (b.length >= dC.vThumbs) ? dC.vThumbs : b.length;
	var d = $("<div />").attr('id', 'pl');
	for (var i = 0; i < c; i++){
		var e = b[i].id, vTitle = b[i].title;
		var f = $("<div />").attr('class', 'vW').attr('id', e);
		var a = $("<div />");
		var g = $("<div />").attr('class', 'overlay');
		var h = $("<img />").attr('class', 'thumb').attr('src', b[i].thumbnail.sqDefault);
		var j = $("<div />").attr('class', 'title').html(vTitle);
		var k = $("<div />").attr('class', 'play-symbol');
		var l = $("<img />").attr('src', 'i/overlay-play.png').attr('title', b[i].description);
		var m = $("<div />").attr('class', 'thumb-info');
		var n = new Date(b[i].uploaded);
		var o = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
		var p = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		var q = o[n.getDay()] + ", " + p[n.getMonth()] + " " + n.getDate() + ", " + n.getFullYear();
		var r = $("<time />").attr('class', 'date').html(q);
		var s = $("<p />").attr('class', 'time').html(gettime(b[i].duration));
		var t = $("<img />").attr('class', 'addvideo').attr('src', 'i/add.png').attr('title', 'Add To Queue').attr('content', vTitle);
		var u = $("<img />").attr('class', 'viewvideo').attr('src', 'i/view.png').attr('title', 'Load Related Videos').attr('content', vTitle);
		var y = $("<span />").attr('class', 'vT');
		var z = $("<span />").attr('class', 'viewCount').html(b[i].viewCount).digits();
		if (dC.thumbHeight != 99){
			f.height(dC.thumbHeight);
			g.height(dC.thumbHeight);
			h.height(dC.thumbHeight);
			j.height(dC.thumbHeight - 5);
		}
		d.append(f.html(a.append(m.append(r).append(s)).append(g).append(h).append(j)).append(k.html(l)).append(y.append(z).append(t).append(u)));
	}
	$("div#pW").find("div#pl").remove().end().append(d);
	currentPlaylistPos = -1;
	doneWorking();
}

$(document).ready(doInstantSearch);
</script>
</body>
</html>