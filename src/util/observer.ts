import * as ObjectUtil from '../util/object'
import {reRender, reRenderFor} from "./render";
import { ArrayMethod } from '../constants/constant'
import * as DomUtil from './domOp'
import {compileTpl} from "./template";
import {getDotVal} from "./object";
/**
 *   URL:
 *   说明:
 *   负责人: kelen
 *   日期:  1/24 0024.
 */
export let observer = (obj, kmv, key = '') => {
    let newObj = ObjectUtil.depCopy(obj);
    for (let i in obj) {
        if (typeof obj[i] == 'object') {
            let bigKey = key ? key + "." + i : i;
            if (Array.isArray(obj[i])) {
                arrayObserve(obj[i], kmv, bigKey);
            } else {
                observer(obj[i], kmv, bigKey);
            }
        } else {
            Object.defineProperty(obj, i, {
                set: function (newVal) {
                    newObj[i] = newVal;
                    reRender(kmv, i);
                }
            })
        }
    }
    return newObj;
}

function arrayObserve(arr, kmv, bigKey) {

    let timer;

    ArrayMethod.forEach((method) => {
        Object.defineProperty(arr, method, {
            configurable: false,
            enumerable: false, // hide from for...in
            writable: false,
            value: function () {
                Array.prototype[method].apply(getDotVal(kmv.$data, bigKey), arguments);
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    reRenderFor(kmv, bigKey)
                }, 10)
            }
        });
    })



    /*arr.push = function() {
        Array.prototype.push.apply(getDotVal(kmv.$data, bigKey), arguments);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            reRenderFor(kmv, bigKey)
        }, 10)
    }

    arr.pop = function () {
        Array.prototype.pop.apply(getDotVal(kmv.$data, bigKey), arguments);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            reRenderFor(kmv, bigKey)
        }, 10)
    }

    arr.shift = function () {
        Array.prototype.shift.apply(getDotVal(kmv.$data, bigKey), arguments);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            reRenderFor(kmv, bigKey);
        }, 10)
    }

    arr.unshift = function () {
        Array.prototype.unshift.apply(getDotVal(kmv.$data, bigKey), arguments);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            reRenderFor(kmv, bigKey)
        }, 10)
    }

    arr.splice = function () {
        Array.prototype.splice.apply(getDotVal(kmv.$data, bigKey), arguments);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            reRenderFor(kmv, bigKey)
        }, 10)
    }

    arr.sort =function () {
        Array.prototype.sort.apply(getDotVal(kmv.$data, bigKey), arguments);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            reRenderFor(kmv, bigKey)
        }, 10)
    };*/
}

