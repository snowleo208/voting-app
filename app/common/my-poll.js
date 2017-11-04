
function getData() {
    const XHR = new XMLHttpRequest();   
    const poll = document.getElementById('all-poll'); //div for all polls

    XHR.addEventListener("load", function(event) {
		const result = JSON.parse(event.target.responseText);
		document.getElementById('top').innerHTML = "";
		result.map(function(item, index) {
			//console.log(item);
			const div = document.createElement('div');
			const html = '<a href="./poll/' + item._id + '"><span class="poll-title-grid"><p class="poll-headline">' + item.voting.name + '</p><p class="small">Date: ' + item.createdAt.substr(0,19).replace("T"," ") + '</p></a><span class="btn btn-danger remove-poll" id=' + item._id + '><i class="fa fa-trash-o" aria-hidden="true"></i></span></span>'
			div.innerHTML = html;
			div.classList.add('poll-grid');
			poll.appendChild(div);
			document.getElementById(item._id).addEventListener('click', deletePoll);
		});
		
		});	
    
    XHR.addEventListener("error", function(event) {
      document.getElementById('top').innerHTML = '<p>Something goes wrong. Please try later.</p>';
    });
    
    const pollId = window.location.pathname.replace("/poll/","");
    
    XHR.open("GET", "/poll/get/mypoll");
    XHR.send();
}


function deletePoll(event) {
	//console.log(event.target.offsetParent.id);
	var r = confirm("Are you really want to remove this poll?");
	if (r == true) {
		var id = event.target.offsetParent.id || event.target.id
        removeItem(id);
    } else {
        return false;
    }
	
	function removeItem(id) {
		const XHR = new XMLHttpRequest();

    XHR.addEventListener("load", function(event) {
		document.getElementById('top').innerHTML = '<p>Successfully deleted.</p>';
		window.location.reload(true);
	});
    
    XHR.addEventListener("error", function(event) {
		console.log(event);
      document.getElementById('top').innerHTML = '<p>Something goes wrong. Please try later.</p>';
    });
    
    const pollId = event.target.offsetParent.id;
    console.log(id);
    
    XHR.open("POST", "/poll/remove/" + id);
    XHR.send();
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('top').innerHTML = '<p>Loading</p>';
	getData();
  });

