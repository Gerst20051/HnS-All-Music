<?php
header("Pragma: no-cache");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
$f = file('playlist.txt'); $l = count($f)-1; $writetofile = true; $clean = true; $newplaylist = false;

/*********************************/
/***** List of Manual Edits *******/
/*********************************/
/* Forever The Sickest Kids - Whoa Oh! (Me vs Everyone)
/*** {"id":"hbD6480kBYE","artist":"Forever The Sickest Kids","track":"Whoa Oh! (Me vs Everyone) feat. Selena Gomez","img":"http://i.ytimg.com/vi/hbD6480kBYE/default.jpg","duration":211}
/* Mike Posner - Bow Chicka Wow Wow ft. Lil Wayne feat. Lil Wayne
/*** Mike Posner - Bow Chicka Wow Wow feat. Lil Wayne
/* Busta Rhymes & Mariah Carey (- I Know What You Want(feat. Flipmode Squad)
/*** {"id":"6-126gvOxKw","artist":"Busta Rhymes & Mariah Carey","track":"I Know What You Want (feat. Flipmode Squad)","img":"http://i.ytimg.com/vi/6-126gvOxKw/default.jpg","duration":261}
/* {"id":"","artist":"Reel 2 Real","track":null,"img":"","duration":0}
/*** {"id":"M1S6Xw_xLUg","artist":"Reel 2 Real","track":"I Like to Move It - Erick \"More\" Club Mix","img":"http://i.ytimg.com/vi/tX6h_hWnI60/default.jpg","duration":231}
/* {"id":"TEiBDI220HY","artist":"The Bellamy Brothers","track":null,"img":"http://i.ytimg.com/vi/TEiBDI220HY/default.jpg","duration":338}
/*** {"id":"TEiBDI220HY","artist":"The Bellamy Brothers","track":"If I Said You Had A Beautiful Body (Would You Hold It Against Me)","img":"http://i.ytimg.com/vi/TEiBDI220HY/default.jpg","duration":338}
/*********************************/

if ($newplaylist === true) {
function clean($s){
	$s = preg_replace('/\s[\s]+/', ' ', $s);
	$s = str_replace(array("à","á","â","ã","å","ä","æ"), 'a', $s);
	$s = str_replace(array("è","é","ê","ë"), 'e', $s);
	$s = str_replace(array("ì","í","î","ï"), 'i', $s);
	$s = str_replace(array("ò","ó","ô","õ","ö","ø"), 'o', $s);
	$s = str_replace(array("ù","ú","û","ü"), 'u', $s);
	$s = str_replace(array("À","Á","Â","Ã","Ä","Å"), 'A', $s);
	$s = str_replace(array("ÿ","ý","ñ","ç","Ç","ß","Ž","¥","É","Ë","Í","°","º","×","¡","’","´","–","–","—","½","²","·"), array("y","y","n","c","C","B","Z","Y","E","E","I"," Degrees"," Degrees"," x ","!","'","'","-","-","-","1/2","2","."), $s);
	$s = str_replace(array("(-","( "," )","()"), array("(","(",")",""), $s);
	$s = str_replace(array("Featuring","featuring","Feat.","Feat","feat","feat.."), 'feat.', $s);
	return $s;
}

$playlist = array('data'=>array());
for ($k = 0; $k <= $l; $k++) {
	if ($clean) $s = clean($f[$k]);
	else $s = $f[$k];
	$s = explode(' - ',$s);
	$artist = array_shift($s);
	$track = trim(implode(' - ',$s));
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
if ($writetofile === true) {
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
var all = true, run = -1, steps = 200, dlen = APP.data.length-1, reps = 0, run = (100*reps)-1;
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
		} else if (v.id == "") {
			var search = $.trim(v.artist+ " " + v.track).replace('Remastered','').replace('Re-Recorded','').replace('Album Version','').replace('LP Version','').replace('Version','');
			doInstantSearch($.trim(search));
		} else init(true);
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