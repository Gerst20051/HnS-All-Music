HnS Music Discovery
========  

HnS Music Discovery is a playlist based music listening and video watching discovery engine with over 9000 songs of your favorite music.
-------------------------------
[HnS Music Discovery](http://music.hns.netai.net/) 

> I find I can listen to so much more music and make my music listening experience much more _enjoyable_ by adjusting my settings in the app by clicking on the sprocket. You can even watch the youtube video by clicking the window button in the upper right of the header panel.

### How to customize listening experience:

1. Turn on random mode.
2. Turn on express mode.
3. Adjust the starttime and playtime values.
-- I like to set starttime to 30 seconds to avoid the intro to songs.
-- I like to set playtime to 90 seconds so I don't have to listen to the whole song and it will skip to the next song when it reaches the two minute mark.

### Steps to updating playlist:

1. **Copy** songs from spotify playlist into _blank Excel Spreadsheet_
2. **Copy** the output into the blank textfile named **playlist.txt**
3. Run **merge.php** script with **$newplaylist = true;**
-- When the script is finished running it will say "Success, wrote data to file (**newplaylist.json**)"
-- It doesn't overwrite the original playlist.json incase something goes wrong during the process or you want to change some settings.
4. Run **merge.php** again with **$newplaylist = false;**
-- This time it will load the data in the file **newplaylist.json** into a variable for JavaScript to populate the empty data from YouTube.
-- This script will look through the data and determine whether or not the song his alrady been populated by looking at the ID.
--- If it is set to 0 that means an error has occured with the processing or it couldn't find a video for that song.
--- If it is an empty string "" it means the song hasn't been processed yet.
--- The script will even query google to get search suggestions based on the artist and track. It will use the first suggestion to search youtube. If it doesn't return a suggestion it will assume the song doesn't exist and skip to the next song without querying youtube.
--- The vidoes that aren't found on youtube are logged in the console so that they can be manually populated and they won't be queried more than once.
-- When the script has reached the end of the playlist it will output the finalized json data into a **textarea**.
5. **Copy** the outputed json data into **playlist.json** and the application is now ready to load the new data.

> The script in _string.php_ was used to initially populate playlist.json but once I had a playlist I needed to create another script to merge the updates so that I wouldn't have to repopulate the youtube data for every single song.

`Creator: Andrew Gerst`