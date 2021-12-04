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
phina.namespace(function() {

  /**
   * @class phina.display.TypedLabel
   */
  phina.define('phina.display.TypedLabel', {
    // Labelクラスを継承
    superClass: 'phina.display.Label',
    /**
     * @method init
     */
    init: function(options) {
      options = ({}).$safe(options || {}, phina.display.TypedLabel.defaults);
      // 親クラス初期化
      this.superInit(options);
      // 初期値削除
      this.text = '';
      // 何文字目まで表示するか
      this.index = 0;
      // 表示するテキスト
      this.typedText = options.typedText;
      // タイプ終了
      this.finished = false;
      // 指定時間をかけてインデックスを増加
      this.tweener.clear().to({index: this.typedText.length}, options.duration)
                          .wait(100)
                          .call(function() {
                            // タイプ終了イベント発火
                            this.flare('typeend');
                          }, this);
    },
    // update
    update: function() {
      var text = this.typedText;
      // 右側を空白で詰めた部分テキスト
      this.text = text.substring(0, this.index | 0).paddingRight(text.length);
    },
    
    _static: {
      defaults: {
        duration: 1000
      },
    }
  });
});
phina.namespace(function() {

  /**
   * @class phina.effect.Break
   */
  phina.define('phina.effect.Break', {
    superClass: 'phina.display.DisplayElement',
    
    /**
     * @constructor
     */
    init: function(sprite, options) {
      options = ({}).$safe(options || {}, phina.effect.Break.defaults);
      // 親クラス初期化
      this.superInit();
      // タイプ
      var type = options.type;
      
      if (type === 'mariolike') {
        this._marioLike(sprite);
      }
    },
    /**
     * @private
     */ 
    _marioLike: function(sprite) {
      // 縦横の分割数
      var divX = 2;
      var divY = 2;

      var image = sprite.image.domElement;
      // 分割サイズ
      var sizeX = sprite.width / divX;
      var sizeY = sprite.height / divY;
      // グリッド
      var grid = phina.util.Grid(sprite.width, divX);
      var srcRect = sprite.srcRect;
      // 分割スプライト作成
      (divX * divY).times(function(i) {
        // インデックス位置設定
        var xIndex = i % divX;
        var yIndex = (i / divX).floor();
        // 新規canvas作成
        var canvas = phina.graphics.Canvas().setSize(sizeX, sizeY);
        var x = srcRect.x + xIndex * sizeX;
        var y = srcRect.y + yIndex * sizeY;
        // canvasに描画
        canvas.context.drawImage(image, x, y, sizeX, sizeY, 0, 0, sizeX, sizeY);
        // 破片作成
        var piece = phina.display.Sprite(canvas).addChildTo(this);
        // 位置指定
        var px = grid.span(xIndex) + sprite.x - piece.width / 2;
        var py = grid.span(yIndex) + sprite.y - piece.height / 2;
        
        piece.setPosition(px, py);
        piece.rotation = 45;
      }, this);
      // 元スプライト削除
      this.spX = sprite.x;
      this.spY = sprite.y;
      sprite.remove();
      // 破片を散らす
      [[-120, 35], [-60, 35], [-150, 20], [-30, 20]].each(function(elem, i) {
        var piece = this.children[i];
        piece.physical.gravity.y = 4.6;
        piece.physical.velocity = phina.geom.Vector2().fromDegree(elem[0], elem[1]);
      }, this);
      // 自身を削除
      var self = this;
      this.tweener.wait(500)
                  .call(function() {
                    self.remove()
                  });
    },
    
    _static: {
      defaults: {
        type: 'mariolike'
      },
    }
  });
});
phina.namespace(function() {

  /**
   * @class phina.effect.Stump
   */
  phina.define('phina.effect.Stump', {
    /**
     * @constructor
     */
    init: function(target, options) {
      options = ({}).$safe(options || {}, phina.effect.Stump.defaults);
      // 親クラス初期化
      this.superInit();
      // 潰れる速さ
      var speed = options.speed;
      // origin変更
      target.setOrigin(0.5, 1.0);
      // 位置調整
      target.y += target.height / 2;
      // 縦方向に縮小
      target.tweener.to({scaleY: 0.1}, speed)
                    .call(function() {
                      // 削除
                      target.remove();
                      this.remove();
                    }, this)
                    .play();
    },
    
    _static: {
      defaults: {
        speed: 200
      },
    }
  });
});

phina.namespace(function() {
  /*
   * @class phina.ui.CircleGuage
   * @extends phina.display.PlainElement
   */
  phina.define('phina.ui.CircleGuage', {
    // 継承
    superClass: 'phina.display.PlainElement',
    // コンストラクタ
    init: function(options) {
      options = ({}).$safe(options || {}, phina.ui.CircleGuage.defaults);
      // 円サイズ（外周）
      this.radius = options.radius;
      // 親クラス初期化
      this.superInit({
        width: this.radius * 2,
        height: this.radius * 2,
      });
      // ゲージの色
      this.foreColor = options.foreColor;
      // 空部分の色
      this.backColor = options.backColor;
      //
      this.startDeg = 0;
      this.endDeg = 360;
      //
      this.drawGuage();
    },
    // ゲージを描画
    drawGuage: function() {
      var canvas = this.canvas;
      var r = this.radius;
      // 開始位置を調整した角度
      var sDeg = Math.degToRad(this.startDeg - 90);
      var eDeg = Math.degToRad(this.endDeg - 90);
      // canvasクリア
      canvas.clear();
      canvas.globalCompositeOperation = 'source-over';
        
      canvas.context.fillStyle = this.backColor;
      canvas.fillCircle(r, r, r);
      canvas.context.fillStyle = this.foreColor;
      // 部分円を描画
      canvas.beginPath();
      canvas.moveTo(r, r).arc(r, r, r, sDeg, eDeg, false);
      canvas.closePath();
      canvas.fill();
      // 円で切り抜く
      canvas.globalCompositeOperation = 'xor';
      canvas.fillCircle(r, r, r * 0.5);
    },
    
    _static: {
      defaults: {
        radius: 32,
        foreColor: 'lime',
        backColor: 'red',
      }
    }
  });
});
phina.namespace(function() {
  /*
   * @class phina.ui.HeartGuage
   * @extends phina.display.DisplayElement
   */
  phina.define("phina.ui.HeartGuage", {
    // 継承
    superClass: 'phina.display.DisplayElement',
    // コンストラクタ
    init: function(options) {
      options = ({}).$safe(options || {}, phina.ui.HeartGuage.defaults);
      // 親クラス初期化
      this.superInit(options);
      // グループ
      var emptyGroup = DisplayElement().addChildTo(this);
      var heartGroup = DisplayElement().addChildTo(this);

      var size = options.gridSize;
      var offset = options.offset;
      // ハートサイズ
      this.heartRadius = (size / 2) * 0.8;
      // ハートの色
      this.heartColor = options.heartColor;
      // 空ハートの色
      this.emptyColor = options.emptyColor;
      // 折り返し個数
      var col = options.colmun;
      // 初期最大値
      var max = options.defaultMax;
      // ハート最大値
      this.maxValue = options.maxValue;
      // アニメーションするかどうか
      this.animation = options.animation;
      // グリッド
      this.grid = Grid({
        width: size * col,
        colmuns: col,
        offset: offset
      });
      
      var self = this;
      // 初期ハート作成
      (max).times(function(i) {
        // 空ハート
        self.createHeart('empty').addChildTo(emptyGroup);
        // ハート中身
        self.createHeart().addChildTo(heartGroup);
      });
      // 参照用
      this.col = col;
      this.emptyGroup = emptyGroup;
      this.heartGroup = heartGroup;
      // 初期配置
      this.reposition(emptyGroup);
      this.reposition(heartGroup);
    },
    // ハートを作成して返す
    createHeart: function(type) {
      var color = (type === 'empty') ? this.emptyColor : this.heartColor;

      var heart = HeartShape({
        radius: this.heartRadius,
        fill: color,
        stroke: null,
      });
      return heart;
    },
    // ハート配置
    reposition: function(group) {
      var col = this.col;
      var grid = this.grid;
      var self = this;
      // ハート配置
      group.children.each(function(heart, i) {
        // インデックス位置設定
        var xIndex = i % col;
        var yIndex = (i / col).floor();
        // 位置指定
        heart.setPosition(grid.span(xIndex), grid.span(yIndex));
      });
    },
    // ダメージ
    damage: function(value) {
      // すでに空っぽなら何もしない
      if (this.isEmpty()) return;

      var children = this.heartGroup.children;
      var self = this;
      // 引数指定なしの場合は1ダメージ
      if (value === undefined) value = 1;
      // 残りハート数を超えないようにする
      if (value >= children.length) value = children.length;
      // アニメーション有効の場合
      if (this.animation) {
        (value).times(function(i) {
          // 末尾からインデックス指定
          var index = (children.length - 1) - i;
          var lost = children[index];
          // 点滅後削除
          lost.tweener.fadeOut(100).fadeIn(100)
                      .call(function() {
                        lost.remove();
                        // 空っぽ時イベント発火
                        if (self.isEmpty()) self.flare('empty');
                      }).play();
        });
      }
      else {
        (value).times(function(i) {
          self.heartGroup.children.pop();
        });

        if (self.isEmpty()) self.flare('empty');
      }
    },
    // 回復
    recover: function(value) {
      // すでに満タンなら何もしない
      if (this.isFull()) return;

      var self = this;
      var group = this.heartGroup;
      // 引数指定なしの場合は1回復
      value = (value === undefined) ? 1 : value;
      // 空ハートとの差分
      var sub = this.emptyGroup.children.length - group.children.length;
      // 上限以上の回復はしない
      if (value >= sub) value = sub;
      // ハート追加
      // アニメーション有効の場合
      if (this.animation) {
        (value).times(function(i) {
          var heart = self.createHeart().addChildTo(group);
          // 拡大アニメーション
          heart.setScale(0.1).tweener.scaleTo(1.0, 200)
                                     .call(function() {
                                       // 満タン時イベント発火
                                       if (self.isFull()) self.flare('full');
                                     }).play();
        });
      }
      else {
        (value).times(function(i) {
          var heart = self.createHeart().addChildTo(group);
        });
        // 満タン時イベント発火
        if (this.isFull()) this.flare('full');
      }
      // 再配置
      this.reposition(group);
    },
    // ハート最大値を増やす
    gainHeart: function() {
      // 最大ハート数なら何もしない
      if (this.emptyGroup.children.length === this.maxValue) return;
      // 空ハートを追加
      this.createHeart('empty').addChildTo(this.emptyGroup);
      // 全回復
      var sub = this.emptyGroup.children.length - this.heartGroup.children.length;
      this.recover(sub);
      // 再配置
      this.reposition(this.emptyGroup);
      this.reposition(this.heartGroup);
    },
    // 満タンかをチェック
    isFull: function() {
      var len = this.heartGroup.children.length;
      return len > 0 && len === this.emptyGroup.children.length;
    },
    // 空っぽかをチェック
    isEmpty: function() {
      return this.heartGroup.children.length === 0;
    },
    
    _static: {
      defaults: {
        gridSize: 64,
        offset : 0,
        heartColor: 'red',
        emptyColor: 'gray',
        defaultMax: 3,
        maxValue: 20,
        colmun: 10,
        animation: true
      },
    }
  });
});
phina.namespace(function() {
  /**
   * @class phina.ui.TimerGauge
   * タイマーゲージクラス
   * @extends phina.ui.Gauge
   */
  phina.define('phina.ui.TimerGauge', {
    // Guageを継承
    superClass: 'phina.ui.Gauge',
      /**
       * @constructor
       */
      init: function(options) {
        options = ({}).$safe(options || {}, phina.ui.TimerGauge.defaults);
        // 制限時間をゲージに引き渡す
        options.maxValue = options.limitTime * 1000;
        // 親クラス初期化
        this.superInit(options);
      },
      /**
       * @method run
       * タイマーを起動する
       */
      run: function() {
        this.update = this.elapse;
      },
      /**
       * @method pause
       * タイマーを停止する
       */
      pause: function() {
        this.update = null;
      },
      /**
       * @method recover
       * タイマーゲージを回復する
       */
      recover: function() {
        this.pause();
        this.value = this.maxValue;  
      },
      /**
       * @method elapse
       * タイマーゲージを減らす
       */
      elapse: function(app) {
        this.value -= app.deltaTime;
      },
      // デフォルト値
      _static: {
        defaults: {
          limitTime: 60,
        },
      }
  });
});
phina.namespace(function() {
  /**
   * マップ用の2次元配列データからマップを作成します。
   * @class phina.util.Map
   * @memberOf phina.util
   * @extends phina.display.DisplayElement
   *
   * @example
   * phina.globalize();
   *
   *
   *
   * @param {object} [options] - phina.display.DisplayElementのoptionsと一緒
   */
  phina.define('phina.util.Map', {
    superClass: 'phina.display.DisplayElement',

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