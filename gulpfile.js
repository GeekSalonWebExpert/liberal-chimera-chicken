'use strict';
/*
  Overview
  ********************************************************
  gulp (default) :
                  minify .html, .styl -> .css,
                  convey files
                  start watching

  gulp stylus    :.styl -> .css, convey to htdocs
  gulp minify    :minify .jpg, .png
  gulp watch     :start watching .js, .html, .styl
  ********************************************************
*/

/*
  Modules
  ********************************************************
*/
var gulp            = require('gulp');
var stylus          = require('gulp-stylus');
var autoprefixer    = require('gulp-autoprefixer');

var cssTask = function(){

  return gulp.src(["./src/css/*.styl"])
  .on("end",function(){
    console.log('.css generated');
  })
  .pipe(stylus())
  .pipe(autoprefixer({
    browsers: ['last 2 versions']
  }))
  .pipe(gulp.dest("build/"))

}

/*
  @task registration
  ********************************************************
*/
gulp.task('default',function(){
  cssTask()
})
