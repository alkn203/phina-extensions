phina.namespace(function() {

  /**
   * @class phina.display.TypedLabel
   */
  phina.define('phina.display.TypedLabel', {
    // Labelクラスを継承
    superClass: 'phina.display.Label',
    /**
     * @method init
     */
    init: function(options) {
      options = ({}).$safe(options || {}, phina.display.TypedLabel.defaults);
      // 親クラス初期化
      this.superInit(options);
      //
      this.text = '';
      // インデックス
      this.index = 0;
      // 表示するテキスト
      this.typedText = options.typedText;
      //
      this.tweener.clear().to({index: this.typedText.length}, 1000);
    },
    // update
    update: function() {
      var text = this.typedText;
      // 右側を空白で詰めた部分テキスト
      this.text = text.substring(0, this.index | 0).paddingRight(text.length);
    },
    
    _static: {
      defaults: {
        duration: 1000
      },
    }
  });
});

//グローバルに展開
phina.globalize();
/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',
  // 初期化
  init: function() {
    // 親クラス初期化
    this.superInit();
    // 背景色
    this.backgroundColor = 'silver';
    // テキスト
    var text = 'Time is money';
    //
    var label = phina.display.TypedLabel({
      typedText: text,
    }).addChildTo(this);
    
    label.setPosition(this.gridX.center(), this.gridY.center());
  },
});
/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    // MainScene から開始
    startLabel: 'main',
  });
  // fps表示
  //app.enableStats();
  // 実行
  app.run();
});