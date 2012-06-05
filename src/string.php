<?php
$f = file("playlist.txt"); $l = (count($f) - 1); $textarea = false; $capitalize = false; $writetofile = false; $clean = true;
if ($textarea) {
echo '<script type="text/javascript">function selectAll(){document.dform.output.focus();document.dform.output.select()}</script>';
echo '<body onload="selectAll();"><form name="dform"><textarea name="output" style="height:98%;width:100%">';
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
var run = -1, steps = 100, dlen = APP.data.length-1, reps = 1;
run = (100 * reps) - 1;

function init(){
	setTimeout(function(){
		if (run < run+steps+1) {
			v = APP.data[++run];
			if ($.trim(v.artist + " " + v.track) == '') {
				console.log('Error! Bad Artist or Track Name');
				APP.data[run].id = 0;
				return init();
			}
			doInstantSearch($.trim(v.artist+ " " + v.track));
		} else {
			$("body").css({'margin':0,'overflow':'hidden'}).append('<textarea id="output"></textarea>').find("#output").height($(window).height()).width($(window).width()).val(JSON.stringify(APP.data)).focus().select();
		}
	}, 5000);
}

function doInstantSearch(search){
	$.ajax({
		type: "GET",
		url: 'http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&jsonp=window.yt&q='+encodeURIComponent(search)+'&cp=1',
		dataType: "script",
		timeout: 2000,
		error: function(a,b){
			console.log('Error! dIS Type: '+b);
			APP.data[run].id = 0;
			return init();
		}
	});
}

function yt(a){
	if (a[1][0]) var suggest = a[1][0][0]; else var suggest = a[0];
	$.ajax({
		type: "GET",
		url: 'http://gdata.youtube.com/feeds/api/videos?q='+encodeURIComponent(suggest)+'&format=5&max-results=1&v=2&alt=jsonc',
		dataType: "jsonp",
		timeout: 2000,
		success: function(b,c,d){
			if (b.data.items){
				var e = b.data.items[0];
				var thisrun = APP.data[run];
				thisrun.id = e.id;
				thisrun.img = e.thumbnail.sqDefault;
				thisrun.duration = e.duration;
				APP.data[run] = thisrun;
			} else {
				console.log('No results for '+suggest);
				APP.data[run].id = 0;
			}
			return init();
		},
		error: function(b,c){
			console.log('Error! gTSR Type: '+c);
			APP.data[run].id = 0;
			return init();
		}
	});
};

$(document).ready(init);
</script>
</body>
</html>