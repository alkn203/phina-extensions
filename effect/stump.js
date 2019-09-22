phina.namespace(function() {

  /**
   * @class phina.effect.Stump
   */
  phina.define('phina.effect.Stump', {
    /**
     * @constructor
     */
    init: function(target, options) {
      options = ({}).$safe(options || {}, phina.effect.Stump.defaults);
      // 親クラス初期化
      this.superInit();
      // 潰れる速さ
      var speed = options.speed;
      // origin変更
      target.setOrigin(0.5, 1.0);
      // 位置調整
      target.y += target.height / 2;
      // 縦方向に縮小
      target.tweener.to({scaleY: 0.1}, speed)
                    .call(function() {
                      // 削除
                      target.remove();
                      this.remove();
                    }, this)
                    .play();
    },
    
    _static: {
      defaults: {
        speed: 200
      },
    }
  });
});