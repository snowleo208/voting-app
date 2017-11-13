function sendData() {
    var XHR = new XMLHttpRequest();
    
    var poll = document.getElementById('create-form'); //get data from create form
	form = new FormData(poll);
	var object = {};
	
	form.forEach(function(value, key){
		console.log(key);
		if(key !== "name") {
			if(!object.label) {
				object['label'] = [];
				object['label'].push({"id": key, "name": value});
				console.log(object);
			} else {
				object['label'].push({"id": key, "name": value});
			}
		} else if (value) {
			object[key] = value;
		}
	});
    console.log(object);
	
    XHR.addEventListener("load", function(event) {
		console.log(event.target.responseText);
        window.location.replace("/poll/" + event.target.responseText.replace(/\"/g,""));
    });
    
    XHR.addEventListener("error", function(event) {
      alert('Something goes wrong.');
    });
    XHR.open("POST", "/poll/new/create");
    XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    XHR.setRequestHeader("header_nb", "1");
    XHR.setRequestHeader("header_ds", "logon");
    XHR.setRequestHeader( "Content-Type", "application/json; charset=UTF-8" );
    XHR.send(JSON.stringify(object));
}


function validateForm(event) {
    var x = document.forms["create-form"]["name"].value;
    var y = document.forms["create-form"]["1"].value;
    var z = document.forms["create-form"]["2"].value;
    if (x == "" | y == "" | z == "") {
        alert("All fields must be filled out");
        return false;
    } else {
		//console.log('send data...');
		sendData();
	}
}

function addOptions (event) {
	const options = document.getElementsByClassName('choice').length;
	const lastDiv = document.getElementById(options);
	const form = document.getElementById('last-option');
	const newDiv = parseInt(options);
	const child = document.createElement('div');
	
	var html ='<div class="input-group"><div class="input-group-addon"><i class="fa fa-comments-o" aria-hidden="true"></i></div><input type="text" class="form-control choice" name="'+ newDiv + '" id="' + newDiv + '" placeholder="Option ' + newDiv + '"></div>'
	
	child.innerHTML = html;
	child.classList.add('form-group');
	
	console.log(lastDiv);
	console.log(child);
	form.appendChild(child);
}

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("submit").addEventListener("click", function(event){
		event.preventDefault();
		validateForm(event);
	});

	document.getElementById("add").addEventListener("click", function(event){
		addOptions(event);
	});

  });
