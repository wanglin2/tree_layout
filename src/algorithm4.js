import { treeData } from "./treeData";
import { deepCopy } from "./utils";
import { renderTree, handleTree } from "./render";

// 算法4
const useAlgorithm4 = () => {
    // 树节点类
  class DrawTree {
    constructor(tree, depth = 0) {
      this.x = -1;
      this.y = depth;
      this.tree = tree;
      this.children = tree.children.map((child) => {
        return new DrawTree(child, depth + 1);
      });
      this.mod = 0;
    }
  }
  const nextright = (tree) => {
    if (tree.thread) {
      return tree.thread;
    } else if (tree.children.length > 0) {
      return tree.children[tree.children.length - 1];
    } else {
      return null;
    }
  };
  const nextleft = (tree) => {
    if (tree.thread) {
      return tree.thread;
    } else if (tree.children.length > 0) {
      return tree.children[0];
    } else {
      return null;
    }
  };
  // 
  const contour = (
    left,
    right,
    max_offset = null,
    loffset = 0,
    roffset = 0,
    left_outer = null,
    right_outer = null
  ) => {
    let delta = left.x + loffset - (right.x + roffset);
    if (max_offset === null || delta > max_offset) {
      max_offset = delta;
    }
    if (left_outer === null) {
      left_outer = left;
    }
    if (right_outer === null) {
      right_outer = right;
    }
    let lo = nextleft(left_outer);
    let li = nextright(left);
    let ri = nextleft(right);
    let ro = nextright(right_outer);
    if (li && ri) {
      loffset += left.mod;
      roffset += right.mod;
      return contour(li, ri, max_offset, loffset, roffset, lo, ro);
    }
    return [li, ri, max_offset, loffset, roffset, left_outer, right_outer];
  };
  const fix_subtrees = (left, right) => {
    let [li, ri, diff, loffset, roffset, lo, ro] = contour(left, right);
    diff += 1;
    diff += (right.x + diff + left.x) % 2;
    right.mod = diff;
    right.x += diff;
    if (right.children.length > 0) {
      roffset += diff;
    }
    if (ri && !li) {
      lo.thread = ri;
      lo.mod = roffset - loffset;
    } else if (li && !ri) {
      ro.thread = li;
      ro.mod = loffset - roffset;
    }
    return (left.x + right.x) / 2;
  };
  const addmods = (tree, mod = 0) => {
    tree.x += mod;
    tree.children.forEach((child) => {
      addmods(child, mod + tree.mod);
    });
    return tree;
  };
  const setup = (tree, depth = 0) => {
    // 叶子节点，x坐标设为0
    if (tree.children.length === 0) {
      tree.x = 0;
      return tree;
    } else if (tree.children.length === 1) {// 只有一个子节点，x坐标和子节点x坐标相同
      tree.x = setup(tree.children[0], depth + 1).x;
      return tree;
    }
    let left = setup(tree.children[0], depth + 1);
    let right = setup(tree.children[1], depth + 1);
    tree.x = fix_subtrees(left, right);
    return tree;
  };
  // 入口方法
  const layout = (tree) => {
    return addmods(setup(tree));
  };
  // 测试
  let tree = new DrawTree(deepCopy(treeData));
  tree = layout(tree);
  handleTree(tree);
  renderTree(tree);
};

export default useAlgorithm4;
