
import { RegexpStr } from '../constants/constant';

export let getDotVal = (obj, key) => {
    let val, k;

    if (key) {

        key = key.replace(RegexpStr.bracket, ".$1");		// 把arr['name']/arr["name"]/arr[0] 转为 arr.name/arr.0

        val = obj;
        // 获取对应的dot值
        let arr = key.split(".") || [key];
        while (k = arr.shift()) {
            if (!val) {
                val = undefined;
                break;
            }
            val = val[k];
        }

    }

    return val;
}

export let depCopy = (obj) => {
    let newObj = {};
    for (let i in obj) {
        if (typeof obj[i] === 'object') {
            if (Array.isArray(obj[i])) {
                newObj[i] = obj[i].slice(0);
            } else {
                newObj[i] = depCopy(obj[i]);
            }
        } else {
            newObj[i] = obj[i];
        }
    }
    return newObj;
}


export let setObserveDotVal = (observeData, key, val) => {
    key = key.replace(RegexpStr.bracket, ".$1");		// 把arr['name']/arr["name"]/arr[0] 转为 arr.name/arr.0
    let tmp = observeData;
    let arr = key.split(".");
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        tmp = tmp[arr[i]];
    }

    tmp[arr[len - 1]] = val;
}