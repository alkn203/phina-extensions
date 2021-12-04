phina.namespace(function() {

  /**
   * @class マップ作成用クラス
   */
  phina.define('phina.util.Map', {
    superClass: 'phina.display.DisplayElement',
    /**
     * コンストラクタ
     * @param {Object} options コンストラクタ用のパラメータ連想配列
     */
    init: function(options) {
      options = ({}).$safe(options || {}, phina.util.Map.defaults);
      // 親クラス初期化
      this.superInit();

      this.tileWidth = options.tileWidth || 64;
      this.tileHeight = options.tileHeight || 64;
      this.imageName = options.imageName || '';
      this.mapData = options.mapData || null;
      this.collisionData = options.collisionData || null;
      // 折り返し個数
      this.maxPerLine = this.mapData.first.length;
      
      var self = this;
      // 内部管理用の1次元配列
      this._mapData = [];
      // 2次元から1次元にする
      this.mapData.each(function(data) {
        self._mapData = self._mapData.concat(data);
      });
      
      if (this.collisionData) {
        this._collisionData = [];
        this.collisionData.each(function(data) {
          self._collisionData = self._collisionData.concat(data);
        });
      }
      // マップ作成
      this._createMap();
    },
    /**
     * マップとの衝突判定を行う(座標から)
     */
    hitTest: function(x, y) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;

      if (this._collisionData[j * this.maxPerLine + i] === 1) return true;
      return false;
    },
   /**
     * マップとの衝突判定を行う(インデックスから)
     */
    hitTestByIndex: function(i, j) {
      if (this._collisionData[j * this.maxPerLine + i] === 1) return true;
      return false;
    },
    /**
     * タイルが何か調べる(座標から)
     */
    checkTile: function(x, y) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;
      return this._mapData[j * this.maxPerLine + i];
    },
    /**
     * タイルが何か調べる(インデックスから)
     */
    checkTileByIndex: function(i, j) {
      // 行のインデックス * 列数 + 列のインデックス
      return this._mapData[j * this.maxPerLine + i];
    },
    /**
     * タイルを更新する(座標から)
     */
    setTile: function(x, y, tile) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;
      this._mapData[j * this.maxPerLine + i] = tile;
    },
    /**
     * タイルを更新する(インデックスから)
     */
    setTileByIndex: function(i, j, tile) {
      this._mapData[j * this.maxPerLine + i] = tile;
    },
    /**
     * 子要素を得る（座標から）
     */
    getChild: function(x, y) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;
      return this.children[j * this.maxPerLine + i];
    },
    /**
     * 子要素を得る（インデックスから）
     */
    getChildByIndex: function(i, j) {
      return this.children[j * this.maxPerLine + i];
    },
    /**
     * @private
     * マップ作成
     */
    _createMap: function() {
      var tw = this.tileWidth;
      var th = this.tileHeight;
      var maxPerLine = this.maxPerLine;
      var self = this;
      
      this._mapData.each(function(elem, i) {
        // グリッド配置用のインデックス値算出
        var xIndex = i % maxPerLine;
        var yIndex = Math.floor(i / maxPerLine);
        var x = tw * xIndex + tw / 2;
        var y = th * yIndex + th / 2;
        //
        var tile = phina.display.Sprite(self.imageName, tw, th).addChildTo(self);
        tile.setPosition(x, y);
        // フレームインデックス指定
        tile.frameIndex = elem;
      });
    },

    _static: {
      defaults: {
        tileWidth: 64,
        tileHeight: 64,
      },
    }
  });
});