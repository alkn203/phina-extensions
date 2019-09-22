phina.namespace(function() {

  /**
   * @class phina.effect.Stump
   */
  phina.define('phina.effect.Stump', {
    superClass: 'phina.display.DisplayElement',
    
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
                      // イベント発火
                      target.flare('stump');
                    })
                    .play();
    },
    
    _static: {
      defaults: {
        speed: 200
      },
    }
  });
});