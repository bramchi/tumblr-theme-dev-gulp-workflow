'use strict';

// Load .env file
require('dotenv').config();

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    prefix      = require('gulp-autoprefixer'),
    cleancss    = require('gulp-clean-css'),
    uglify      = require('gulp-uglify'),
    size        = require('gulp-size'),
    rename      = require('gulp-rename'),
    ftp         = require('vinyl-ftp'),
    gutil       = require('gulp-util'),
    livereload  = require('gulp-livereload'),
    runSequence = require('run-sequence'),
    clean       = require('gulp-clean'),
    iconfont    = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate');

var runTimestamp = Math.round(Date.now()/1000);

// FTP Config, user & pass & host are coming from .env file
var ftp_user            = process.env.FTP_USR;
var ftp_password        = process.env.FTP_PWD;
var ftp_host            = process.env.FTP_HOST;
var ftp_port            = 21;
var ftp_localFilesGlob  = ['./dist/**/*'];
var ftp_remoteFolder    = '/httpdocs/staging/tumblr';
var watch_sync_ftp_blob = ['./dist/**/*', '!./dist/fonts/*.*'];

// Build an FTP connection based on our configuration
function getFtpConnection() {
    return ftp.create({
        host: ftp_host,
        port: ftp_port,
        user: ftp_user,
        password: ftp_password,
        parallel: 5,
        log: gutil.log
    });
}

// compile all your Sass
gulp.task('sass', function (){
    gulp.src(['./src/scss/*.scss'])
        .pipe(sass({
            includePaths: ['./src/scss'],
            outputStyle: 'expanded'
        }))
        .pipe(prefix("last 3 versions"))
        .pipe(cleancss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'));
});

// Uglify JS
gulp.task('uglify', function(){
    gulp.src('./src/js/*.js')
        .pipe( uglify() )
        .pipe( rename({ suffix: '.min' }))
        .pipe( gulp.dest('./dist'));
});

// Stats
gulp.task('stats', function () {
    gulp.src('./dist/**/*')
    .pipe(size())
    .pipe(gulp.dest('./dist'));
});

// Clean dist folder
gulp.task('clean', function(){
    return gulp.src(['./dist/*'], {read:false})
    .pipe(clean());
});

// Copy html template to dist folder
gulp.task('copy-html', function(){
    gulp.src( './src/html/**/*' )
    .pipe(gulp.dest('./dist'));
});

// Copy fonts to dist folder
gulp.task('copy-fonts', function(){
    gulp.src( './src/fonts/**/*', { base: './src' } )
    .pipe(gulp.dest('./dist'));
});

// Watch stuff
gulp.task('watch', function(){
    // watch me getting Sassy
    gulp.watch("./src/scss/*.scss", ['sass'] );
    // make my JavaScript ugly
    gulp.watch("./src/js/*.js", ['uglify'] );
});

var iconfontdir = './src/iconfont/';

gulp.task('iconfont', ['iconfont-build'], function(){
    gulp.src( iconfontdir + 'fonts/*.*' )
        .pipe( gulp.dest(  './src/fonts'));

    gulp.src( iconfontdir + 'scss/*.*' )
        .pipe( gulp.dest( './src/scss'));
});

gulp.task('iconfont-build', function(){
  return gulp.src(['./src/iconfont/*.svg'])
    .pipe(iconfont({
        fontName: 'icons', // required
        prependUnicode: true, // recommended option
        formats: ['ttf', 'eot', 'woff', 'woff2'], // default, 'woff2' and 'svg' are available
        timestamp: runTimestamp, // recommended to get consistent builds when watching files
    }))
    .on('glyphs', function(glyphs, options) {
        gulp.src( iconfontdir + 'tpl_iconfont.scss')
            .pipe(consolidate('lodash', {
                glyphs: glyphs,
                fontName: options.fontName,
                fontPath: "fonts/"
            }))
            .pipe(rename('_iconfont.scss'))
            .pipe(gulp.dest( iconfontdir + 'scss/'));
    })
    .pipe(gulp.dest( iconfontdir + 'fonts'));
});

// Deploy once to server through FTP
gulp.task( 'deploy-ftp', function () {

    var conn = getFtpConnection();

    return gulp.src( ftp_localFilesGlob , { base: '.', buffer: false })
        .pipe( conn.newer( ftp_remoteFolder ) ) // only upload newer files
        .pipe( conn.dest( ftp_remoteFolder ) )
    ;

} );

// Listen for changes and keep server synced through ftp
gulp.task( 'watch-sync-ftp' , function() {

    livereload.listen(); // listen for changes to reload browser later on

    var conn = getFtpConnection();

    gulp.watch( watch_sync_ftp_blob )
        .on('change', function(event) {

            console.log('Changes detected: uploading file "' + event.path + '", ' + event.type);

            return gulp.src( [event.path], { base: '.', buffer: false } )
                .pipe( conn.newer( ftp_remoteFolder ) ) // only upload newer files
                .pipe( conn.dest( ftp_remoteFolder ) )
                .pipe( livereload() ); // reload browser
            ;

        });
});

// one time full build
gulp.task('default', function(callback) {

    runSequence( 'clean', 'sass', 'uglify', 'stats', 'copy-html', 'copy-fonts', callback);

});