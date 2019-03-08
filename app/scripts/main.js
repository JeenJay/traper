let showMediaNavigation = document.querySelector('#showMediaNavigation');
let placeMedia = document.querySelector('.place__media');
let mediaNav = document.querySelector('.media__navigation');
let navItem = mediaNav.querySelectorAll('.navigation__item');
let mediaLink = mediaNav.querySelectorAll('.navigation__link');
let mediaContent = document.querySelector('.media__content');
let mediaVideo = mediaContent.querySelectorAll('.video');
let mediaVideoContainer = mediaContent.querySelectorAll('.video__media');
let video = document.querySelectorAll('.video__media > video');
let closeMediaContent = mediaContent.querySelector('#closeMediaContent');

let timeStep = 200;



document.addEventListener('DOMContentLoaded', function () {
	let headerContainer = document.querySelector('.header'),
		headerHeight = headerContainer.clientHeight,
		placeDesc = document.querySelector('.place__description');
	placeDesc.style.paddingTop = headerHeight + 'px';
}, false);



// https://stackoverflow.com/questions/3779771/html-5-video-stretch
// for (let i = 0; i < video.length; i++) {
// 	video[i].addEventListener('loadedmetadata', function() {
// 		this.style.width = this.videoWidth + 'px';
// 		this.style.height = this.videoHeight + 'px';
// 	});
// }​











showMediaNavigation.addEventListener('click', function () {
	this.classList.toggle('is-active');
	let showMediaNavigationContent = this.querySelector('span');
	if (this.classList.contains('is-active')) {
		showMediaNavigationContent.innerHTML = 'Ver menos';
	} else {
		showMediaNavigationContent.innerHTML = 'Ver mas rutas';
	};
	mediaNav.classList.toggle('is-open');
}, false);



for (let i = 0; i < mediaVideoContainer.length; i++) {
	let progressBar = document.createElement('progress');
	// progressBar.className = 'progress';
	progressBar.setAttribute('value', 0);
	progressBar.setAttribute('min', 0);
	mediaVideoContainer[i].appendChild(progressBar);
	video[i].addEventListener('loadedmetadata', function() {
		progressBar.setAttribute('max', video[i].duration);
	});
	video[i].addEventListener('timeupdate', function() {
		progressBar.value = video[i].currentTime;
	});
}​



for (let i = 0; i < mediaLink.length; i++) {

	video[i].volume = 0;

	mediaLink[i].addEventListener('click', function (event) {

		event.preventDefault();

		showMediaNavigation.classList.add('is-hidden');

		navItem.forEach(function (item) {
			item.classList.add('is-hiding');
			setTimeout(function () {
				item.classList.remove('is-hiding');
				item.classList.add('is-hidden');
			}, timeStep * 2);
		});
		mediaContent.classList.remove('is-hidden');
		mediaVideo[i].classList.remove('is-hidden');
		video[i].play();
		let videoVolume = 0;
		let fadeInSound = setInterval(function() {
			videoVolume += 0.1;
			if (videoVolume < 1) {
				video[i].volume = videoVolume;
			} else {
				clearInterval(fadeInSound);
			}
			console.log(video[i].volume);
		}, timeStep);

		closeMediaContent.classList.remove('is-hidden');

	}, false);

	closeMediaContent.addEventListener('click', function () {
		closeMediaContent.classList.add('is-hidden');
		mediaContent.classList.add('is-hiding');

		video[i].pause();
		video[i].volume = 0;

		setTimeout(function () {
			mediaContent.classList.add('is-hidden');
			mediaVideo[i].classList.add('is-hidden');
			mediaContent.classList.remove('is-hiding');
			video[i].currentTime = 0;
			navItem.forEach(function (item, i) {
				setTimeout(function () {
					item.classList.add('is-showing');
					item.classList.remove('is-hidden');
				}, i * (timeStep - 50));
				setTimeout(function () {
					item.classList.remove('is-showing');
				}, i * (timeStep * 2));
			});
		}, timeStep * 2);

		mediaNav.classList.remove('is-hidden');
		showMediaNavigation.classList.remove('is-hidden');

	}, false);

}







// 		mediaTitle.forEach(function (item, i) {
// 			setTimeout(function () {
// 				item.classList.remove('is-hidden');
// 			}, i * 100);
// 		}














