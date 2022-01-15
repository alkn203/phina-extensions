phina.namespace(function() {
  /**
   * タイプされたように文字を表示するラベル
   * @class phina.display.TypedLabel
   * @memberOf phina.display
   * @extends phina.display.Label
   *
   * @example
   * // グローバルに展開
   * phina.globalize();
   *
   * @param {object} [options] - phina.display.Labelのoptionsと同じ
   * @param {string} [options.typedText=Hello] - 表示する文字
   * @param {number} [options.duration=1000] - 文字表示の時間間隔 ミリ秒
   */
  phina.define('phina.display.TypedLabel', {
    // Labelクラスを継承
    superClass: 'phina.display.Label',

    init: function(options) {
      options = ({}).$safe(options || {}, phina.display.TypedLabel.defaults);
      // 親クラス初期化
      this.superInit(options);
      // 初期値削除
      this.text = '';
      // 何文字目まで表示するか
      this.index = 0;
      // 表示するテキスト
      this.typedText = options.typedText;
      // タイプ終了
      this.finished = false;
      // 指定時間をかけてインデックスを増加
      this.tweener.clear().to({index: this.typedText.length}, options.duration)
                          .wait(100)
                          .call(function() {
                            // タイプ終了イベント発火
                            this.flare('typeend');
                          }, this);
    },
    // update
    update: function() {
      var text = this.typedText;
      // 右側を空白で詰めた部分テキスト
      this.text = text.substring(0, this.index | 0).paddingRight(text.length);
    },
    
    _static: {
      defaults: {
        typedText: 'Hello',
        duration: 1000
      },
    }
  });
});