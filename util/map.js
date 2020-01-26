
phina.namespace(function() {

  /**
   * @class phina.util.Map
   */
  phina.define('phina.util.Map', {
    superClass: 'phina.display.DisplayElement',
    // タイルの幅
    tileWidth: 64,
    // タイルの高さ
    tileHeight: 64,
    // タイルセット画像の名前
    imageName: '',
    // マップデータの2次元配列
    mapData: null,
    // タイル衝突判定用の2次元配列
    collisionData: null,
    
    init: function(options) {
      options = ({}).$safe(options || {}, Map.defaults);
      // 親クラス初期化
      this.superInit();
      
      this.tileWidth = options.tileWidth;
      this.tileHeight = options.tileHeight;
      this.imageName = options.imageName;
      this.mapData = options.mapData;
      this.collisionData = options.collisionData;
      // マップ作成
      this._createMap();
    },
    /**
     * マップとの衝突判定を行う
     */
    hitTest: function(x, y) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;
            
      if (this.collisionData[j][i] === 1) return true;
      return false;
    },
    /**
     * タイルが何か調べる(座標から)
     */
    checkTile: function(x, y) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;
      return this.mapData[j][i];
    },
    /**
     * タイルが何か調べる(インデックスから)
     */
    checkTileByIndex: function(i, j) {
      return this.mapData[j][i];
    },
    /**
     * タイルを更新する
     */
    setTile: function(i, j, tile) {
      this.mapData[j][i] = tile;
    },
    /**
     * 子要素を得る（インデックスから）
     */
    getChildByIndex: function(i, j) {
      var index = j * this.mapData.first.length + i;
      return this.children[index]; 
    },
    /**
     * @private
     */
    _createMap: function() {
      var data = this.mapData;
      
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
          var tw = this.tileWidth;
          var th = this.tileHeight;        
          var tile = phina.display.Sprite(this.imageName, tw, th).addChildTo(this)
          // 原点は左上にしておく
          tile.setOrigin(0, 0).setPosition(j * th, i * tw);
          // フレームインデックス
          tile.frameIndex = data[i][j];
        }
      }
    },
    
    _static: {
      defaults: {
        tileWidth: 64,
        tileHeight: 64,
      },
    }
  });
});