<template>
  <div class="container">
    <div class="drawBox" ref="drawBox"></div>
  </div>
</template>

<script setup>
import Konva from "konva";
import { onMounted, ref } from "vue";

// ------------------数据---------------------

// 二叉树
const binaryTree = {
  name: "0",
  left_child: {
    name: "0-1",
  },
  right_child: {
    name: "0-2",
    left_child: {
      name: "0-2-1",
      left_child: {
        name: "0-2-1-1",
        left_child: {
          name: "0-2-1-1-1",
        },
      },
    },
  },
};
// 多叉树
const treeData = {
  name: "0",
  children: [
    {
      name: "0-1",
      children: [
        {
          name: "0-1-1",
          children: [
            {
              name: "0-1-1-1",
              children: [
                {
                  name: "0-1-1-1-1",
                  children: [
                    {
                      name: "0-1-1-1-1",
                      children: [],
                    },
                    {
                      name: "0-1-1-1-1-2",
                      children: [],
                    },
                  ],
                },
                {
                  name: "0-1-1-1-2",
                  children: [],
                },
              ],
            },
            {
              name: "0-1-1-2",
              children: [],
            },
          ],
        },
        {
          name: "0-1-2",
          children: [],
        },
      ],
    },
    {
      name: "0-2",
      children: [
        {
          name: "0-2-1",
          children: [
            {
              name: "0-2-1-1",
              children: [],
            },
            {
              name: "0-2-1-2",
              children: [],
            },
          ],
        },
        {
          name: "0-2-2",
          children: [],
        },
      ],
    },
  ],
};

// ---------------工具方法-----------------

const drawBox = ref(null);
const NODE_SPACE = 50;
let layer = null;
// 初始化舞台
const init = () => {
  let stage = new Konva.Stage({
    container: drawBox.value,
    width: 800,
    height: 800,
  });
  layer = new Konva.Layer();
  stage.add(layer);
};
// 绘制节点
const drawNode = (x, y) => {
  let circle = new Konva.Circle({
    x,
    y,
    radius: 10,
    fill: "#fff",
    stroke: "black",
    strokeWidth: 2,
  });
  layer.add(circle);
  layer.draw();
};
// 绘制连接线
const drawLine = (a, b) => {
  let line = new Konva.Line({
    points: [a.x, a.y, b.x, b.y],
    stroke: "black",
    strokeWidth: 2,
    lineCap: "round",
    lineJoin: "round",
  });
  layer.add(line);
  layer.draw();
};
// 深拷贝
const deepCopy = (data) => {
  return JSON.parse(JSON.stringify(data));
};
// 绘制
const draw = (tree) => {};
// 绘制二叉树
const renderBinaryTree = (tree) => {
  if (tree.left_child) {
    drawLine(tree, tree.left_child);
    renderBinaryTree(tree.left_child);
  }
  if (tree.right_child) {
    drawLine(tree, tree.right_child);
    renderBinaryTree(tree.right_child);
  }
  drawNode(tree.x, tree.y);
};
// 绘制多叉树
const renderTree = (tree) => {
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child) => {
      drawLine(tree, child);
      renderTree(child);
    });
  }
  drawNode(tree.x, tree.y);
};
const handleTree = (tree) => {
  tree.x *= NODE_SPACE
  tree.y *= NODE_SPACE
  tree.y += NODE_SPACE
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child) => {
      handleTree(child)
    });
  }
}

// ------------算法实现-----------------

// 算法1
const useAlgorithm1 = () => {
  const tree = deepCopy(binaryTree);
  let i = NODE_SPACE;
  const knuth_layout = (tree, depth) => {
    if (tree.left_child) {
      knuth_layout(tree.left_child, depth + 1);
    }
    tree.x = i;
    tree.y = depth * NODE_SPACE + NODE_SPACE;
    i += NODE_SPACE;
    if (tree.right_child) {
      knuth_layout(tree.right_child, depth + 1);
    }
  };
  knuth_layout(tree, 0);
  renderBinaryTree(tree);
};

// 算法2
const useAlgorithm2 = () => {
  const tree = deepCopy(treeData);
  const nexts = [];
  const minimum_ws = (tree, depth = 0) => {
    if (nexts[depth] === undefined) {
      nexts[depth] = NODE_SPACE;
    }
    tree.x = nexts[depth];
    tree.y = depth * NODE_SPACE + NODE_SPACE;
    nexts[depth] += NODE_SPACE;
    tree.children.forEach((child) => {
      minimum_ws(child, depth + 1);
    });
  };
  minimum_ws(tree);
  renderTree(tree);
};

// 算法3
const useAlgorithm3 = () => {
  class DrawTree {
    constructor(tree, depth = 0) {
      this.x = -1;
      this.y = depth;
      this.tree = tree;
      this.children = (tree.children || []).map((child) => {
        return new DrawTree(child, depth + 1);
      });
      this.mod = 0;
    }
  }
  const setup = (tree, depth = 0, nexts = {}, offset = {}) => {
    if (tree.children && tree.children.length > 0) {
      tree.children.forEach((child) => {
        setup(child, depth + 1, nexts, offset);
      });
    }
    // 设置y坐标为节点深度
    tree.y = depth;
    let place;
    // 没有子节点
    if (!tree.children || tree.children.length <= 0) {
      place = nexts[depth] || 0;
      tree.x = place;
    } else if (tree.children && tree.children.length === 1) {// 只有一个子节点
      place = tree.children[0].x - 1;
    } else {// 有多个子节点
      let s = tree.children[0].x + tree.children[1].x;
      place = s / 2;
    }
    offset[depth] = Math.max(offset[depth] || 0, (nexts[depth] || 0) - place);
    if (tree.children && tree.children.length > 0) {
      tree.x = place + (offset[depth] || 0);
    }
    if (nexts[depth] === undefined) {
      nexts[depth] = 0;
    }
    nexts[depth] += 2;
    tree.mod = offset[depth] || 0;
  };
  const addmods = (tree, modsum = 0) => {
    tree.x = tree.x + modsum;
    modsum += tree.mod;
    if (tree.children && tree.children.length > 0) {
      tree.children.forEach((child) => {
        addmods(child, modsum);
      });
    }
  };
  const layout = (tree) => {
    setup(tree);
    addmods(tree);
    return tree;
  };
  let tree = new DrawTree(deepCopy(treeData));
  tree = layout(tree);
  handleTree(tree)
  console.log(tree);
  renderTree(tree)
};

onMounted(() => {
  init();
  useAlgorithm1();
  useAlgorithm2()
  useAlgorithm3();
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.drawBox {
  border: 1px solid #000;
  width: 800px;
  height: 800px;
}
</style>
