$( document ).ready(function() {
	
	var playlists = [];
	var user = document.location.hash.substr(1);
	
	// what to do when we have a user in the url
	if (user) {
		console.log("Playlist requested for: " + user);
		findPlaylist(user);
	}
	
	// what to do when home page is loaded
	else {
		loadPlaylists(1); // load sheet 1, could also be latest or random
	}
    
});


// smooth scrolling animation
	$(function() {
	  $('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        document.location.hash=this.hash;
	        
	        return false;
	      }
	    }
	  });
});
		

function findPlaylist(user) {
	$.getJSON( "meta.json", function( data ) {
	file = data[user];
	loadPlaylists(file, user);
	});
}

function loadPlaylists(file, user) {
	
	$.getJSON( "people-" + file + ".json", function( data ) {
	if (user) {
		userplaylist = _.where(data, {username : user});
		otherplaylists = _.shuffle(_.reject(data, {username : user}));
		playlists = userplaylist.concat(otherplaylists);	
	}

	else {	
		playlists = _.shuffle(data); // randomly order json objects into items array
	}
	
	renderContent(playlists);
	
	});
}

function renderContent(items) {
	
		for(i = 0; i < items.length; i++) {
			
			var $wrapper = $('#wrapper'),
		    $section = $("<section class='block'/>"),
		    $inside = $("<div class='inside'/>"),
		    $offset = $("<div class='g g1 gl mobile-hide'/>"),
		    $left = $("<div class='g g2 left'/>"),
		    $right = $("<div class='g g2 centered right'/>"),
		    $spinner = $("<div class='spinner'><div class='double-bounce1'></div><div class='double-bounce2'></div></div>")
		    $imgshell = $("<div class='g g2 gl shell'/>"),
		    $img = $("<img class='avatar'/>"),
		    $username = $("<div class='username g g4'/>"),
		    $share = $("<div class='share g g6 shell'/>"),
		    $playlistUrl = "http://open.spotify.com/user/" + items[i].spotifyId + "/playlist/" + items[i].playlistId,
		    $playlistEmbed = "<iframe src='https://embed.spotify.com/?uri=spotify:user:" + items[i].spotifyId + ":playlist:" + items[i].playlistId + "' width='100%' height='380' frameborder='0' allowtransparency='true'></iframe>",
		    $user = items[i].username,
		    $sectionUrl = document.URL.replace(/#.*$/, "") + "#" + $user;
			
			// create new section
			$wrapper.append($section);
			$section.attr("id", $user);
			$section.append($inside);
			$inside.append($offset);
			$inside.append($left);
			$inside.append($right);
			$left.append($imgshell);
			$imgshell.append($img);
			$left.append($username);
			$left.append($share);
			//$right.append($spinner);
			
			// populate with data
			$img.attr("src", "img/" + items[i].spotifyId + ".png");
			$section.addClass("bg-" + ((i%20)+1));
			//$section.addClass("bg-" + Math.floor((Math.random()*20)+1));
			//$section.css('background-image', "url(" + document.URL.replace(/#.*$/, "") + "img/" + items[i].spotifyId + "_bg.png)");
			$username.html(items[i].name + " <a target='_blank' href='http://www.twitter.com/" + items[i].twitter +"'><i class='fa fa-twitter'></i></a>");
			$right.append($playlistEmbed); // TODO only display iframe once its content is loaded completely
			$right.append("<p><a href='" + $playlistUrl + "' target='_blank'>Open playlist in Spotify</a>");
			
			// if twitter handle available, link to it after username, use it for tweet
			if (items[i].twitter) {
				$username.html(items[i].name + " <a href='http://www.twitter.com/" + items[i].twitter +"'><i class='fa fa-twitter'></i></a>");
				$twitterShare = "https://twitter.com/intent/tweet?text=Check this playlist of @" + items[i].twitter + "’s favourite songs.&amp;url=" + $sectionUrl.replace('#','%23') + "&amp;hashtags=78songs&amp;via=davidbauer"; 
			}
			
			else {
				$username.html(items[i].name);
				$twitterShare = "https://twitter.com/intent/tweet?text=Check this playlist of " + items[i].name + "’s favourite songs.&amp;url=" + $sectionUrl.replace('#','%23') + "&amp;hashtags=78songs&amp;via=davidbauer";
			}
			
			$facebookShare = "https://www.facebook.com/dialog/feed?app_id=1402559546704397&amp;redirect_uri=" + $sectionUrl.replace('#','%23') + "&amp;display=page&amp;link=" + $sectionUrl.replace('#','%23') + "&amp;name=Playlist: " + items[i].name + "’s favourite 78 songs.&amp;description=Music lovers share their 78 favourite songs. Play and save as a playlist in Spotify. &amp;picture=" + document.URL + "img/" + items[i].spotifyId + ".png";
			
			$share.append("<a target='_blank' class='sharebtn fb g g3 gl' href='" + $facebookShare + "'>Share on <i class='fa fa-facebook-square'></i></a>");
			$share.append("<a target='_blank' class='sharebtn twi g g3' href='" + $twitterShare + "'>Share on <i class='fa fa-twitter'></i></a>");
			
			// remove the loading spinner when we're done here
			if (i == items.length-1) {
				$('.mainspinner').remove();
			}	
	}
}

function reloadContent() {
	
}

// bring user to random playlist once she clicks the button
$('.random').click(function(){
	var i = Math.floor(Math.random()*playlists.length);
	var randomPlaylist = playlists[i];
	var randomId = "#" + randomPlaylist.username;
	
	var target = $(randomId);
	      target = target.length ? target : $('[name=' + randomId.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        document.location.hash=randomId;
	        return false;		
		};
}); 


