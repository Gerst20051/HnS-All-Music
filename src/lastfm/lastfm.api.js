function LastFM(options){
	var apiKey    = options.apiKey    || '';
	var apiSecret = options.apiSecret || '';
	var apiUrl    = options.apiUrl    || 'http://ws.audioscrobbler.com/2.0/';
	var cache     = options.cache     || undefined;

	this.setApiKey = function(_apiKey){
		apiKey = _apiKey;
	};

	this.setApiSecret = function(_apiSecret){
		apiSecret = _apiSecret;
	};

	this.setApiUrl = function(_apiUrl){
		apiUrl = _apiUrl;
	};

	this.setCache = function(_cache){
		cache = _cache;
	};

	var internalCall = function(params, callbacks, requestMethod){
		if (requestMethod == 'POST') {
			var html   = document.getElementsByTagName('html')[0];
			var iframe = document.createElement('iframe');
			var doc;

			iframe.width        = 1;
			iframe.height       = 1;
			iframe.style.border = 'none';
			iframe.onload       = function(){
				//html.removeChild(iframe);
				if (typeof callbacks.success != 'undefined') {
					callbacks.success();
				}
			};

			html.appendChild(iframe);

			if (typeof iframe.contentWindow != 'undefined') {
				doc = iframe.contentWindow.document;
			} else if (typeof iframe.contentDocument.document != 'undefined') {
				doc = iframe.contentDocument.document.document;
			} else {
				doc = iframe.contentDocument.document;
			}

			doc.open();
			doc.clear();
			doc.write('<form method="post" action="' + apiUrl + '" id="form">');

			for (var param in params) {
				doc.write('<input type="text" name="' + param + '" value="' + params[param] + '">');
			}

			doc.write('</form>');
			doc.write('<script type="application/x-javascript">');
			doc.write('document.getElementById("form").submit();');
			doc.write('</script>');
			doc.close();
		} else {
			var jsonp = 'jsonp' + new Date().getTime();
			var hash = auth.getApiSignature(params);

			if (typeof cache != 'undefined' && cache.contains(hash) && !cache.isExpired(hash)) {
				if (typeof callbacks.success != 'undefined') {
					callbacks.success(cache.load(hash));
				}
				return;
			}

			params.callback = jsonp;
			params.format   = 'json';

			window[jsonp] = function(data){
				if (typeof cache != 'undefined') {
					var expiration = cache.getExpirationTime(params);
					if (0 < expiration) {
						cache.store(hash, data, expiration);
					}
				}

				if (typeof data.error != 'undefined') {
					if (typeof callbacks.error != 'undefined') {
						callbacks.error(data.error, data.message);
					}
				} else if (typeof callbacks.success != 'undefined') {
					callbacks.success(data);
				}

				window[jsonp] = undefined;

				try {
					delete window[jsonp];
				} catch(e) {}

				if (head) {
					head.removeChild(script);
				}
			};

			var head   = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			var array  = [];

			for (var param in params) {
				array.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));
			}

			script.src = apiUrl + '?' + array.join('&').replace(/%20/g, '+');
			head.appendChild(script);
		}
	};

	var call = function(method, params, callbacks, requestMethod){
		params         = params        || {};
		callbacks      = callbacks     || {};
		requestMethod  = requestMethod || 'GET';
		params.method  = method;
		params.api_key = apiKey;
		internalCall(params, callbacks, requestMethod);
	};

	var signedCall = function(method, params, session, callbacks, requestMethod){
		params         = params        || {};
		callbacks      = callbacks     || {};
		requestMethod  = requestMethod || 'GET';
		params.method  = method;
		params.api_key = apiKey;

		if (session && typeof session.key != 'undefined') {
			params.sk = session.key;
		}

		params.api_sig = auth.getApiSignature(params);
		internalCall(params, callbacks, requestMethod);
	};

	this.album = {
		addTags : function(params, session, callbacks){
			if (typeof params.tags == 'object') {
				params.tags = params.tags.join(',');
			}

			signedCall('album.addTags', params, session, callbacks, 'POST');
		},

		getBuylinks : function(params, callbacks){
			call('album.getBuylinks', params, callbacks);
		},

		getInfo : function(params, callbacks){
			call('album.getInfo', params, callbacks);
		},

		getTags : function(params, session, callbacks){
			signedCall('album.getTags', params, session, callbacks);
		},

		removeTag : function(params, session, callbacks){
			signedCall('album.removeTag', params, session, callbacks, 'POST');
		},

		search : function(params, callbacks){
			call('album.search', params, callbacks);
		},

		share : function(params, session, callbacks){
			if (typeof params.recipient == 'object') {
				params.recipient = params.recipient.join(',');
			}

			signedCall('album.share', params, callbacks);
		}
	};

	this.artist = {
		addTags : function(params, session, callbacks){
			if (typeof params.tags == 'object') {
				params.tags = params.tags.join(',');
			}

			signedCall('artist.addTags', params, session, callbacks, 'POST');
		},

		getCorrection : function(params, callbacks){
			call('artist.getCorrection', params, callbacks);
		},

		getEvents : function(params, callbacks){
			call('artist.getEvents', params, callbacks);
		},

		getImages : function(params, callbacks){
			call('artist.getImages', params, callbacks);
		},

		getInfo : function(params, callbacks){
			call('artist.getInfo', params, callbacks);
		},

		getPastEvents : function(params, callbacks){
			call('artist.getPastEvents', params, callbacks);
		},

		getPodcast : function(params, callbacks){
			call('artist.getPodcast', params, callbacks);
		},

		getShouts : function(params, callbacks){
			call('artist.getShouts', params, callbacks);
		},

		getSimilar : function(params, callbacks){
			call('artist.getSimilar', params, callbacks);
		},

		getTags : function(params, session, callbacks){
			signedCall('artist.getTags', params, session, callbacks);
		},

		getTopAlbums : function(params, callbacks){
			call('artist.getTopAlbums', params, callbacks);
		},

		getTopFans : function(params, callbacks){
			call('artist.getTopFans', params, callbacks);
		},

		getTopTags : function(params, callbacks){
			call('artist.getTopTags', params, callbacks);
		},

		getTopTracks : function(params, callbacks){
			call('artist.getTopTracks', params, callbacks);
		},

		removeTag : function(params, session, callbacks){
			signedCall('artist.removeTag', params, session, callbacks, 'POST');
		},

		search : function(params, callbacks){
			call('artist.search', params, callbacks);
		},

		share : function(params, session, callbacks){
			if (typeofparams.recipient == 'object') {
				params.recipient = params.recipient.join(',');
			}

			signedCall('artist.share', params, session, callbacks, 'POST');
		},

		shout : function(params, session, callbacks){
			signedCall('artist.shout', params, session, callbacks, 'POST');
		}
	};

	this.auth = {
		getMobileSession : function(params, callbacks){
			params = {
				username  : params.username,
				authToken : md5(params.username + md5(params.password))
			};

			signedCall('auth.getMobileSession', params, null, callbacks);
		},

		getSession : function(params, callbacks){
			signedCall('auth.getSession', params, null, callbacks);
		},

		getToken : function(callbacks){
			signedCall('auth.getToken', null, null, callbacks);
		},

		getWebSession : function(callbacks){
			var previuousApiUrl = apiUrl;
			apiUrl = 'http://ext.last.fm/2.0/';
			signedCall('auth.getWebSession', null, null, callbacks);
			apiUrl = previuousApiUrl;
		}
	};

	this.chart = {
		getHypedArtists : function(params, session, callbacks){
			call('chart.getHypedArtists', params, callbacks);
		},

		getHypedTracks : function(params, session, callbacks){
			call('chart.getHypedTracks', params, callbacks);
		},

		getLovedTracks : function(params, session, callbacks){
			call('chart.getLovedTracks', params, callbacks);
		},

		getTopArtists : function(params, session, callbacks){
			call('chart.getTopArtists', params, callbacks);
		},

		getTopTags : function(params, session, callbacks){
			call('chart.getTopTags', params, callbacks);
		},

		getTopTracks : function(params, session, callbacks){
			call('chart.getTopTracks', params, callbacks);
		}
	};

	this.event = {
		attend : function(params, session, callbacks){
			signedCall('event.attend', params, session, callbacks, 'POST');
		},

		getAttendees : function(params, session, callbacks){
			call('event.getAttendees', params, callbacks);
		},

		getInfo : function(params, callbacks){
			call('event.getInfo', params, callbacks);
		},

		getShouts : function(params, callbacks){
			call('event.getShouts', params, callbacks);
		},

		share : function(params, session, callbacks){
			if (typeof params.recipient == 'object') {
				params.recipient = params.recipient.join(',');
			}

			signedCall('event.share', params, session, callbacks, 'POST');
		},

		shout : function(params, session, callbacks){
			signedCall('event.shout', params, session, callbacks, 'POST');
		}
	};

	this.geo = {
		getEvents : function(params, callbacks){
			call('geo.getEvents', params, callbacks);
		},

		getMetroArtistChart : function(params, callbacks){
			call('geo.getMetroArtistChart', params, callbacks);
		},

		getMetroHypeArtistChart : function(params, callbacks){
			call('geo.getMetroHypeArtistChart', params, callbacks);
		},

		getMetroHypeTrackChart : function(params, callbacks){
			call('geo.getMetroHypeTrackChart', params, callbacks);
		},

		getMetroTrackChart : function(params, callbacks){
			call('geo.getMetroTrackChart', params, callbacks);
		},

		getMetroUniqueArtistChart : function(params, callbacks){
			call('geo.getMetroUniqueArtistChart', params, callbacks);
		},

		getMetroUniqueTrackChart : function(params, callbacks){
			call('geo.getMetroUniqueTrackChart', params, callbacks);
		},

		getMetroWeeklyChartlist : function(params, callbacks){
			call('geo.getMetroWeeklyChartlist', params, callbacks);
		},

		getMetros : function(params, callbacks){
			call('geo.getMetros', params, callbacks);
		},

		getTopArtists : function(params, callbacks){
			call('geo.getTopArtists', params, callbacks);
		},

		getTopTracks : function(params, callbacks){
			call('geo.getTopTracks', params, callbacks);
		}
	};

	this.group = {
		getHype : function(params, callbacks){
			call('group.getHype', params, callbacks);
		},

		getMembers : function(params, callbacks){
			call('group.getMembers', params, callbacks);
		},

		getWeeklyAlbumChart : function(params, callbacks){
			call('group.getWeeklyAlbumChart', params, callbacks);
		},

		getWeeklyArtistChart : function(params, callbacks){
			call('group.getWeeklyArtistChart', params, callbacks);
		},

		getWeeklyChartList : function(params, callbacks){
			call('group.getWeeklyChartList', params, callbacks);
		},

		getWeeklyTrackChart : function(params, callbacks){
			call('group.getWeeklyTrackChart', params, callbacks);
		}
	};

	this.library = {
		addAlbum : function(params, session, callbacks){
			signedCall('library.addAlbum', params, session, callbacks, 'POST');
		},

		addArtist : function(params, session, callbacks){
			signedCall('library.addArtist', params, session, callbacks, 'POST');
		},

		addTrack : function(params, session, callbacks){
			signedCall('library.addTrack', params, session, callbacks, 'POST');
		},

		getAlbums : function(params, callbacks){
			call('library.getAlbums', params, callbacks);
		},

		getArtists : function(params, callbacks){
			call('library.getArtists', params, callbacks);
		},

		getTracks : function(params, callbacks){
			call('library.getTracks', params, callbacks);
		}
	};

	this.playlist = {
		addTrack : function(params, session, callbacks){
			signedCall('playlist.addTrack', params, session, callbacks, 'POST');
		},

		create : function(params, session, callbacks){
			signedCall('playlist.create', params, session, callbacks, 'POST');
		},

		fetch : function(params, callbacks){
			call('playlist.fetch', params, callbacks);
		}
	};

	this.radio = {
		getPlaylist : function(params, session, callbacks){
			signedCall('radio.getPlaylist', params, session, callbacks);
		},

		search : function(params, session, callbacks){
			signedCall('radio.search', params, session, callbacks);
		},

		tune : function(params, session, callbacks){
			signedCall('radio.tune', params, session, callbacks);
		}
	};

	this.tag = {
		getInfo : function(params, callbacks){
			call('tag.getInfo', params, callbacks);
		},

		getSimilar : function(params, callbacks){
			call('tag.getSimilar', params, callbacks);
		},

		getTopAlbums : function(params, callbacks){
			call('tag.getTopAlbums', params, callbacks);
		},

		getTopArtists : function(params, callbacks){
			call('tag.getTopArtists', params, callbacks);
		},

		getTopTags : function(callbacks){
			call('tag.getTopTags', null, callbacks);
		},

		getTopTracks : function(params, callbacks){
			call('tag.getTopTracks', params, callbacks);
		},

		getWeeklyArtistChart : function(params, callbacks){
			call('tag.getWeeklyArtistChart', params, callbacks);
		},

		getWeeklyChartList : function(params, callbacks){
			call('tag.getWeeklyChartList', params, callbacks);
		},

		search : function(params, callbacks){
			call('tag.search', params, callbacks);
		}
	};

	this.tasteometer = {
		compare : function(params, callbacks){
			call('tasteometer.compare', params, callbacks);
		},

		compareGroup : function(params, callbacks){
			call('tasteometer.compareGroup', params, callbacks);
		}
	};

	this.track = {
		addTags : function(params, session, callbacks){
			signedCall('track.addTags', params, session, callbacks, 'POST');
		},

		ban : function(params, session, callbacks){
			signedCall('track.ban', params, session, callbacks, 'POST');
		},

		getBuylinks : function(params, callbacks){
			call('track.getBuylinks', params, callbacks);
		},

		getCorrection : function(params, callbacks){
			call('track.getCorrection', params, callbacks);
		},

		getFingerprintMetadata : function(params, callbacks){
			call('track.getFingerprintMetadata', params, callbacks);
		},

		getInfo : function(params, callbacks){
			call('track.getInfo', params, callbacks);
		},

		getShouts : function(params, callbacks){
			call('track.getShouts', params, callbacks);
		},

		getSimilar : function(params, callbacks){
			call('track.getSimilar', params, callbacks);
		},

		getTags : function(params, session, callbacks){
			signedCall('track.getTags', params, session, callbacks);
		},

		getTopFans : function(params, callbacks){
			call('track.getTopFans', params, callbacks);
		},

		getTopTags : function(params, callbacks){
			call('track.getTopTags', params, callbacks);
		},

		love : function(params, session, callbacks){
			signedCall('track.love', params, session, callbacks, 'POST');
		},

		removeTag : function(params, session, callbacks){
			signedCall('track.removeTag', params, session, callbacks, 'POST');
		},

		scrobble : function(params, session, callbacks){
			if (params.constructor.toString().indexOf("Array") != -1) {
				var p = {};
				for (i in params) {
					for (j in params[i]) {
						p[j+'['+i+']'] = params[i][j];
					}
				}
				params = p;
			}

			signedCall('track.scrobble', params, session, callbacks, 'POST');
		},

		search : function(params, callbacks){
			call('track.search', params, callbacks);
		},

		share : function(params, session, callbacks){
			if (typeof params.recipient  == 'object') {
				params.recipient = params.recipient.join(',');
			}

			signedCall('track.share', params, session, callbacks, 'POST');
		},

		unban : function(params, session, callbacks){
			signedCall('track.unban', params, session, callbacks, 'POST');
		},

		unlove : function(params, session, callbacks){
			signedCall('track.unlove', params, session, callbacks, 'POST');
		},

		updateNowPlaying : function(params, session, callbacks){
			signedCall('track.updateNowPlaying', params, session, callbacks, 'POST');
		}
	};

	this.user = {
		getArtistTracks : function(params, callbacks){
			call('user.getArtistTracks', params, callbacks);
		},

		getBannedTracks : function(params, callbacks){
			call('user.getBannedTracks', params, callbacks);
		},

		getEvents : function(params, callbacks){
			call('user.getEvents', params, callbacks);
		},

		getFriends : function(params, callbacks){
			call('user.getFriends', params, callbacks);
		},

		getInfo : function(params, callbacks){
			call('user.getInfo', params, callbacks);
		},

		getLovedTracks : function(params, callbacks){
			call('user.getLovedTracks', params, callbacks);
		},

		getNeighbours : function(params, callbacks){
			call('user.getNeighbours', params, callbacks);
		},

		getNewReleases : function(params, callbacks){
			call('user.getNewReleases', params, callbacks);
		},

		getPastEvents : function(params, callbacks){
			call('user.getPastEvents', params, callbacks);
		},

		getPersonalTracks : function(params, callbacks){
			call('user.getPersonalTracks', params, callbacks);
		},

		getPlaylists : function(params, callbacks){
			call('user.getPlaylists', params, callbacks);
		},

		getRecentStations : function(params, session, callbacks){
			signedCall('user.getRecentStations', params, session, callbacks);
		},

		getRecentTracks : function(params, callbacks){
			call('user.getRecentTracks', params, callbacks);
		},

		getRecommendedArtists : function(params, session, callbacks){
			signedCall('user.getRecommendedArtists', params, session, callbacks);
		},

		getRecommendedEvents : function(params, session, callbacks){
			signedCall('user.getRecommendedEvents', params, session, callbacks);
		},

		getShouts : function(params, callbacks){
			call('user.getShouts', params, callbacks);
		},

		getTopAlbums : function(params, callbacks){
			call('user.getTopAlbums', params, callbacks);
		},

		getTopArtists : function(params, callbacks){
			call('user.getTopArtists', params, callbacks);
		},

		getTopTags : function(params, callbacks){
			call('user.getTopTags', params, callbacks);
		},

		getTopTracks : function(params, callbacks){
			call('user.getTopTracks', params, callbacks);
		},

		getWeeklyAlbumChart : function(params, callbacks){
			call('user.getWeeklyAlbumChart', params, callbacks);
		},

		getWeeklyArtistChart : function(params, callbacks){
			call('user.getWeeklyArtistChart', params, callbacks);
		},

		getWeeklyChartList : function(params, callbacks){
			call('user.getWeeklyChartList', params, callbacks);
		},

		getWeeklyTrackChart : function(params, callbacks){
			call('user.getWeeklyTrackChart', params, callbacks);
		},

		shout : function(params, session, callbacks){
			signedCall('user.shout', params, session, callbacks, 'POST');
		}
	};

	this.venue = {
		getEvents : function(params, callbacks){
			call('venue.getEvents', params, callbacks);
		},

		getPastEvents : function(params, callbacks){
			call('venue.getPastEvents', params, callbacks);
		},

		search : function(params, callbacks){
			call('venue.search', params, callbacks);
		}
	};

	var auth = {
		getApiSignature: function(params){
			var keys = [];
			var string = '';

			for (var key in params) {
				if (params.hasOwnProperty(key)) {
					keys.push(key);
				}
			}

			keys.sort();

			for (var index in keys) {
				if (keys.hasOwnProperty(index)) {
					var key = keys[index];
					string += key + params[key];
				}
			}

			string += apiSecret;

			return md5(string);
		}
	};
}

