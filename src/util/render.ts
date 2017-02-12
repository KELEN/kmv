import { compileTpl } from '../util/template'
import { RegexpStr, RenderType } from '../constants/constant'
import { getDotVal, setObserveDotVal } from './object'
import {diff} from "./array";
import * as DomUtil from '../dom/domOp'
import { bindEvent } from '../dom/event'

export let renderInit = (kmv) => {
    let watcher = kmv.watchers;
    let renderQueue = watcher.getQueue();
    for (let i = 0; i < renderQueue.length; i++) {
        let node = renderQueue[i];
        node.renderInit(kmv);
    }
}

export let reRender = (kmv, key) => {
    let renderQueue = kmv.watchers.getQueue();
    for (let i = 0; i < renderQueue.length; i++) {
        let node = renderQueue[i];
        node.reRender(kmv);
    }
}

export let reRenderFor = (kmv, forKey) => {
    let renderQueue = kmv.watchers.getQueue();
    let data = kmv.$data;
    for (let i = 0; i < renderQueue.length; i++) {
        let vnode = renderQueue[i];
        if (vnode.renderType == RenderType.FOR) {
            let arrKey = vnode.forObjectKey;
            let newArray = getDotVal(data, arrKey);
            let change = diff(vnode.arrayData, newArray);
            vnode.notifyDataChange(change, kmv);
        }
    }
}
