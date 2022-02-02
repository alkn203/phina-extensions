
phina.namespace(function() {
  /**
   * ドーナツ円タイプのゲージ
   * @class phina.ui.RingGauge
   * @memberOf phina.ui
   * @extends phina.display.PlainElement
   *
   * @example
   * // グローバルに展開
   * phina.globalize();
   *
   * @param {object} [options] - phina.display.PlainElementのoptionsと同じ
   * @param {number} [options.radius=32] - 円の半径
   * @param {string} [options.foreColor='lime'] - ゲージの色
   * @param {string} [options.backColor='red'] - ゲージの空部分の色
   * @param {number} [options.maxValue=100] - ゲージの最大値
   */
  phina.define('phina.ui.RingGauge', {
    // 継承
    superClass: 'phina.display.PlainElement',
    // コンストラクタ
    init: function(options) {
      options = ({}).$safe(options || {}, phina.ui.RingGauge.defaults);
      // 円サイズ（外周）
      this.radius = options.radius;
      // 親クラス初期化
      this.superInit({
        width: this.radius * 2,
        height: this.radius * 2,
      });
      // ゲージの色
      this.foreColor = options.foreColor;
      // 空部分の色
      this.backColor = options.backColor;
      // 最大値
      this.maxValue = options.maxValue;
      // 現在の値
      this.value = this.maxValue;
      //
      this.startDeg = 360;
      this.endDeg = 0;
      //
      this.drawGauge();
    },
    /**
     * ゲージが満タンかをチェックする
     * @instance
     * @memberof phina.ui.RingGauge
     *
     * @return {boolean} 満タンかどうか
     */
    isFull: function() {
      return this.value === this.maxValue;
    },
    /**
     * ゲージが空っぽかをチェックする
     * @instance
     * @memberof phina.ui.RingGauge
     *
     * @return {boolean} 空っぽかどうか
     */
    isEmpty: function() {
      return this.value === 0;
    },
    /**
     * 値をセットする
     * @instance
     * @memberof phina.ui.RingGauge
     *
   　* @param {number} value - 設定する値
     */
    setValue: function(value) {
      //
      value = Math.clamp(value, 0, this.maxValue);
      //
      if (this.value === value) return ;
      // 変更イベント発火
      this.flare('change');

      this.value = value;
    },
    /**
     * ゲージを描画する
     * @instance
     * @memberof phina.ui.RingGauge
     */
    drawGauge: function() {
      var canvas = this.canvas;
      var r = this.radius;
      //
      var ratio = (this.maxValue - this.value) / this.maxValue;
      // 開始位置を調整した角度
      var sDeg = Math.degToRad(this.startDeg - 90);
      var eDeg = Math.degToRad(ratio * 360 - 90);
      // canvasクリア
      canvas.clear();
      canvas.globalCompositeOperation = 'source-over';
        
      canvas.context.fillStyle = this.backColor;
      canvas.fillCircle(r, r, r);
      canvas.context.fillStyle = this.foreColor;
      // 部分円を描画
      canvas.beginPath();
      canvas.moveTo(r, r).arc(r, r, r, sDeg, eDeg, true);
      canvas.closePath();
      canvas.fill();
      // 円で切り抜く
      canvas.globalCompositeOperation = 'xor';
      canvas.fillCircle(r, r, r * 0.5);
    },
    
    _static: {
      defaults: {
        radius: 32,
        foreColor: 'lime',
        backColor: 'red',
        maxValue: 100,
      }
    }
  });
});