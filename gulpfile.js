const gulp    = require('gulp')
const ts      = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const del     = require('del')

const tsProject = ts.createProject('tsconfig.json')

let initServer = () => {
  process.env.NODE_ENV = 'development'
  nodemon({
    script: 'dist/',
    ext: 'js'
  })
  .on('restart', () => {
    gulp.src('dist/')
  })
}

gulp.task('scripts', ['static'], () => {
  const tsResult = tsProject.src().pipe(tsProject())
  return tsResult.js
                 .pipe(gulp.dest('dist'))
})

gulp.task('static', () => {
  return gulp.src(['src/**/*.json', 'src/**/*.yaml'])
             .pipe(gulp.dest('dist'))
})

gulp.task('del', () => {
  del('dist/**/*')
})

gulp.task('build', ['static', 'scripts', 'del'])

gulp.task('watch', ['build'], () => {
  gulp.watch(['src/**/*.ts', 'src/**/*.json', 'src/**/*.yaml'], ['build'])
})

gulp.task('default', ['watch'], () => {
  return initServer()
})