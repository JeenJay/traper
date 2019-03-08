window.addEventListener('DOMContentLoaded', function preloaderShow () {
	var preloaderWrapper = document.createElement('div');
	preloaderWrapper.setAttribute("id", "preloader");
	document.body.insertBefore(preloaderWrapper, document.body.firstChild);
}, false);

window.addEventListener('load', function preloaderHide() {
	var preloaderWrapper = document.getElementById('preloader');
	preloaderWrapper.setAttribute("class", "animate");
	function loadSuccess() {
		document.body.removeChild(document.querySelector('#preloader'));
		console.log('Loading is complete');
	}
	setTimeout(loadSuccess, 1000);
}, false);
