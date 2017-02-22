import { ArrayOp } from "../constants/constant"

export let diff = (arr1 = [], arr2 = []) => {
    let change = [];
    let cp = arr1.slice(0), cp2 = arr2.slice(0);        // 拷贝一份
    let len1 = arr1.length, len2 = arr2.length;
    let len = Math.min(len1, len2);
    for (let i = 0; i < len; i++) {
        console.log(arr1[i], arr2[i])
        if (arr1[i] !== arr2[i]) {
            change.push({
                op: ArrayOp.CHANGE,
                index: i,
                text: arr2[i]
            })
        }
    }
    if (len1 > len2) {
        let deleteArr = arr1.slice(len2);
        // 删除dom
        for (let i = 0; i < deleteArr.length; i++) {
            change.push({
                op: ArrayOp.POP,
                index: i + len2,
                text: deleteArr[i]
            })
        }
    } else if (len2 > len1) {
        let addArr = arr2.slice(len1);
        change.push({
            batch: true,
            op: ArrayOp.PUSH,
            array: addArr
        })
    }
    return change;
}
