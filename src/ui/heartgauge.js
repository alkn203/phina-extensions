phina.namespace(function() {
  /**
   * ハートタイプのゲージ
   * @class phina.ui.HeartGauge
   * @memberOf phina.ui
   * @extends phina.display.PlainElement
   *
   * @example
   * var gauge = phina.ui.HeartGuage({offset: 100}).addChildTo(this);
   * @param {object} [options] - phina.display.DisplayElementのoptionsと同じ
   * @param {number} [options.gridSize=64] - グリッドサイズ
   * @param {number} [options.offset=0] - オフセット
   * @param {string} [options.heartColor='red'] - ハートの色
   * @param {string} [options.emptyColor='gray'] - 空ハートの色
   * @param {string} [options.backColor='red'] - ゲージの空部分の色
   * @param {number} [options.defaultMax=3] - デフォルトのハートの個数
   * @param {number} [options.maxValue=20] - ハートの最大個数
   * @param {number} [options.colmun=10] - ハートの折返し
   * @param {boolean} [options.animation=true] - ハートが減る時アニメーションするかどうか
  */
  phina.define("phina.ui.HeartGauge", {
    // 継承
    superClass: 'phina.display.DisplayElement',
    // コンストラクタ
    init: function(options) {
      options = ({}).$safe(options || {}, phina.ui.HeartGauge.defaults);
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
    /**
     * ハートを作成して返す
     * @instance
     * @memberof phina.ui.HeartGauge
     *
     * @param {string} type - ハートのタイプ empty or other
     * @return {object} HeartShape型オプジェクト
     */
    createHeart: function(type) {
      var color = (type === 'empty') ? this.emptyColor : this.heartColor;

      var heart = HeartShape({
        radius: this.heartRadius,
        fill: color,
        stroke: null,
      });
      return heart;
    },
    /**
     * ハートを配置する
     * @instance
     * @memberof phina.ui.HeartGauge
     *
     * @param {object} group - ハートグループ
     */
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
    /**
     * ダメージ処理
     * @instance
     * @memberof phina.ui.HeartGauge
     *
     * @param {number} value - ダメージ値
     */
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
    /**
     * 回復処理
     * @instance
     * @memberof phina.ui.HeartGauge
     *
     * @param {number} value - 回復値
     */
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
    /**
     * ハートの最大個数を増やす
     * @instance
     * @memberof phina.ui.HeartGauge
     */
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
    /**
     * 満タンかどうかを返す
     * @instance
     * @memberof phina.ui.HeartGauge
     *
     * @param {boolean} value - 満タンかどうか
     */
    isFull: function() {
      var len = this.heartGroup.children.length;
      return len > 0 && len === this.emptyGroup.children.length;
    },
    /**
     * 空かどうかを返す
     * @instance
     * @memberof phina.ui.HeartGauge
     *
     * @param {boolean} value - 空かどうか
     */
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