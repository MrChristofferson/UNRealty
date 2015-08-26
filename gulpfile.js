// Requires
var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('rimraf');
var jsonServer = require('json-server');
var source = require('vinyl-source-stream');
var serve = require('gulp-serve');
var browserify = require('browserify');
var sass = require('gulp-sass')

// Default 
gulp.task('default', ['build', 'watch', 'sass'])

// Clean
gulp.task('clean', function (cb) {
    clean('app/dist/bundle.js', cb)
})

// Sass 
gulp.task('sass', function () {
  gulp.src('./assets/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
});

// Watch
gulp.task('watch', function () {
  gulp.watch('app/js/app.js', ['build'])
  gulp.watch('./assets/scss/**/*.scss', ['sass'])
});


// Browserify
var bundler = browserify({
  entries: ['app/js/app.js'],
  debug: true
});
bundler.on('log', gutil.log); 

// Build
gulp.task('build', ['clean'], function () {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('app/dist'));
});

// API 
var apiServer = jsonServer.create();
var router = jsonServer.router('db.json');
apiServer.use(jsonServer.defaults);
apiServer.use(router);
gulp.task('serve:api', function (cb) {
  apiServer.listen(3000);
  cb();
});

// Web
gulp.task('serve:web', serve({
  root: ['.'],
  port: 8000
}));
gulp.task('serve', ['serve:api', 'serve:web'])
