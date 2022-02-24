// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // tiledMap: cc.TiledMap,
    mapNode: cc.Node,
    diaogNode: cc.Node,
    laodNode: cc.Node,
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    //   开启物理引擎
    let p = cc.director.getPhysicsManager();
    p.enabled = true;
    // 碰撞局域的描绘
    // p.debugDrawFlags = true;
    p.gravity = cc.v2(0, 0);
    // 迷雾
    cc.director.getCollisionManager().enabled = true;
    // cc.director.getCollisionManager().enabledDebugDraw = true;
    this.laodNode.active = true;
    // 生成地图
    let mapNameArr = [
      ["00000", "01000", "00000"],
      ["00010", "11110", "00100"],
      ["00000", "10000", "00000"],
    ];
    this.initMap(mapNameArr);
  },
  // 根据地图名字数组生成地图
  initMap(mapNameArr) {
    let mapSt = null;
    // 地图是否在加加
    let loadCnt = 0;
    for (let i = 0; i < mapNameArr.length; i++) {
      for (let j = 0; j < mapNameArr.length; j++) {
        let mapName = mapNameArr[i][j];
        if (!mapName || mapName == "00000") continue;
        // 如果没有起始点
        if (!mapSt) {
          mapSt = { i, j };
        }
        //
        loadCnt++;
        cc.loader.loadRes(`map/${mapName}`, cc.TiledMapAsset, (err, assets) => {
          let node = new cc.Node();
          let map = node.addComponent(cc.TiledMap);
          node.anchorX = node.anchorY = 0;

          // 起始点的位置
          node.x = (j - mapSt.j) * 384;
          node.y = -(i - mapSt.i) * 384;

          map.tmxAsset = assets;
          node.parent = this.mapNode;
          // 墙壁的初始化
          this.initMapNode(node);
          if (--loadCnt == 0) {
            this.laodNode.active = false;
          }
        });
      }
    }
  },
  // 封装
  initMapNode(mapNode) {
    let tiledMap = mapNode.getComponent(cc.TiledMap);
    // 每一小块的距离
    let tiledSize = tiledMap.getTileSize();
    //   拿到wall城墙
    let layer = tiledMap.getLayer("wall");
    // 拿到块数
    let layerSize = layer.getLayerSize();
    // 迷雾
    // let smogLayer = tiledMap.getLayer("smog");
    // smogLayer.node.active = true;
    // console.log(layerSize.width);
    for (let i = 0; i < layerSize.width; i++) {
      for (let j = 0; j < layerSize.height; j++) {
        // console.log(layer);
        let tiled = layer.getTiledTileAt(i, j, true);
        if (tiled.gid != 0) {
          tiled.node.group = "wall";
          let body = tiled.node.addComponent(cc.RigidBody);
          body.type = cc.RigidBodyType.Static;
          let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
          collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
          collider.size = tiledSize;
          collider.apply();
        }
        // 迷雾碰撞组件
        // tiled = smogLayer.getTiledTileAt(i, j, true);

        // if (tiled.gid != 0) {
        //   tiled.node.group = "smog";
        //   let collider = tiled.node.addComponent(cc.BoxCollider);
        //   collider.offset = cc.v2(tiledSize.width / 2, tiledSize.hight / 2);
        //   collider.size = tiledSize;
        // }
      }
    }
  },
  start() {
    //#region 动态识别tiledMap的图层
    // for (let mapNode of this.mapNode.children) {
    //   this.initMapNode(mapNode);
    // }
    //#endregion
    // this.dialog = this.dialogNode.getComponent("dialog");
  },

  // update (dt) {},
});
