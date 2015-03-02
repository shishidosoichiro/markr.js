var gulp = require('gulp');
var mocha = require('gulp-mocha');
var blanket = require('gulp-blanket-mocha');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');


var src = {
	main: ['markr.js', 'tag.js'],
	test: 'test/*.js'
}

gulp.task('coverage', function() {
	gulp.src(src.main.concat(src.test), { read: false })
	.pipe(blanket({
		instrument: src.main,
		captureFile: 'coverage.html',
		reporter: 'html-cov'
	}))
});
gulp.task('test', function() {
	gulp.src(src.main.concat(src.test), { read: false })
	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(mocha({reporter: 'spec'}))
})
gulp.task('watch', function() {
	gulp.watch(src.main.concat(src.test), ['test']);
});
gulp.task('default', ['test', 'watch']);
