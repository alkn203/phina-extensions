const gulp = require('gulp');
const concat = require('gulp-concat');
const jsdoc = require('gulp-jsdoc3');
// ファイル結合タスクを作成
gulp.task('concat', function (done) {
  // 結合元のファイルを指定
  gulp.src(['src/accessory/*.js', 'src/display/typedlabel.js', 'src/effect/*.js', 'src/ui/*.js', 'src/util/map.js'])
      // 結合後のファイル名を指定
      .pipe(concat('phina-extensions.js'))
      // 出力フォルダを指定
      .pipe(gulp.dest('./build/'));
  // コールバック
  done();
});
// JSdoc作成タスク
gulp.task('doc', function (cb) {
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});

gulp.task('default', gulp.parallel('concat', 'doc'));