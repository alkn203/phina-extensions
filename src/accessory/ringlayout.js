phina.namespace(function() {
  /**
   * アタッチされたオブジェクトグループを円状に並べるアクセサリ
   * @class phina.accessory.RingLayout
   * @memberOf phina.accessory
   * @extends phina.accessory.Accessory
   *
   * @example
   *
   * var rectGroup = DisplayElement().addChildTo(this);
   *
   * (8).times(function(i) {
   *   RectangleShape().addChildTo(rectGroup);
   * });
   * // グループにRingLayoutをアタッチ
   * var rl = phina.accessory.RingLayout().attachTo(rectGroup);
   *
   * @param {object} [options.target=null] - アタッチ対象
   * @param {number} [options.radius=160] - 円の半径
   * @param {number} [options.offsetX=320] - x方向の位置
   * @param {number} [options.offsetY=480] - y方向の位置
   * @param {number} [options.ringRotation=0] - 回転
   * @param {number} [options.ringScaleX=1] - x方向の縮尺
   * @param {number} [options.ringScaleY=1] - y方向の縮尺
   */
  phina.define('phina.accessory.RingLayout', {
    superClass: 'phina.accessory.Accessory',

    init: function(options) {
      options = ({}).$safe(options || {}, phina.accessory.RingLayout.defaults);
      this.superInit(options.target);

      this.radius = options.radius;
      this.offsetX = options.offsetX;
      this.offsetY = options.offsetY;
      this.ringRotation = options.ringRotation;
      this.ringScaleX = options.ringScaleX;
      this.ringScaleY = options.ringScaleY;
    },
    
    onattached: function() {
      this.reposition();  
    }, 
    /**
     * オブジェクを並び替える
     * @instance
     * @memberof phina.accessory.RingLayout
     */
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

    _static: {
      defaults: {
        target: null,
        radius: 160,
        offsetX: 320,
        offsetY: 480,
        ringRotation: 0,
        ringScaleX: 1,
        ringScaleY: 1
      },
    }
  });

  phina.app.Element.prototype.getter('ringlayout', function() {
    if (!this._ringlayout) {
      this._ringlayout = phina.accessory.RingLayout().attachTo(this);
    }
    return this._ringlayout;
  });
});