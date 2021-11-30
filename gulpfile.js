const gulp = require("gulp");
const concat = require("gulp-concat");

// ファイル結合タスクを作成
gulp.task("concat", () =>
  // 結合元のファイルを指定
  gulp
    .src(["src/accessory/*.js", "src/display/typedlabel.js", "src/effect/*.js", "src/ui/*.js", "src/util/map.js"])
    // 結合後のファイル名を指定
    .pipe(concat("phina-extensions.js"))
    // 出力フォルダを指定
    .pipe(gulp.dest("./build/"))
);

gulp.task("default", gulp.task("concat"));
