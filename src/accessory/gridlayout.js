phina.namespace(function() {
  /**
   * アタッチされたオブジェクトグループをグリッド状に並べるアクセサリ
   * @class phina.accessory.GridLayout
   * @memberOf phina.accessory
   * @extends phina.accessory.Accessory
   *
   * @example
   *
   * var aim = phina.accessory.Aim().attachTo(enemy);
   * aim.aimTo(player);
   *
   * @param {object} [options.target=null] - アタッチ対象
   * @param {number} [options.cellWidth=64] - グリッドの幅
   * @param {number} [options.cellHeight=64] - グリッドの高さ
   * @param {number} [options.offsetX=32] - x方向の間隔
   * @param {number} [options.offsetY=32] - y方向の間隔
   * @param {number} [options.maxPerLine=10] - x方向の折返し数
   */
  phina.define('phina.accessory.GridLayout', {
    superClass: 'phina.accessory.Accessory',

    init: function(target, options) {
      options = ({}).$safe(options || {}, phina.accessory.GridLayout.defaults);
      this.superInit(options.target);

      this.cellWidth = options.cellWidth;
      this.cellHeight = options.cellHeight;
      this.offsetX = options.offsetX;
      this.offsetY = options.offsetY;
      this.maxPerLine = options.maxPerLine;
      this.arrangement = 'horizontal'; // vertical
    },
    
    onattached: function() {
      this.reposition();  
    },
    /**
     * オブジェクを並び替える
     * @instance
     * @memberof phina.accessory.GridLayout
     */
    reposition: function() {
      var children = this.target.children;
  
      if (this.arrangement === 'horizontal') {
        children.each(function(child, i) {
          var xIndex = (i%this.maxPerLine);
          var yIndex = (i/this.maxPerLine)|0;
          var x = this.cellWidth*xIndex + this.offsetX;
          var y = this.cellHeight*yIndex + this.offsetY;
          child.setPosition(x, y);
        }, this);
      }
    },
    
    _static: {
      defaults: {
        target: null,
        cellWidth: 64,
        cellHeight: 64,
        offsetX: 32,
        offsetY: 32,
        maxPerLine: 10
      },
    }
  });
  
  phina.app.Element.prototype.getter('gridlayout', function() {
    if (!this._gridlayout) {
      this._gridlayout = phina.accessory.GridLayout().attachTo(this);
    }
    return this._gridlayout;
  });

});