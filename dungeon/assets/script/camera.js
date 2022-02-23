// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    //   角色节点
    playerNode: cc.Node,

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

  // onLoad () {},

  start() {},

  update(dt) {
    //   如果没有角色
    if (!this.playerNode) return;
    // console.log(111);
    // console.log(this.playerNode);
    // 当前玩家的节点转化为世界坐标节点
    // 将节点坐标系下的一个点转换到世界空间坐标系
    let w_pos = this.playerNode.convertToWorldSpaceAR(cc.v2(0, 0));
    // 将一个点转换到节点 (局部) 空间坐标系
    let n_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
    // 角色坐标和地图的空间坐标相等
    this.node.position = n_pos;
    // console.log(w_pos);
  },
});
