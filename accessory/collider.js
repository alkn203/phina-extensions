/*
 * collider
 */
phina.namespace(function() {
  /**
   * @class phina.accessory.Collider
   * Collider
   * @extends phina.accessory.Accessory
   */
  phina.define('phina.accessory.Collider', {
    superClass: 'phina.accessory.Accessory',
    /**
     * @constructor
     */
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
    // 表示
    show: function() {
      this._collider.show();
      return this;        
    },
    // 非表示
    hide: function() {
      this._collider.hide();
      return this;        
    },
    // 相対位置指定
    offset: function(x, y) {
      this._collider.setPosition(x, y);
      return this;
    },
    // サイズ指定
    setSize: function(width, height) {
      this._collider.setSize(width, height);
      return this;
    },
    // 衝突判定
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