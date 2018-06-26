// Used a guide provided from reviewer to setup gulp automation for better development workflow
// https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885

// TODO add build functionality
var gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  webserver = require("gulp-webserver"),
  inject = require("gulp-inject"),
  concat = require("gulp-concat");

var paths = {
  src: "src/**/*.html",
  srcHTML: "src/**/*.html",
  srcIndex: "src/index.html",
  srcRestaurant: "src/restaurant.html",
  srcCSS: "src/**/*.css",
  srcJS: "src/**/*.js",
  srcIMG: "src/**/*.jpg",

  tmp: "tmp",
  tmpIndex: "tmp/index.html",
  tmpRestaurant: "tmp/restaurant.html",
  tmpCSS: "tmp/**/*.css",
  tmpJS: "tmp/**/*.js",
  tmpIMG: "tmp/**/*.jpg",

  dist: "dist",
  distIndex: "dist/index.html",
  distRestaurant: "dist/restaurant.html",
  distCSS: "dist/**/*.css",
  distJS: "dist/**/*.js",
  distIMG: "dist/**/*.js"
};

// Default task
gulp.task("default", ["copy", "scripts", "inject", "watch"]);

// JsHint Task
gulp.task("jshint", function() {
  return gulp
    .src("js/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

// HTML task
gulp.task("html", function() {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

// CSS Task
gulp.task("css", function() {
  return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});

// JS Task
gulp.task("js", function() {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

// Images Task
gulp.task("img", function() {
  return gulp.src(paths.srcIMG).pipe(gulp.dest(paths.tmp));
});

// Concat all the index js files to one file
gulp.task("index_scripts", function() {
  var indexScripts = [
    "tmp/js/dbhelper.js",
    "tmp/js/main.js",
    "tmp/js/accessibility_helper.js",
    "register_sw.js",
    "tmp/js/common_functions.js"
  ];

  return gulp
    .src(indexScripts)
    .pipe(concat("index.js"))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task("restaurant_scripts", function() {
  var restaurantScripts = [
    "tmp/js/dbhelper.js",
    "tmp/js/restaurant_info.js",
    "tmp/js/accessibility_helper.js",
    "register_sw.js",
    "tmp/js/common_functions.js"
  ];

  return gulp
    .src(restaurantScripts)
    .pipe(concat("restaurant.js"))
    .pipe(gulp.dest(paths.tmp));
});

// TODO add data task too

// Index inject Task
gulp.task("inject_index", function() {
  var css = gulp.src(paths.tmpCSS);

  gulp
    .src(paths.tmpRestaurant)
    .pipe(inject(css, { relative: true }))
    .pipe(
      inject(
        gulp.src("tmp/restaurant.js", { relative: true }, { name: "head" })
      )
    )
    .pipe(gulp.dest(paths.tmp));

  return gulp
    .src(paths.tmpIndex)
    .pipe(inject(css, { relative: true }))
    .pipe(inject(gulp.src("tmp/index.js"), { relative: true }))
    .pipe(gulp.dest(paths.tmp));
});

// Restaurant Inject
gulp.task("inject:restaurant", function() {
  var css = gulp.src(paths.tmpCSS);

  return gulp
    .src(paths.tmpRestaurant)
    .pipe(inject(css, { relative: true }))
    .pipe(
      inject(
        gulp.src("tmp/restaurant.js", { relative: true }, { name: "head" })
      )
    )
    .pipe(gulp.dest(paths.tmp));
});

/* Web server Task
Servers file from tmp dic to local host 8000
*/
gulp.task("serve", ["inject"], function() {
  return gulp.src(paths.tmp).pipe(
    webserver({
      port: 8000,
      livereload: true
    })
  );
});

// Combine HTML, CSS and JS Tasks
gulp.task("copy", ["html", "css", "js", "img"]);

gulp.task("scripts", ["copy", "index_scripts", "restaurant_scripts"]);

gulp.task("inject", ["scripts", "inject_index", "inject:restaurant"]);

// gulp.task('watch_index', ['serve'], function(){
//     gulp.watch(paths.srcIndex, ['inject_index']);
// });
//
// gulp.task('watch_restaurant', ['serve'], function(){
//     gulp.watch(paths.srcRestaurant, ['inject:restaurant']);
// });
//
// gulp.task('watch_js', ['serve'], function(){
//     gulp.watch(paths.srcJS, ['jshint']);
// });
//
//
//
// gulp.task('watch', ['watch_index', 'watch_restaurant','watch_js']);

gulp.task("watch", ["serve"], function() {
  gulp.watch(paths.src, ["inject"]);
});
