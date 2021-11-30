/*
 * aim
 */
phina.namespace(function() {
  /**
   * @class phina.accessory.Aim
   * Aim
   * @extends phina.accessory.Accessory
   */
  phina.define('phina.accessory.Aim', {
    superClass: 'phina.accessory.Accessory',
    /**
     * @constructor
     */
    init: function(target) {
      this.superInit(target);
    },
    
    onattached: function() {

    },

    ondetached: function() {
      this.dest = null;
    },
    
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