phina.namespace(function() {
  /**
   * @class phina.accessory.GridLayout
   */
  phina.define('phina.accessory.GridLayout', {
    superClass: 'phina.accessory.Accessory',
    /**
     * @constructor
     */
    init: function(target) {
      this.superInit(target);

      this.cellWidth = 64;
      this.cellHeight = 64;
      this.offsetX = 32;
      this.offsetY = 32;
      this.maxPerLine = 10;
      this.arrangement = 'horizontal'; // vertical
    },
    
    onattached: function() {
      this.reposition();  
    },

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
  });
  
  phina.app.Element.prototype.getter('gridlayout', function() {
    if (!this._gridlayout) {
      this._gridlayout = phina.accessory.GridLayout().attachTo(this);
    }
    return this._gridlayout;
  });
});