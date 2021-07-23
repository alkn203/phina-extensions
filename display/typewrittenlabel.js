phina.namespace(function() {

  /**
   * @class phina.display.TypewrittenLabel
   */
  phina.define('phina.display.TypewrittenLabel', {
    /**
     * @method init
     */
    init: function(options) {
      options = ({}).$safe(options || {}, phina.display.TypewrittenLabel.defaults);
      // 親クラス初期化
      this.superInit(options);
      // テキストの長さ
      var len = this.text.length;
      // インデックス
      var index = 0;
      var label = this.label;
      //  
      this.tweener.clear().to({index: len}, this.duration);
      //
      this.update = function() {
        // 右側を空白で詰めた部分テキスト
        label.text = text.substring(0, label.index | 0).paddingRight(len);
      };
    },
    
    _static: {
      defaults: {
        duration: 1000
      },
    }
  });
});