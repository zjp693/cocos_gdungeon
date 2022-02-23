// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let roleMap = {
  1: {
    name: "勇者",
    url: "role/hero",
  },
  2: {
    name: "骷髅王",
    url: "role/npc",
  },
};

cc.Class({
  extends: cc.Component,

  properties: {
    //   ico
    picSprite: cc.Sprite,
    // nameLabel
    nameLabel: cc.Label,
    // textLabel
    textLabel: cc.Label,
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
    this.init([
      //   角色对应 1 是勇者 2 是大魔王
      { role: 1, coentent: "大家好，我是勇者" },
      { role: 2, coentent: "我是魔王" },
    ]);
    // 绑定按键
    cc.systemEvent.on("keydown", this.onkeyDown, this);
  },
  //   // 解绑
  onDestroy() {
    cc.systemEvent.off("keydown", this.onKeyDown, this);
  },
  onkeyDown(e) {
    switch (e.keyCode) {
      case cc.macro.KEY.space: {
        this.nextTextData();
        break;
      }
    }
  },
  //   可以存储文本数值
  init(textDataArr) {
    this.nowText = null;
    this.textEnd = true;
    this.tt = 0;

    //   当前文本的所在下标
    this.textIndex = -1;
    //   赋值
    this.textDataArr = textDataArr;
    this.node.active = true;
    this.nextTextData();
  },
  //   对话框
  nextTextData() {
    if (++this.textIndex < this.textDataArr.length) {
      this.setTextData(this.textDataArr[this.textIndex]);
    } else {
      this.closeDialog();
    }
  },

  setTextData(textData) {
    //   未播放完毕不可播放下一段
    if (!this.textEnd) return;
    this.textEnd = false;
    // 对话框的内容
    this.nameLabel.string = roleMap[textData.role].name;
    this.textLabel.string = "";
    this.nowText = textData.coentent;

    cc.loader.loadRes(
      roleMap[textData.role].url,
      cc.SpriteFrame,
      (err, texture) => {
        this.picSprite.spriteFrame = texture;
      }
    );
  },
  closeDialog() {
    this.node.active = false;
  },
  //   start() {},

  update(dt) {
    if (!this.nowText) return;
    this.tt += dt;
    if (this.tt >= 0.1) {
      if (this.textLabel.string.length < this.nowText.length) {
      } else {
        this.textEnd = true;
        this.nowText = null;
      }
    }
  },
});
