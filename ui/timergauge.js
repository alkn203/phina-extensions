phina.namespace(function() {
  /**
   * @class phina.ui.TimerGauge
   * @extends phina.ui.Gauge
   */
  phina.define('phina.ui.TimerGauge', {
    // Guageを継承
    superClass: 'phina.ui.Gauge',
      // コンストラクタ
      init: function(options) {
        options = ({}).$safe(options || {}, phina.ui.TimerGauge.defaults);
        // 制限時間をゲージに引き渡す
        options.maxValue = options.limitTime * 1000;
        // 親クラス初期化
        this.superInit(options);
      },
      // タイマー稼働
      run: function() {
        this.update = this.elapse;
      },
      // タイマー停止
      pause: function() {
        this.update = null;
      },
      // ゲージ回復
      recover: function() {
        this.pause();
        this.value = this.maxValue;  
      },
      // 時間経過でゲージを減らす
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