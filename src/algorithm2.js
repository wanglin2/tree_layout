import { treeData } from "./treeData";
import { deepCopy } from "./utils";
import { renderTree, handleTree } from "./render";

// 算法2
const useAlgorithm2 = () => {
  const tree = deepCopy(treeData);
  const nexts = [];
  const minimum_ws = (tree, depth = 0) => {
    if (nexts[depth] === undefined) {
      nexts[depth] = 0;
    }
    tree.x = nexts[depth];
    tree.y = depth;
    nexts[depth] += 1;
    tree.children.forEach((child) => {
      minimum_ws(child, depth + 1);
    });
  };
  minimum_ws(tree);
  handleTree(tree);
  renderTree(tree);
};

export default useAlgorithm2;
