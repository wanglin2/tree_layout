import { treeData } from './treeData';
import { deepCopy } from "./utils";
import { renderTree, handleTree } from './render';

// 算法3
const useAlgorithm3 = () => {
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
    const setup = (tree, depth = 0, nexts = {}, offset = {}) => {
        tree.children.forEach((child) => {
            setup(child, depth + 1, nexts, offset);
        });
        // 设置y坐标为节点深度
        tree.y = depth;
        let place;
        let childrenLength = tree.children.length
        if (childrenLength <= 0) {
            // 没有子节点
            place = nexts[depth] || 0;
            tree.x = place;
        } else if (childrenLength === 1) {
            // 只有一个子节点
            place = tree.children[0].x - 1;
        } else {
            // 有两个子节点
            let s = tree.children[0].x + tree.children[1].x;
            place = s / 2;
        }
        offset[depth] = Math.max(offset[depth] || 0, (nexts[depth] || 0) - place);
        if (childrenLength > 0) {
            tree.x = place + offset[depth];
        }
        if (nexts[depth] === undefined) {
            nexts[depth] = 0;
        }
        // 让父节点居中，所以加2
        nexts[depth] += 2;
        tree.mod = offset[depth];
    };
    const addmods = (tree, modsum = 0) => {
        tree.x = tree.x + modsum;
        modsum += tree.mod;
        tree.children.forEach((child) => {
            addmods(child, modsum);
        });
    };
    const layout = (tree) => {
        setup(tree);
        addmods(tree);
        return tree;
    };
    let tree = new DrawTree(deepCopy(treeData));
    tree = layout(tree);
    handleTree(tree)
    renderTree(tree);
};

export default useAlgorithm3