phina.namespace(function() {
  /**
   * アタッチされたオブジェクトに指定されたターゲットの方向を常に向かせるアクセサリ
   * @class phina.accessory.Collider
   * @memberOf phina.accessory
   * @extends phina.accessory.Accessory
   *
   * @example
   *
   * var aim = phina.accessory.Aim().attachTo(enemy);
   * aim.aimTo(player);
   *
   * @param {object} [target] - アタッチ対象
   */
  phina.define('phina.accessory.Collider', {
    superClass: 'phina.accessory.Accessory',

    init: function(target) {
      this.superInit(target);
    },
    // アタッチされた時
    onattached: function() {
      if (!this._collider) {
        this._collider = RectangleShape({
          width: this.target.width,
          height: this.target.height,
          fill: null,
        }).addChildTo(this.target);
        
        this._collider.hide();
      }
    },

    ondetached: function() {
      if (this._collider) {
        this._collider.remove();
      }
    },
    /**
     * コライダーを表示する
     * @instance
     * @memberof phina.accessory.Collider
     *
     * @return {object} 自分自身
     */
    show: function() {
      this._collider.show();
      return this;        
    },
    /**
     * コライダーを非表示にする
     * @instance
     * @memberof phina.accessory.Collider
     *
     * @return {object} 自分自身
     */
    hide: function() {
      this._collider.hide();
      return this;        
    },
    /**
     * コライダーの位置（相対座標）を指定する
     * @instance
     * @memberof phina.accessory.Collider
     *
     * @param {number} x - x座標
     * @param {number} y - y座標
     * @return {object} 自分自身
     */
    offset: function(x, y) {
      this._collider.setPosition(x, y);
      return this;
    },
    /**
     * コライダーのサイズを指定する
     * @instance
     * @memberof phina.accessory.Collider
     *
     * @param {number} width - 横サイズ
     * @param {number} height - 縦サイズ
     * @return {object} 自分自身
     */
    setSize: function(width, height) {
      this._collider.setSize(width, height);
      return this;
    },
    /**
     * 他のコライダーとの当たり判定を行う
     * @instance
     * @memberof phina.accessory.Collider
     *
     * @param {object} collider - 対象のコライダー
     * @return {boolean} ヒットしたかどうか
     */
    hitTest: function(collider) {
      if (!this.target) return;
      // 絶対座標の矩形を計算      
      var rect = this.getAbsoluteRect();
      var rect2 = collider.getAbsoluteRect();
      // 矩形同士で判定
      return phina.geom.Collision.testRectRect(rect, rect2);
    },
    // Colliderの絶対座標の矩形
    getAbsoluteRect: function() {
      var x = this._collider.left + this.target.x;
      var y = this._collider.top + this.target.y;
      return  phina.geom.Rect(x, y, this._collider.width, this._collider.height);
    },
  });

  phina.app.Element.prototype.getter('collider', function() {
    if (!this._collider) {
      this._collider = phina.accessory.Collider().attachTo(this);
    }
    return this._collider;
  });
});