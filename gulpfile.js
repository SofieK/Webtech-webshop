var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
var pngquant = require('imagemin-pngquant');
var nodemon = require('gulp-nodemon');

gulp.task('css', function(){
	return gulp.src('public/stylesheets/style.css')
		.pipe(minifyCss({comptability: 'ie8'}))
		.pipe(gulp.dest('public/stylesheets'));
});

gulp.task('minify', function(){
	return gulp.src('public/uploads/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('public/uploads'));
});

gulp.task('nodemon', function() {
	return nodemon({
		script: 'bin/www',
		ext: 'js'
	}).on('start', function(){
	});
});

gulp.task('default', ['css', 'minify', 'nodemon'],function(){});