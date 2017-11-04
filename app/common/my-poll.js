
function getData() {
    const XHR = new XMLHttpRequest();   
    const poll = document.getElementById('all-poll'); //div for all polls

    XHR.addEventListener("load", function(event) {
		const result = JSON.parse(event.target.responseText);
		document.getElementById('top').innerHTML = "";
		result.map(function(item, index) {
			//console.log(item);
			const div = document.createElement('div');
			const html = '<a href="./poll/' + item._id + '"><span class="poll-title-grid"><p class="poll-headline">' + item.voting.name + '</p><p class="small">Date: ' + item.createdAt.substr(0,19).replace("T"," ") + '</p></span></a>'
			div.innerHTML = html;
			div.classList.add('poll-grid');
			poll.appendChild(div);
		});
		
		});	
    
    XHR.addEventListener("error", function(event) {
      document.getElementById('top').innerHTML = '<p>Something goes wrong. Please try later.</p>';
    });
    
    const pollId = window.location.pathname.replace("/poll/","");
    
    XHR.open("GET", "/poll/get/mypoll");
    XHR.send();
}

document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('top').innerHTML = '<p>Loading</p>';
	getData();
  });

