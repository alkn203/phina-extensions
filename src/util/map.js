phina.namespace(function() {
  /**
   * マップ用の2次元配列データからマップを作成します。
   * @class phina.util.Map
   * @memberOf phina.util
   * @extends phina.display.DisplayElement
   *
   * @example
   * // グローバルに展開
   * phina.globalize();
   * // アセット
   * var ASSETS = {
   *   // 画像
   *   image: {
   *     'tile': 'https://cdn.jsdelivr.net/gh/alkn203/tomapiko_run@master/assets/tile.png',
   *   },
   * var data = [
   *   [2,2,2,2,2,2,2,2,2,2],
   *   [2,1,1,1,1,1,1,1,1,2],
   *   [2,2,2,2,2,2,2,1,1,2],
   *   [2,1,1,1,1,1,2,1,1,2],
   *   [2,1,1,1,1,1,2,1,1,2],
   *   [2,1,1,2,1,1,2,1,1,2],
   *   [2,1,1,2,1,1,1,1,1,2],
   *   [2,1,1,2,1,1,1,1,1,2],
   *   [2,1,1,2,1,1,1,1,1,2],
   *   [2,1,1,2,1,1,1,2,2,2],
   *   [2,1,1,1,1,1,1,1,1,2],
   *   [2,1,1,1,1,2,1,1,1,2],
   *   [2,1,2,2,2,2,2,1,1,2],
   *   [2,1,1,1,1,1,1,1,1,2],
   *   [2,2,2,2,2,2,2,2,2,2]
   * ];
   *
   * var map = phina.util.Map({
   *    tileWidth: 64,
   *    tileHeight: 64,
   *    imageName: 'tile',
   *    mapData: data,
   * }).addChildTo(this);
   *
   * @param {object} [options] - phina.display.DisplayElementのoptionsと同じ
   * @param {number} [options.tileWidth=64] - タイルの幅。
   * @param {number} [options.tileHeight=64] - タイルの高さ。
   * @param {string} [options.imageName=''] - タイル用の画像
   * @param {Array} [options.mapData=null] - マップデータ用の２次元配列
   * @param {Array} [options.collisionData=null] - 衝突判定用の２次元配列
   */
  phina.define('phina.util.Map', {
    superClass: 'phina.display.DisplayElement',

    init: function(options) {
      options = ({}).$safe(options || {}, phina.util.Map.defaults);
      // 親クラス初期化
      this.superInit();

      this.tileWidth = options.tileWidth;
      this.tileHeight = options.tileHeight;
      this.imageName = options.imageName;
      this.mapData = options.mapData;
      this.collisionData = options.collisionData;
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
     * タイルを全て消去する 
     * @instance 
     * @memberof phina.util.Map  
     */ 
    clear: function() {
      this.children.clear();
    },
    /**
     * 座標からマップとの衝突判定を行う
     * @instance
     * @memberof phina.util.Map
     *
     * @param {number} x - x座標
     * @param {number} y - y座標
     * @return {boolean} 衝突したかどうか
     */
    hitTest: function(x, y) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;

      if (this._collisionData[j * this.maxPerLine + i] === 1) return true;
      return false;
    },
    /**
     * 配列のインデックスからマップとの衝突判定を行う
     * @instance
     * @memberof phina.util.Map
     *
     * @param {number} i - 横方向のインデックス
     * @param {number} j - 縦方向のインデックス
     * @return {boolean} 衝突したかどうか
     */
    hitTestByIndex: function(i, j) {
      if (this._collisionData[j * this.maxPerLine + i] === 1) return true;
      return false;
    },
    /**
     * 指定された座標のタイルが何か調べる
     * @instance
     * @memberof phina.util.Map
     *
     * @param {number} x - x座標
     * @param {number} y - y座標
     * @return {number} タイル番号
     */
    checkTile: function(x, y) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;
      return this._mapData[j * this.maxPerLine + i];
    },
    /** 
     * 指定されたベクトルインデックスのタイルが何か調べる 
     * @instance 
     * @memberof phina.util.Map 
     * 
     * @param {object} vec - Vector2オブジェクト  
     * @return {number} タイル番号 
     */ 
    checkTileByVec: function(vec) { 
      return this._mapData[vec.y * this.maxPerLine + vec.x]; 
    }, 
    /**
     * 指定されたインデックスのタイルが何か調べる
     * @instance
     * @memberof phina.util.Map
     *
     * @param {number} i - 横方向のインデックス
     * @param {number} j - 縦方向のインデックス
     * @return {number} タイル番号
     */
    checkTileByIndex: function(i, j) {
      // 行のインデックス * 列数 + 列のインデックス
      return this._mapData[j * this.maxPerLine + i];
    },
    /**
     * 指定された座標のタイルを更新する
     * @instance
     * @memberof phina.util.Map
     *
     * @param {number} x - x座標
     * @param {number} y - y座標
     * @param {number} tile - タイル番号
     */
    setTile: function(x, y, tile) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;
      this._mapData[j * this.maxPerLine + i] = tile;
      this._createMap();
    },
    /**
     * 指定されたインデックスのタイルを更新する
     * @instance
     * @memberof phina.util.Map
     *
     * @param {number} i - 横方向のインデックス
     * @param {number} j - 縦方向のインデックス
     * @param {number} tile - タイル番号
     */
    setTileByIndex: function(i, j, tile) {
      this._mapData[j * this.maxPerLine + i] = tile;
      this._createMap();
    },
    /**
     * 指定された座標の子要素を得る
     * @instance
     * @memberof phina.util.Map
     *
     * @param {number} x - x座標
     * @param {number} y - y座標
     * @return {Object} 子要素
     */
    getChild: function(x, y) {
      var i = (x / this.tileWidth) | 0;
      var j = (y / this.tileHeight) | 0;
      return this.children[j * this.maxPerLine + i];
    },
    /**
     * 子要素を得る（インデックスから）
     */
    /**
     * 指定されたインデックスの子要素を得る
     * @instance
     * @memberof phina.util.Map
     *
     * @param {number} i - 横方向のインデックス
     * @param {number} j - 縦方向のインデックス
     * @return {Object} 子要素
     */
    getChildByIndex: function(i, j) {
      return this.children[j * this.maxPerLine + i];
    },
    // マップ作成
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
        imageName: '',
        mapData: null,
        collisionData: null
      },
    }
  });
});