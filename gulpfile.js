const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

const target = ['src/accessory/aim.js',
                'src/accessory/collider.js',
                'src/accessory/gridlayout.js',
                'src/accessory/ringlayout.js',
                'src/display/typedlabel.js', 
                'src/effect/break.js',
                'src/ui/circlegauge.js',
                'src/ui/heartgauge.js',
                'src/ui/timergauge.js',
                'src/util/map.js'];
// ソースファイル結合タスク
const concatSrc = function (done) {
  // 結合元のファイルを指定
  gulp.src(target)
      // 結合後のファイル名を指定
      .pipe(concat('phina-extensions.js'))
      // 出力フォルダを指定
      .pipe(gulp.dest('./build/'));
  // 終了宣言
  done();
};
// タスク実行
exports.default = gulp.series(concatSrc);