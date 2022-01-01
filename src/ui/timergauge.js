phina.namespace(function() {
  /**
   * タイマーゲージ
   * @class phina.ui.TimerGauge
   * @memberOf phina.ui
   * @extends phina.ui.Gauge
   *
   * @example
   * // グローバルに展開
   * phina.globalize();
   *
   * @param {object} [options] - phina.ui.Gaugeのoptionsと同じ
   * @param {number} [options.limitTime=60] - 制限時間
  */
  phina.define('phina.ui.TimerGauge', {
    // Guageを継承
    superClass: 'phina.ui.Gauge',

      init: function(options) {
        options = ({}).$safe(options || {}, phina.ui.TimerGauge.defaults);
        // 制限時間をゲージに引き渡す
        options.maxValue = options.limitTime * 1000;
        // 親クラス初期化
        this.superInit(options);
      },
      /**
       * タイマーを起動する
       * @instance
       * @memberof phina.ui.TimerGauge
       */
      run: function() {
        this.update = this.elapse;
      },
      /**
       * タイマーを停止する
       * @instance
       * @memberof phina.ui.TimerGauge
       */
      pause: function() {
        this.update = null;
      },
      /**
       * タイマーゲージを回復する
       * @instance
       * @memberof phina.ui.TimerGauge
       */
      recover: function() {
        this.pause();
        this.value = this.maxValue;  
      },
      /**
       * タイマーゲージを減らす
       * @instance
       * @memberof phina.ui.TimerGauge
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