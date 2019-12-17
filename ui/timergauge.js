phina.namespace(function() {
  /**
   * @class phina.ui.TimerGauge
   * タイマーゲージクラス
   * @extends phina.ui.Gauge
   */
  phina.define('phina.ui.TimerGauge', {
    // Guageを継承
    superClass: 'phina.ui.Gauge',
      /**
       * @constructor
       */
      init: function(options) {
        options = ({}).$safe(options || {}, phina.ui.TimerGauge.defaults);
        // 制限時間をゲージに引き渡す
        options.maxValue = options.limitTime * 1000;
        // 親クラス初期化
        this.superInit(options);
      },
      /**
       * @method run
       * タイマーを起動する
       */
      run: function() {
        this.update = this.elapse;
      },
      /**
       * @method pause
       * タイマーを停止する
       */
      pause: function() {
        this.update = null;
      },
      /**
       * @method recover
       * タイマーゲージを回復する
       */
      recover: function() {
        this.pause();
        this.value = this.maxValue;  
      },
      /**
       * @method elapse
       * タイマーゲージを減らす
       */
      elapse: function(app) {
        this.value -= app.deltaTime;
      },
      // デフォルト値
      _static: {
        defaults: {
          limitTime: 60,
        },
      }
  });
});