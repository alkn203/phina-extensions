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
      this.tweener.clear().to({index: this.typedText.length}, options.duration);
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