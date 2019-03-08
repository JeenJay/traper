"use strict";

function log(error) {
	console.log([
		'',
		"---------- ERROR MESSAGE START ----------",
		("[" + error.name + " in " + error.plugin + "]"),
		error.message,
		"----------- ERROR MESSAGE END -----------",
		''
	].join('\n'));
	this.end();
}

var autoprefixerList = [
	'Chrome >= 45',
	'Firefox ESR',
	'Edge >= 12',
	'Explorer >= 10',
	'iOS >= 9',
	'Safari >= 5',
	'Android >= 4.4',
	'Opera >= 30'
];

var config = {
	server: {
		baseDir: 'build/'
	},
	port: 3000,
	open: false,
	notify: false
};

let gulp = require('gulp'),
	webserver = require('browser-sync'),
	plumber = require('gulp-plumber'),
	rigger = require('gulp-rigger'),
	rename = require('gulp-rename'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	shorthand = require('gulp-shorthand'),
	cleanCSS = require('gulp-clean-css'),
	media = require('gulp-group-css-media-queries'),
	pug = require('gulp-pug'),
	uglify = require('gulp-uglify-es').default,
	cache = require('gulp-cache'),
	imagemin = require('gulp-imagemin'),
	minifyInline = require('gulp-minify-inline'),
	svgmin = require('gulp-svgmin');

gulp.task('webserver', function () {
	webserver(config);
});

gulp.task('html:build', function () {
	gulp.src('app/markup/pages/**/*.pug')
		.pipe(pug({
			pretty: true
		})).on('error', log)
		.pipe(minifyInline())
		.pipe(plumber())
		.pipe(gulp.dest('build/'))
		.pipe(webserver.reload({ stream: true }));
});

gulp.task('css:buildApp', function () {
	gulp.src('app/styles/_BUILDER_APP.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(media())
		.pipe(autoprefixer({
			browsers: autoprefixerList
		}))
		.pipe(shorthand())
		.pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
		.pipe(rename({
			basename: 'app',
			suffix: '.min'
		}))
		.pipe(gulp.dest('build/css/'))
		.pipe(webserver.reload({ stream: true }));
});

gulp.task('css:buildLib', function () {
	gulp.src('app/styles/_BUILDER_LIBS.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(media())
		.pipe(autoprefixer({
			browsers: autoprefixerList
		}))
		.pipe(shorthand())
		.pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
		.pipe(rename({
			basename: 'lib',
			suffix: '.min'
		}))
		.pipe(gulp.dest('build/css/'))
		.pipe(webserver.reload({ stream: true }));
});

gulp.task('js:buildApp', function () {
	gulp.src('app/scripts/_BUILDER_APP.js')
		.pipe(plumber())
		.pipe(rigger())
		.pipe(uglify())
		.pipe(rename({
			basename: 'app',
			suffix: '.min'
		}))
		.pipe(gulp.dest('build/js/'))
		.pipe(webserver.reload({ stream: true }));
});

gulp.task('js:buildLib', function () {
	gulp.src('app/scripts/_BUILDER_LIBS.js')
		.pipe(plumber())
		.pipe(rigger())
		.pipe(uglify())
		.pipe(rename({
			basename: 'lib',
			suffix: '.min'
		}))
		.pipe(gulp.dest('build/js/'))
		.pipe(webserver.reload({ stream: true }));
});

gulp.task('image:build', function () {
	gulp.src('app/images/**/*.{jpg,png}')
		.pipe(cache(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.jpegtran({ progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
		])))
		.pipe(gulp.dest('build/img/'));
});

gulp.task('svg:build', function () {
	gulp.src(['app/images/**/*.svg', '!app/images/data-uri/**/*.svg'])
		.pipe(gulp.dest('build/img/'))
});

gulp.task('fonts:build', function () {
	gulp.src('app/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts/'))
});

gulp.task('build', [
	'html:build',
	'css:buildApp',
	'css:buildLib',
	'js:buildApp',
	'js:buildLib',
	'image:build',
	'svg:build',
	'fonts:build'
]);

gulp.task('watch', function () {
	gulp.watch('app/markup/**/*.pug', ['html:build']);
	gulp.watch('app/styles/**/*.*', ['css:buildApp']);
	gulp.watch('app/styles/_BUILDER_LIBS.less', ['css:buildLib']);
	gulp.watch('app/scripts/**/*.js', ['js:buildApp']);
	gulp.watch('app/scripts/_BUILDER_LIBS.js', ['js:buildLib']);
	gulp.watch('app/images/**/*.{jpg,png}', ['image:build']);
	gulp.watch(['app/images/**/*.svg', '!app/images/data-uri/**/*.svg'], ['svg:build']);
	gulp.watch('app/fonts/**/*.*', ['fonts:build']);
});

gulp.task(
	'default',
	[
		'build',
		'webserver',
		'watch'
	]
);
