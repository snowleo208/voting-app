var item = 0;
var time = 6000; //time for each countdown

document.addEventListener("DOMContentLoaded", function(event) {
	if(document.getElementById('banner')) {
		setInterval(changeBG, 1000);
	}
 });

function changeBG() {
	const banner = document.getElementById('banner');
	const color = ['#ffce4f', '#88d8b0','#f0e2a8','#6497b1','#d896ff','#c0c5ce','#7bc043','#fdf498','#ffaa75','#fba0a0']
	time-=1000;
	//console.log(time);
	if(time == 3000) {
		if(item >= color.length-1) {
			item = 0;
		} else {
			item++;
		}
		//console.log(item + "|" + color[item]);
		banner.style.backgroundColor = color[item];
	} else if (time == 0) {
		time = 6000;
	}
	
}
