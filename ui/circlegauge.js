
phina.namespace(function() {
  /*
   * @class phina.ui.CircleGuage
   * @extends phina.display.PlainElement
   */
  phina.define('phina.ui.CircleGuage', {
    // 継承
    superClass: 'phina.display.PlainElement',
    // コンストラクタ
    init: function(options) {
      options = ({}).$safe(options || {}, phina.ui.CircleGuage.defaults);
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
      //
      this.startDeg = 0;
      this.endDeg = 360;
    },
    //
    update: function() {
      var canvas = this.canvas;
      // canvasクリア
      canvas.clear();
      canvas.globalCompositeOperation = 'source-over';
        
      canvas.context.fillStyle = this.backColor;
      canvas.fillCircle(this.radius, this.radius, this.radius);
      canvas.context.fillStyle = this.foreColor;
      // 部分円を描画
      canvas.beginPath();
      canvas.moveTo(0, 0);
      canvas.arc(this.radius, this.radius, this.radius, Math.degToRad(this.startDeg - 90), Math.degToRad(this.endDeg - 90), false);
      canvas.closePath();
      canvas.fill();
      // 円で切り抜く
      canvas.globalCompositeOperation = 'xor';
      canvas.fillCircle(this.radius, this.radius, this.radius * 0.5);
    },
    
    _static: {
      defaults: {
        radius: 32,
        foreColor: 'lime',
        backColor: 'red',
      }
    }
  });
});