import { binaryTreeData } from './treeData';
import { deepCopy } from "./utils";
import { NODE_SPACE_X, renderbinaryTreeData } from './render';

// 算法1
const useAlgorithm1 = () => {
    const tree = deepCopy(binaryTreeData);
    let i = NODE_SPACE_X;
    const knuth_layout = (tree, depth) => {
        if (tree.left_child) {
            knuth_layout(tree.left_child, depth + 1);
        }
        tree.x = i;
        tree.y = depth * NODE_SPACE_X + NODE_SPACE_X;
        i += NODE_SPACE_X;
        if (tree.right_child) {
            knuth_layout(tree.right_child, depth + 1);
        }
    };
    knuth_layout(tree, 0);
    renderbinaryTreeData(tree);
};

export default useAlgorithm1