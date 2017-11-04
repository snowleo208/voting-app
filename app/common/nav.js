function showSharing(event) {
	if(document.getElementById("social")) {
		//show tweet button in poll details page
		document.getElementById("social").href='https://twitter.com/intent/tweet?text=' + encodeURIComponent('Hey! Check this poll! ' + window.location.href + ' #poll #youvote'); 
	}
}


document.addEventListener("DOMContentLoaded", function(event) {
	var toggle = false;
	showSharing();
	
	document.getElementById("toggle-btn").addEventListener("click", function(event){
		//toggle slide out menu in mobile site
		console.log("toggle" + toggle);
		const menu = document.getElementById("menu-mobile");
		const toogleDiv = document.getElementById("toggle-btn");
		const panel = document.getElementById("panel");
		toggle = !toggle;
		if(toggle) {
			menu.style.display = "block";
			panel.style.transform = "translateX(200px)";
			toogleDiv.style.transform = "translateX(200px)";
			document.body.style.overflow = "hidden";
		} else if (!toggle) {
			menu.style.display = "none";
			panel.style.transform = "";
			toogleDiv.style.transform = "";
			document.body.style.overflow = "auto";
		}
		
		
	});
	
	
  });
