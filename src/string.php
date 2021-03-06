<?php
$f = file("playlist.txt"); $l = (count($f) - 1); $textarea = false; $capitalize = false; $writetofile = false; $clean = true;
if ($textarea) {
echo '<script type="text/javascript">function selectAll(){document.dform.output.focus();document.dform.output.select()}</script>';
echo '<body onload="selectAll();"><form name="dform"><textarea name="output" style="height:98%;width:100%">';
}

function clean($s){
	$s = str_replace('�', '-', $s);
	$s = str_replace(array("�","�","�","�","�","�","�"), 'a', $s);
	$s = str_replace(array("�","�","�","�"), 'e', $s);
	$s = str_replace(array("�","�","�","�"), 'i', $s);
	$s = str_replace(array("�","�","�","�","�","�"), 'o', $s);
	$s = str_replace(array("�","�","�","�"), 'u', $s);
	$s = str_replace(array("�","�","�","�","�","�"), 'A', $s);
	$s = str_replace(array("�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","\"","�","�","�"), array("y","n","c","C","B","Z","Y","E","E","I"," Degrees"," Degrees"," x ","!","'","-","-","'","1/2","2","-"), $s);
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
$echo = "var APP = ".$data.";";
} else $echo = "var APP = ".file_get_contents("playlist.json").";";
?>
<!DOCTYPE html>
<html lang="en" dir="ltr"><head><meta charset="utf-8">
<title>Create Playlist JSON</title>
<script src="http://code.jquery.com/jquery.min.js"></script>
<script><?php echo $echo; ?></script>
</head>
<body>
<script>
var all = true, run = -1, steps = 200, dlen = APP.data.length-1, reps = 18;
run = (100 * reps) - 1; var run2 = run+steps+1;
if (all === true) var end = dlen; else end = run2;

function init(){
	setTimeout(function(){
		if (run < end) {
			v = APP.data[++run];
			if ($.trim(v.artist + " " + v.track) == '') {
				console.log('Error! Bad Artist or Track Name');
				APP.data[run].id = 0;
				return init();
			}
			doInstantSearch($.trim(v.artist+ " " + v.track));
		} else {
			$("body").css({'margin':0,'overflow':'hidden'}).append('<textarea id="output"></textarea>').find("#output").height($(window).height()).width($(window).width()).val('{"data":'+JSON.stringify(APP.data)+'}').focus().select();
		}
	}, 3500);
}

function doInstantSearch(search){
	$.ajax({
		type: "GET",
		url: 'http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&jsonp=window.yt&q='+encodeURIComponent(search)+'&cp=1',
		dataType: "script",
		timeout: 3500,
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
		timeout: 3500,
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