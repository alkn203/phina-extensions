phina.namespace(function() {
  /**
   * オブジェクト破壊のエフェクトを作成します。
   * @class phina.effect.Break
   * @memberOf phina.effect
   * @extends phina.display.DisplayElement
   *
   * @example
   * var sprite = Sprite('tiles', GRID_SIZE, GRID_SIZE).addChildTo(this);
   *
   * phina.effect.Break({
   *   sprite: sprite,
   * }).addChildTo(this);
   *
   * @param {object} [options] - phina.display.DisplayElementのoptionsと同じ
   * @param {object} [options.sprite=null] - 対象のスプライト
   * @param {string} [options.type='mariolike'] - 破壊エフェクトのタイプ
   */
  phina.define('phina.effect.Break', {
    superClass: 'phina.display.DisplayElement',

    init: function(options) {
      options = ({}).$safe(options || {}, phina.effect.Break.defaults);
      // 親クラス初期化
      this.superInit(options);
      // タイプ
      var type = options.type;
      // スプライト
      var sprite = options.sprite;
      
      if (type === 'mariolike') {
        this._marioLike(sprite);
      }
    },
    /**
     * @private
     */ 
    _marioLike: function(sprite) {
      // 縦横の分割数
      var divX = 2;
      var divY = 2;

      var image = sprite.image.domElement;
      // 分割サイズ
      var sizeX = sprite.width / divX;
      var sizeY = sprite.height / divY;
      // グリッド
      var grid = phina.util.Grid(sprite.width, divX);
      var srcRect = sprite.srcRect;
      // 分割スプライト作成
      (divX * divY).times(function(i) {
        // インデックス位置設定
        var xIndex = i % divX;
        var yIndex = (i / divX).floor();
        // 新規canvas作成
        var canvas = phina.graphics.Canvas().setSize(sizeX, sizeY);
        var x = srcRect.x + xIndex * sizeX;
        var y = srcRect.y + yIndex * sizeY;
        // canvasに描画
        canvas.context.drawImage(image, x, y, sizeX, sizeY, 0, 0, sizeX, sizeY);
        // 破片作成
        var piece = phina.display.Sprite(canvas).addChildTo(this);
        // 位置指定
        var px = grid.span(xIndex) + sprite.x - piece.width / 2;
        var py = grid.span(yIndex) + sprite.y - piece.height / 2;
        
        piece.setPosition(px, py);
        piece.rotation = 45;
      }, this);
      // 元スプライト削除
      this.spX = sprite.x;
      this.spY = sprite.y;
      sprite.remove();
      // 破片を散らす
      [[-120, 35], [-60, 35], [-150, 20], [-30, 20]].each(function(elem, i) {
        var piece = this.children[i];
        piece.physical.gravity.y = 4.6;
        piece.physical.velocity = phina.geom.Vector2().fromDegree(elem[0], elem[1]);
      }, this);
      // 自身を削除
      var self = this;
      this.tweener.wait(500)
                  .call(function() {
                    self.remove()
                  });
    },
    
    _static: {
      defaults: {
        type: 'mariolike',
        sprite: null
      },
    }
  });
});