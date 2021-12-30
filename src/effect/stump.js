phina.namespace(function() {
  /**
   * オブジェクトを上から押しつぶすエフェクトを作成します。
   * @class phina.effect.Stump
   * @memberOf phina.effect
   *
   * @example
   * // グローバルに展開
   * phina.globalize();
   *
   * @param {object} [options.target=null] - 対象のオブジェクト
   * @param {number} [options.speed=200] - つぶれるまでの時間
   */
  phina.define('phina.effect.Stump', {

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
        target: null,
        speed: 200
      },
    }
  });
});