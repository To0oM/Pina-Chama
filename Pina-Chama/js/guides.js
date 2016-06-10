var countVid = 0;
function addVideo() {
	countVid++;         
	
	var numOfVid = 'vid' + countVid;
	
	var vidName = "<p id='" + numOfVid + "' class='videoName'></p>";
	
	$("#allVideos").append(vidName);
	document.getElementById(numOfVid).innerHTML = $('#vidName').val();
	
	var vid = "<video class='video-js vjs-default-skin' width='550px' height='250px' controls preload='none'>"+
				"<source src='" + numOfVid + ".mp4' type='video/mp4' />"+
				" <source src='" + numOfVid + ".webm' type='video/webm'></video>";
	
	$("#allVideos").append(vid);
	
	/*
	document.getElementById("vid" + countVid).innerHTML = x;
	var videos = document.getElementById("allVideos");
	*/

	/*var vid = document.createElement("VIDEO");
	document.getElementById("allVideos").appendChild(vid);
	vid[0].setAttribute("class", "video-js vjs-default-skin");
	vid[1].setAttribute("width", "550px");
	vid[2].setAttribute("height", "250px");
	vid[3].setAttribute("controls preload", "none");
	document.getElementById("allVideos").appendChild(vid);
	*/  
}