import { treeData } from './treeData';
import { deepCopy } from "./utils";
import { NODE_SPACE, renderTree } from './render';

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

export default useAlgorithm2