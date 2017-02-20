import * as ObjectUtil from '../util/object'
import { ArrayMethod } from '../constants/constant'
import { getDotVal } from "./object";
import {setObserveDotVal} from "./object";
import {depCopy} from "./object";

/**
 *   URL:
 *   说明:
 *   负责人: kelen
 *   日期:  1/24 0024.
 */
export let observer = (obj, kmv, key = '') => {
    let srcData = depCopy(obj);
    for (let i in obj) {
        let bigKey = key ? key + "." + i : i;
        if (typeof obj[i] == 'object') {
            if (Array.isArray(obj[i])) {
                arrayObserve(obj[i], kmv, bigKey);
            } else {
                observer(obj[i], kmv, bigKey);
            }
        } else {
            ((defVal) => {
                let val = defVal;
                Object.defineProperty(obj, i, {
                    set: function (newVal) {
                        // ObjectUtil.setObserveDotVal(kmv.$data, bigKey, newVal);
                        kmv.pendingValue = true;
                        kmv.changeQueue.push({
                            kmv: kmv,
                            bigKey: bigKey
                        });
                        kmv.watch[bigKey] && kmv.watch[bigKey].call(kmv.data, newVal);
                        val = newVal;
                    },
                    get: function() {
                        return val; // getDotVal(kmv.$data, bigKey) || defVal;
                    }
                })
            })(obj[i])
        }
    }
    return srcData;
}

function arrayObserve(arr, kmv, bigKey) {
    // 监听array操作
    ArrayMethod.forEach((method) => {
        Object.defineProperty(arr, method, {
            configurable: true,
            enumerable: false, // hide from for...in
            writable: true,
            value: function () {
                // 有可能操作的不是数组
                Array.prototype[method].apply(arr, arguments);
                kmv.changeQueue.push({
                    kmv: kmv,
                    bigKey: bigKey
                });
                kmv.pendingValue = true;
            }
        });
    });
}

