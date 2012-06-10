<?php
$f = file('playlist.txt'); $l = (count($f) - 1); $writetofile = true; $clean = true; $newplaylist = false;

/*********************************/
/***** List of Manual Edits  *******/
/*********************************/
/* Forever The Sickest Kids - Whoa Oh! (Me vs Everyone)
/*** Forever The Sickest Kids - Whoa Oh! (Me vs Everyone) feat. Selena Gomez
/* 
/*********************************/

if ($newplaylist === true) {
function clean($s){
	$s = preg_replace('/\s[\s]+/',' ',$s);
	$s = str_replace(array("à","á","â","ã","å","ä","æ"), 'a', $s);
	$s = str_replace(array("è","é","ê","ë"), 'e', $s);
	$s = str_replace(array("ì","í","î","ï"), 'i', $s);
	$s = str_replace(array("ò","ó","ô","õ","ö","ø"), 'o', $s);
	$s = str_replace(array("ù","ú","û","ü"), 'u', $s);
	$s = str_replace(array("À","Á","Â","Ã","Ä","Å"), 'A', $s);
	$s = str_replace(array("ÿ","ý","ñ","ç","Ç","ß","Ž","¥","É","Ë","Í","°","º","×","¡","’","´","–","–","—","\"","½","²","·"), array("y","y","n","c","C","B","Z","Y","E","E","I"," Degrees"," Degrees"," x ","!","'","'","-","-","-","'","1/2","2","."), $s);
	$s = str_replace(array("(-","( "," )","()"), array("(","(",")",""), $s);
	$s = str_replace(array("Featuring","featuring","Feat.","Feat","feat","feat.."), 'feat.', $s);
	return $s;
}

$playlist = array('data'=>array());
for ($k = 0; $k <= $l; $k++) {
	if ($clean) $s = clean($f[$k]);
	else $s = $f[$k];
	$s = explode(' - ', $s);
	$artist = array_shift($s);
	$track = trim(implode(" - ", $s));
	$item = array('id'=>'','artist'=>$artist,'track'=>$track,'img'=>'','duration'=>0);
	array_push($playlist['data'],$item);
}

$oldjson =  json_decode(file_get_contents('playlist.json'),true);
$oldjson = $oldjson['data'];
$newjson = $playlist['data'];
foreach($oldjson as $oldkey=>$olditem) {
	foreach($newjson as $newkey=>$newitem) {
		if ($olditem['artist'] == $newitem['artist'] && $olditem['track'] == $newitem['track']) {
			$newjson[$newkey] = $oldjson[$oldkey];
			break;
		}
	}
}
$playlist['data'] = $newjson;

$data = json_encode($playlist);
if ($writetofile){
$f="newplaylist.json";
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
} else {
?>
<!DOCTYPE html>
<html lang="en" dir="ltr"><head><meta charset="utf-8">
<title>Merge Playlist JSON</title>
<script src="http://code.jquery.com/jquery.min.js"></script>
<script><?php echo "var APP = ".file_get_contents("newplaylist.json").";"; ?></script>
</head>
<body>
<div id="count"></div>
<script>
var all = true, run = -1, steps = 200, dlen = APP.data.length-1, reps = 0, run = (100 * reps) - 1;
if (all === true) var end = dlen; else end = run+steps+1;

function init(){
	if (arguments.length === 1) action();
	else setTimeout(action, 3000);
}

function action(){
	if (run < end) {
		v = APP.data[++run];
		$("#count").text(run+" out of "+end);
		if ($.trim(v.artist + " " + v.track) == '') {
			console.log('Error! Bad Artist or Track Name');
			APP.data[run].id = 0;
			return init();
		} else if (v.id == "") doInstantSearch($.trim(v.artist+ " " + v.track));
		else init(true);
	} else {
		$("body").css({'margin':0,'overflow':'hidden'}).append('<textarea id="output"></textarea>').find("#output").height($(window).height()).width($(window).width()).val('{"data":'+JSON.stringify(APP.data)+'}').focus().select();
	}
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
<?php } ?>