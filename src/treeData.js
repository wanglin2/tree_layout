// 二叉树
export const binaryTreeData = {
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
export const treeData = {
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