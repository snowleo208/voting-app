function getData(url, action) {
	const getUrl = url;
    const XHR = new XMLHttpRequest();   
    const poll = document.getElementById(action); //div for all polls

    XHR.addEventListener("load", function(event) {
		const result = JSON.parse(event.target.responseText);
		if(event.currentTarget.status !== 200) {
			document.getElementById('top').innerHTML = "Sorry, something goes wrong. Please try again later.";
		} else {
			if(action == "latest") {
				document.getElementById('top').innerHTML = "";
				result.map(function(item, index) {
					//console.log(item);
					const div = document.createElement('div');
					const html = '<a href="./poll/' + item._id + '"><div class="poll-title-grid"><p class="poll-headline">' + item.voting.name + '</p></div></a>'
					div.innerHTML = html;
					div.classList.add('poll-grid');
					poll.appendChild(div);
				});
			} else {
				document.getElementById('top').innerHTML = "";
				result.map(function(item, index) {
					//console.log(item);
					const div = document.createElement('div');
					const html = '<a href="./poll/' + item._id + '"><div class="poll-title-grid"><p class="poll-headline">' + item.voting.name + '</p></div></a>'
					div.innerHTML = html;
					div.classList.add('poll-grid');
					poll.appendChild(div);
				});
			}
			
		}

	});	
    
    XHR.addEventListener("error", function(event) {
      document.getElementById('top').innerHTML = '<p>Something goes wrong. Please try later.</p>';
    });
    
    const pollId = window.location.pathname.replace("/poll/","");
    
    XHR.open("GET", getUrl);
    XHR.send();
}

document.addEventListener("DOMContentLoaded", function(event) {
	if(document.getElementById('all-poll')) {
		document.getElementById('top').innerHTML = '<p>Loading</p>';
		getData("/poll/get/all?type=all", "all-poll");
	} else if(document.getElementById('latest')) {
		document.getElementById('top').innerHTML = '<p>Loading</p>';
		getData("/poll/get/all?type=latest&num=10", "latest");
	}
	
 
 
 });

