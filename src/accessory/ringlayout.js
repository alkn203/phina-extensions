phina.namespace(function() {
  /**
   * @class phina.accessory.RingLayout
   */
  phina.define('phina.accessory.RingLayout', {
    superClass: 'phina.accessory.Accessory',
    /**
     * @constructor
     */
    init: function(target) {
      this.superInit(target);

      this.radius = 160;
      this.offsetX = 320;
      this.offsetY = 480;
      this.ringRotation = 0;
      this.ringScaleX = 1;
      this.ringScaleY = 1;
    },
    
    onattached: function() {
      this.reposition();  
    }, 

    reposition: function() {
      var children = this.target.children;
      var deg = 360 / children.length;

      children.each(function(child, i) {
        var rad = Math.degToRad(deg*i + this.ringRotation);
        var x = this.radius*this.ringScaleX*Math.cos(rad) + this.offsetX;
        var y = this.radius*this.ringScaleY*Math.sin(rad) + this.offsetY;
        child.setPosition(x, y);
      }, this);
    },
  });

  phina.app.Element.prototype.getter('ringlayout', function() {
    if (!this._ringlayout) {
      this._ringlayout = phina.accessory.RingLayout().attachTo(this);
    }
    return this._ringlayout;
  });
});