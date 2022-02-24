//
const maxHCnt = 4;
const maxWCnt = 4;

// 偏移量  初始点（0，0） 下上左右
let dirArr = [
  { i: -1, j: 0 },
  { i: 1, j: 0 },
  { i: 0, j: -1 },
  { i: 0, j: 1 },
];

// console.log(getRandNameArr());
// getRandNameArr();
// 连接两块地图
function conectMap(mapNameArr, index, dirNum, dirNotNull = false) {
  let dir = dirArr[dirNum];
  let nearIndex = {
    i: dir.i + index.i,
    j: dir.j + index.j,
  };
  if (
    nearIndex.i >= maxHCnt ||
    nearIndex.j >= maxWCnt ||
    nearIndex.i < 0 ||
    nearIndex.j < 0
  ) {
    return;
  }
  // console.log(mapNameArr);
  // 当地图后面无法连接时 不允许连接
  if (dirNotNull && mapNameArr[nearIndex.i][nearIndex.j] === "00000") {
    return;
  }

  //分割为数组
  let nowMapName = mapNameArr[index.i];
  let nearMapName = mapNameArr[nearIndex.i];
  nowMapName[dirNum] = "1";
  // 相邻的
  let nearNum;
  if (dirNum === 0) {
    nearNum = 1;
  } else if (dirNum == 1) {
    nearNum = 0;
  } else if (dirNum == 2) {
    nearNum = 3;
  } else if (dirNum == 3) {
    nearNum = 2;
  }
  nearMapName[nearNum] = "1";
  // console.log(nowMapName);
  mapNameArr[index.i][index.j] = nowMapName.join("");
  mapNameArr[nearIndex.i][nearIndex.y] = nearMapName.join("");
}
// 生成地图
function getRandNameArr() {
  let { mapArr, stIndex } = randBaseMap();
  let mapNameArr = [];
  for (let i = 0; i < maxHCnt; i++) {
    mapNameArr[i] = [];
    for (let j = 0; j < maxWCnt; j++) {
      mapNameArr[i][j] = "00000";
    }
  }
  for (let i = 0; i < maxHCnt; i++) {
    for (let j = 0; j < maxWCnt; j++) {
      if (!mapArr[i][j]) continue;
      for (let dirNum = 0; dirNum < dirArr.length; dirNum++) {
        conectMap(mapArr, { i, j }, dirNum);
      }
    }
  }
  // 当连通之后随机连接之后一个
  return mapNameArr;
}
console.log(randBaseMap());
// 生成基础随机数组
function randBaseMap() {
  let mapCnt = 8; //地图数量
  let mapArr = [];

  for (let i = 0; i < maxHCnt; i++) {
    mapArr[i] = [];
    for (let j = 0; j < maxWCnt; j++) {
      mapArr[i][j] = 0;
    }
  }

  // 随机一个起点
  let stIndex = {
    i: parseInt(Math.random() * maxHCnt),
    j: parseInt(Math.random() * maxWCnt),
  };
  var nextArr = setMap(mapArr, stIndex);
  mapCnt--;
  // 拿到连通的部分

  while (mapCnt && nextArr.length > 0) {
    let randNum = nextArr[parseInt(Math.random() * nextArr.length)];
    let nextIndex = nextArr.splice(randNum, 1)[0];

    let nearArr = setMap(mapArr, nextIndex);
    if (nextArr) {
      mapCnt--;
      nextArr = uniqNextArr([...nearArr, ...nextArr]);
    }
  }

  return { mapArr, stIndex };
}
// 去重
function uniqNextArr(nextArr) {
  let tag = [];
  let arr = [];
  for (let index of nextArr) {
    let num = index.i * maxHCnt + index.j;
    if (!tag[num]) {
      tag[num] = 1;
      arr.push(index);
    }
  }
}
// 设置通路
function setMap(mapArr, index) {
  // 行数 列数
  if (index.i >= maxHCnt || index.j >= maxWCnt || index.i < 0 || index.j < 0) {
    return null;
  }
  // 对应的位置是否被设置

  if (mapArr[index.i][index.j]) {
    return null;
  }
  mapArr[index.i][index.j] = 1;
  let nearArr = [];
  // 拿到对应的方向
  for (let dir of dirArr) {
    // 地图的偏移量
    let i = dir.i + index.i;
    let j = dir.j + index.j;
    // 是否存在生成的地图的条件
    if (i >= maxHCnt || j >= maxWCnt || i < 0 || j < 0) {
      continue;
    }
    // console.log(mapArr[i][j]);
    console.log(i, j);
    // 存在条件就设置为第一快地图
    if (!mapArr[i][j]) {
      nearArr.push({ i, j });
    }
  }
  return nearArr;
}
