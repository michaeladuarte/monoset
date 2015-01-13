var gulp        = require("gulp");
var sass        = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer');
var filter = require('gulp-filter')
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require("browser-sync");
var notify = require("gulp-notify");
var shell = require('gulp-shell');
var reload      = browserSync.reload;

// sass task
// gulp.task('sass', function () {
//     return gulp.src('scss/**/*.scss')
//         .pipe(sourcemaps.init())
//             .pipe(sass({
//                 //outputStyle: 'compressed',
//                 style: 'expanded',
//                 sourceComments: 'normal',
//                 // outputStyle: 'nested',
//                 precision: 10,
//                 noCache : true,
//                 onError: function (err) {
//                     notify().write(err);
//                 }
//             }))

//         .pipe(autoprefixer({browsers: ['last 2 versions']}))
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('css'))
//         .pipe(filter('scss**/*.css')) // Filtering stream to only css files
//         .pipe(browserSync.reload({stream:true}));
// });

gulp.task('sass', function () {
    return gulp.src('scss/**/*.scss')
      // Convert sass into css
      .pipe(sass({
        sourcemap: true,
        sourceComments: 'normal',
        onError: function(err) {
          return notify().write(err);
        }
      }))

      // Catch any SCSS errors and prevent them from crashing gulp
      .on('error', function (error) {
        console.error(error);
        this.emit('end');
      })

      // Load existing internal sourcemap
      .pipe(sourcemaps.init({loadMaps: true}))

      // Autoprefix properties
      .pipe(autoprefixer({
        browsers: ['last 2 versions']
      }))

      // Write final .map file
      .pipe(sourcemaps.write())

      // Save the CSS
      .pipe(gulp.dest('css'))

      // Filtering stream to only css files
      .pipe(filter('scss**/*.css'))

      .pipe(browserSync.reload({stream:true}));
});


// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('js/*js')
        .pipe(gulp.dest('js'));
});

// run drush to clear the theme registry.
gulp.task('drush', shell.task([
  'drush cache-clear theme-registry'
]));

// BrowserSynk
gulp.task('browser-sync', function() {
    //watch files
    var files = [
    'css/style.css',
    'js/*js',
    'img/**/*',
    'templates/*.twig'
    ];

    //initialize browsersync
    browserSync.init(files, {
    //browsersync with a php server
    proxy: "drupal8.dev",
    notify: true
    });
});

// Default task to be run with `gulp`
gulp.task('default', ['sass', 'js',  'browser-sync'], function () {
    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("js/*.js", ['js']);
});
