// 深拷贝
export const deepCopy = (data) => {
    return JSON.parse(JSON.stringify(data));
};