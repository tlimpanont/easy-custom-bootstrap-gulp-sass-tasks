var gulp = require('gulp-param')(require('gulp'), process.argv);
var plugins = require('gulp-load-plugins')();
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var path = require('path');
var fs = require('fs');
var rootThemes = path.resolve(__dirname, 'themes');

var getThemeFolders = (folder) => {
  var files = fs.readdirSync(folder);
  return files.filter( (name) => {
    var file = path.resolve(folder, name);
    return (fs.statSync(file).isDirectory());
  });
}

gulp.task('build', function(env) {
  if(!env) { env = 'dev'; }
  var processors = [
    autoprefixer({
      browsers: ['last 1 version']
    })
  ];

  if(env === 'prod') { processors.push(cssnano()) }

  getThemeFolders(rootThemes).forEach( (theme) => {

    var getPathResolveDest = (...restParams) => path.resolve(...['dist', env, 'css', 'themes', theme, ...restParams])

    // compile sass
    gulp.src(path.resolve(rootThemes, '_' + theme + '.scss'))
      .pipe(plugins.rename('style.css'))
      .pipe(plugins.sass())
      .pipe(plugins.postcss(processors))
      .pipe(gulp.dest(getPathResolveDest()))
      .pipe(plugins.print());

    // copy bootstrap fonts
    gulp.src(path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/fonts/**/*'))
      .pipe(gulp.dest(getPathResolveDest('fonts')))
      .pipe(plugins.print());


    // copy theme fonts
    gulp.src(path.resolve(rootThemes, theme, 'fonts', '**/*'))
      .pipe(gulp.dest(getPathResolveDest('fonts')))
      .pipe(plugins.print());
  });

});
