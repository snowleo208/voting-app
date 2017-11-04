function getData() {
	//get data without creating new options
    const XHR = new XMLHttpRequest();   
    const poll = document.getElementById('detail'); //div for poll details
	const title = document.getElementById('poll-title'); //div for poll title
	const options = document.getElementById('options'); //div for poll title

    XHR.addEventListener("load", function(event) {
		
		if(event.currentTarget.status !== 200) {
			errorMsg(event.currentTarget.responseText, "show");
		} else {
			errorMsg("", "reset");
			const result = JSON.parse(event.target.responseText);
			console.log(event.target.responseText);
			createPieChart(result);	
		}	
    });
    
    XHR.addEventListener("error", function(event) {
      errorMsg(event.currentTarget.responseText);
    });
    
    const pollId = window.location.pathname.replace("/poll/","");
    XHR.open("GET", "/poll/find/" + pollId);
    console.log(pollId);
    XHR.send();
}

function sendData() {
	//get data with creating new options
    const XHR = new XMLHttpRequest();   
    const poll = document.getElementById('detail'); //div for poll details
	const title = document.getElementById('poll-title'); //div for poll title
	
    XHR.addEventListener("load", function(event) {
		//console.log(event.target.responseText);
		const result = JSON.parse(event.target.responseText);
		
		const child = document.createElement('div');
		const optionsGrid = document.getElementById('option-grid'); //div for option grid
		
		errorMsg("", "reset");//clear loading text
		title.innerHTML = result.voting.name; //get poll title
		optionsGrid.innerHTML = '<p>I would like to vote for: </p><select class="custom-select" id="options"></select>';
		const options = document.getElementById('options'); //div for poll title
		
		result.voting.label.map(function(item, index) {
			//console.log(item);
			var select = document.createElement("option");
			select.text = item.name;
			select.value = index;
			options.appendChild(select);
		});
		
		var select = document.createElement("option");
		select.text = "Add my options here";
		select.value = "add";
		options.appendChild(select);
		
		document.getElementById("options").addEventListener("click", function(event){
			//add event listener for clicked "add new option"
			if(document.getElementById('options').value =="add") {
				console.log('add');
				document.getElementById('new-option-grid').classList.remove('hidden');
			} else {
				console.log("new");
				document.getElementById('new-option-grid').classList.add('hidden');
			}
		});
		createPieChart(result);		
    });
    
    XHR.addEventListener("error", function(event) {
      errorMsg(event.currentTarget.responseText, "error");
    });
    
    const pollId = window.location.pathname.replace("/poll/","");
    
    XHR.open("GET", "/poll/find/" + pollId);
    //console.log(pollId);
    XHR.send();
}

function createPieChart(data) {
	var ctx = document.getElementById("chart");
	var seq = palette('tol-rainbow', data.voting.label.length); //create random palette via palette.js
	var label = [];
	var vote = [];
		data.voting.label.map(function(item) {
		label.push(item.name);
		vote.push(item.vote);
		});
	const pollData = {
		datasets: [{
			data: vote,
			backgroundColor: seq.map(function(hex) {
				return '#' + hex;
			}),
		}],
			labels: label
	};
	var pieChart = new Chart(ctx,{
		//use chart.js to create pie chart
		type: 'pie',
		data: pollData,
		options: options
	});
}

function addOptions (event) {
	event.preventDefault();
	var data = document.getElementById('new-option').value;
	var id = document.getElementById("options").options.length;
	
	const XHR = new XMLHttpRequest();   
	const final = {
		"id": id,
		"name": data
	}
    XHR.addEventListener("load", function(event) {
		//console.log(event.target.responseText);
		//console.log(JSON.parse(event.target.responseText));
		if(event.currentTarget.status !== 200) {
			if(event.currentTarget.responseText) {
				errorMsg(event.currentTarget.responseText, "error");
			} else {
				errorMsg("", "normal-error");
			}
		} else {
			document.getElementById('top').innerHTML = '';
			alert('You have successfully added new options');
			document.getElementById('new-option-grid').classList.add('hidden');
			sendData();
		}
    });
    
    XHR.addEventListener("error", function(event) {
      errorMsg("", "normal-error");
    });
    
    const pollId = window.location.pathname.replace("/poll/","");
    
    XHR.open("POST", "/poll/vote/new/" + pollId);
    XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    XHR.setRequestHeader("header_nb", "1");
    XHR.setRequestHeader("header_ds", "logon");
    XHR.setRequestHeader( "Content-Type", "application/json; charset=UTF-8" );
    XHR.send(JSON.stringify(final));
}

function errorMsg(data, action) {
	if(action == "error") {
		document.getElementById('top').classList.add('alert');
		document.getElementById('top').classList.add('alert-warning');
		document.getElementById('top').classList.add('fade-opacity');
		document.getElementById('top').innerHTML = '<p>'+ data + '</p>';

	} else if (action == "normal-error") {
		document.getElementById('top').classList.add('alert');
		document.getElementById('top').classList.add('alert-warning');
		document.getElementById('top').classList.add('fade-opacity');
		document.getElementById('top').innerHTML = '<p>Something goes wrong. Please try later.</p>';
	} else {
		document.getElementById('top').classList.remove('alert');
		document.getElementById('top').classList.remove('alert-warning');
		document.getElementById('top').classList.remove('fade-opacity');
		document.getElementById('top').innerHTML = "";
	}
}

function sendVote(data) {
	//submit vote to server
	var option = parseInt(data) +1;
	const XHR = new XMLHttpRequest();   
	const final = {
		"id": data
	}
	console.log(final);
    XHR.addEventListener("load", function(event) {
		//console.log(event.target.responseText);
		//console.log(JSON.parse(event.target.responseText));
		if(event.currentTarget.status !== 200) {
			if(event.currentTarget.responseText) {
				errorMsg(event.currentTarget.responseText, "error");
			} else {
				errorMsg("", "normal-error");
			}
		} else {
			document.getElementById('top').innerHTML = '';
			alert('You have successfully voted to option ' + option + '!');
			sendData();
		}

    });
    
    XHR.addEventListener("error", function(event) {
      errorMsg("", "normal-error");
    });
    
    const pollId = window.location.pathname.replace("/poll/","");
    
    XHR.open("POST", "/poll/vote/" + pollId);
    XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    XHR.setRequestHeader("header_nb", "1");
    XHR.setRequestHeader("header_ds", "logon");
    XHR.setRequestHeader( "Content-Type", "application/json; charset=UTF-8" );
    XHR.send(JSON.stringify(final));
}

function submitForm(event) {
    var x = document.getElementById('options').value;
    if (x == "default") {
        alert("Please select your choice first.");
        return false;
    } else {
		console.log('send data...');
		sendVote(x);
	}
}

//~ function showSharing(event) {
    //~ const XHR = new XMLHttpRequest();   
    //~ const social = document.getElementById('social'); //div for poll details

    //~ XHR.addEventListener("load", function(event) {
		//~ if(event.currentTarget.status == 200 && event.target.responseText[0].id !== "0") {
			//~ social.classList.remove('hidden');
			//~ social.href='https://twitter.com/intent/tweet?text=' + encodeURIComponent('Hey! Check this poll! ' + window.location.href + '#poll'); 
		//~ }	
    //~ });

    //~ XHR.open("GET", "/username/");
    //~ XHR.send();
//~ }


document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('top').innerHTML = '<p>Loading</p>';
	sendData();
	//~ showSharing();
	
    document.getElementById("submit-poll").addEventListener("click", function(event){
			event.preventDefault();
			submitForm(event);
	});
	
	document.getElementById("add-option").addEventListener("click", function(event){
		//add event listener for clicked "add" option button
		event.preventDefault();
		console.log("submit form");
		if(document.getElementById('new-option').value == "") {
			alert('Please input your custom option!');
		} else { 
			addOptions(event);
		}
	});

  });

