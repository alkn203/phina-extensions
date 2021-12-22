phina.namespace(function() {
  /**
   * アタッチされたオブジェクトの方向を常に向かせる
   * @class phina.accessory.Aim
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
  phina.define('phina.accessory.Aim', {
    superClass: 'phina.accessory.Accessory',

    init: function(target) {
      this.superInit(target);
    },
    
    onattached: function() {

    },

    ondetached: function() {
      this.dest = null;
    },
    /**
     * アタッチ対象をセット
     * @instance
     * @memberof phina.accessory.Aim
     *
     * @param {object} obj - アタッチ対象
     */
    aimTo: function(obj) {
      this.dest = obj;
    },

    update: function() {
      if (!this.target) return;
      this.target.setRotation(this.getDegree());      
    },
    
    getDegree: function() {
      var vec = Vector2.sub(this.dest, this.target);
      return Math.radToDeg(Math.atan2(vec.y, vec.x)) + 90;
    }
  });

  phina.app.Element.prototype.getter('aim', function() {
    if (!this._aim) {
      this._aim = phina.accessory.Aim().attachTo(this);
    }
    return this._aim;
  });
});