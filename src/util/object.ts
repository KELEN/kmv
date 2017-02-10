
import { RegexpStr } from '../constants/constant';

export let getDotVal = (obj, key) => {

    key = key.replace(RegexpStr.bracket, ".$1");		// 把arr['name']/arr["name"]/arr[0] 转为 arr.name/arr.0

    let val = obj, k;
    // 获取对应的dot值
    let arr = key.split(".") || [key];
    while (k = arr.shift()) {
        if (!val) {
            val = undefined;
            break;
        }
        val = val[k];
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
