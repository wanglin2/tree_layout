import { treeData4 } from "./treeData";
import { deepCopy } from "./utils";
import { renderTree, handleTree } from "./render";

// 算法5
const useAlgorithm5 = () => {
  // 树节点类
  class DrawTree {
    constructor(tree, parent = null, depth = 0, number = 1) {
      this.name = tree.name;
      this.x = -1;
      this.y = depth;
      this.children = tree.children.map((child, index) => {
        return new DrawTree(child, this, depth + 1, index + 1);
      });
      this.parent = parent;
      // 线程节点，也就是指向下一个轮廓节点
      this.thread = null;
      // 根据左兄弟定位的x与根据子节点中间定位的x之差
      this.mod = 0;
      // 要么指向自身，要么指向所属树的根
      this.ancestor = this;
      this.change = this.shift = 0;
      // 最左侧的兄弟节点
      this._lmost_sibling = null;
      // 这是它在兄弟节点中的位置索引 1...n
      this.number = number;
    }

    // 有线程返回线程节点，否则返回最右侧的子节点，也就是树的右轮廓
    right() {
      return (
        this.thread ||
        (this.children.length > 0
          ? this.children[this.children.length - 1]
          : null)
      );
    }

    // 有线程返回线程节点，否则返回最左侧的子节点，也就是树的左轮廓
    left() {
      return (
        this.thread || (this.children.length > 0 ? this.children[0] : null)
      );
    }

    // 获取前一个兄弟节点
    left_brother() {
      let n = null;
      if (this.parent) {
        for (let i = 0; i < this.parent.children.length; i++) {
          let node = this.parent.children[i];
          if (node === this) {
            return n;
          } else {
            n = node;
          }
        }
      }
      return n;
    }

    // 获取同一层级第一个兄弟节点，如果第一个是自身，那么返回null
    get_lmost_sibling() {
      if (
        !this._lmost_sibling &&
        this.parent &&
        this !== this.parent.children[0]
      ) {
        this._lmost_sibling = this.parent.children[0];
      }
      return this._lmost_sibling;
    }

    // 同一层级第一个兄弟节点
    get leftmost_sibling() {
      return this.get_lmost_sibling();
    }
  }

  // 第一次递归
  const firstwalk = (v, distance = 1) => {
    if (v.children.length === 0) {
      // 当前节点是叶子节点且存在左兄弟节点，则其x坐标等于其左兄弟的x坐标加上间距distance
      if (v.leftmost_sibling) {
        v.x = v.left_brother().x + distance;
      } else {
        // 当前节点是叶节点无左兄弟，那么x坐标为0
        v.x = 0;
      }
    } else {
      v.children.forEach((child) => {
        firstwalk(child);
        apportion(child, distance);
      });

      // 子节点的中点
      let midpoint =
        (v.children[0].x + v.children[v.children.length - 1].x) / 2;
      let w = v.left_brother();
      if (w) {
        // 如果是非叶子节点则其x坐标等于其左兄弟的x坐标加上间距distance
        v.x = w.x + distance;
        // 同时记录下偏移量（x坐标与子节点的中点之差）
        v.mod = v.x - midpoint;
      } else {
        // 没有左兄弟节点，x坐标直接是子节点的中点
        v.x = midpoint;
      }
    }
    return v;
  };

  // 修正子孙节点定位
  const apportion = (v, distance) => {
    let leftBrother = v.left_brother();
    if (leftBrother) {
      // 四个节点指针
      let vInnerRight = v; // 右子树左轮廓
      let vOuterRight = v; // 右子树右轮廓
      let vInnerLeft = leftBrother; // 当前节点的左兄弟节点，左子树右轮廓
      let vOuterLeft = v.leftmost_sibling; // 当前节点的最左侧的兄弟节点，左子树左轮廓

      // 累加mod值，它们的父节点是同一个，所以往上它们要加的mod值也是一样的，那么在后面shift值计算时vInnerLeft.x + 父节点.mod - (vInnerRight.x + 父节点.mod)，父节点.mod可以直接消掉，所以不加上面的祖先节点的mod也没关系
      let sInnerRight = vInnerRight.mod;
      let sOuterRight = vOuterRight.mod;
      let sInnerLeft = vInnerLeft.mod;
      let sOuterLeft = vOuterLeft.mod;

      // 一直遍历到叶子节点
      while (vInnerLeft.right() && vInnerRight.left()) {
        // 更新指针
        vInnerLeft = vInnerLeft.right();
        vInnerRight = vInnerRight.left();
        vOuterLeft = vOuterLeft.left();
        vOuterRight = vOuterRight.right();

        // 左侧节点减右侧节点
        let shift = vInnerLeft.x + sInnerLeft + distance - (vInnerRight.x + sInnerRight);
        if (shift > 0) {
          // 大于0说明存在交叉，那么右侧的树要向右移动
          move_subtree(v, shift);
          // v.mod，也就是右侧子树增加了shift，sInnerRight、sOuterRight当然也要同步增加
          sInnerRight += shift;
          sOuterRight += shift;
        }

        // 累加当前层节点mod
        sInnerRight += vInnerRight.mod;
        sOuterRight += vOuterRight.mod;
        sInnerLeft += vInnerLeft.mod;
        sOuterLeft += vOuterLeft.mod;
      }

      // 将线程从浅的树的外侧设置到深的树的内侧
      if (vInnerLeft.right() && !vOuterRight.right()) {
        vOuterRight.thread = vInnerLeft.right();
        // 修正因为线程影响导致mod累加出错的问题，深的树减浅树
      } else {
        if (vInnerRight.left() && !vOuterLeft.left()) {
          vOuterLeft.thread = vInnerRight.left();
        }
      }
    }
  };

  // 移动子树
  const move_subtree = (v, shift) => {
    v.x += shift; // 自身移动
    v.mod += shift; // 后代节点移动
  };

  // 第二次遍历
  const second_walk = (v, m = 0, depth = 0, min = null) => {
    // 初始x值加上所有祖宗节点的mod修正值
    v.x += m;
    v.y = depth;
    v.children.forEach((child) => {
      min = second_walk(child, m + v.mod, depth + 1, min);
    });
  };

  const buchheim = (tree) => {
    let dt = firstwalk(tree);
    console.log(dt);
    second_walk(dt);
    return dt;
  };

  // 测试
  let tree = new DrawTree(deepCopy(treeData4));
  tree = buchheim(tree);
  handleTree(tree);
  renderTree(tree);
};

export default useAlgorithm5;
