// Archivo gulpfile.json
//Gulp automatizacion de tareas

var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var shell = require('gulp-shell');
var serve = require('gulp-serve');
 
//Tarea Build
gulp.task('build', function() { //Construir el libro
  return gulp.src('').pipe(shell(['./scripts/generate-gitbook']));
});



//Tarea deploy
gulp.task('deploy', function() {
  return gulp.src('./gh-pages/**/*') //publica todo lo que hay dentro del gh-pages
    .pipe(ghPages());
});
    
    
//Tarea servidor
gulp.task('serve', function() {
  return gulp.src('').pipe(shell(['gitbook serve --lrport 99990 --port 43210 ./txt gh-pages']));
});

// Tarea publicacion Iaas(se debe ejecuatar estando dentro del iaas)
gulp.task('gulp-ull', function(){
  return gulp.src('').pipe(shell([
  'git pull origin master'
  ]))
});

// Tarea por defecto

gulp.task('default', ['build', 'deploy']);
