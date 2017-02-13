import { RenderType } from '../constants/constant'
import { getDotVal } from './object'
import { diff } from "./array";

export let renderInit = (kmv) => {
    let watcher = kmv.renderQueue;
    let renderQueue = watcher.getQueue();
    for (let i = 0; i < renderQueue.length; i++) {
        let node = renderQueue[i];
        node.renderInit(kmv);
    }
    nextTick(kmv);
}

export let nextTick = (kmv) => {
    setTimeout(function() {
        if (kmv.pendingValue) {
            console.log("reRender");
            kmv.pendingValue = false;
            let lastOne = kmv.changeQueue.pop();
            reRender(lastOne.kmv, lastOne.bigKey);
            kmv.changeQueue.length = 0;
        }
        if (kmv.pendingArray) {
            console.log("reRenderFor")
            kmv.pendingArray = false;
            let lastOne = kmv.changeQueue.pop();
            reRenderFor(lastOne.kmv, lastOne.bigKey);
            kmv.changeQueue.length = 0;
        }
        // 下一次事件循环
        nextTick(kmv);
    }, 0);
}

export let reRender = (kmv, key) => {
    let renderQueue = kmv.renderQueue.getQueue();
    for (let i = 0; i < renderQueue.length; i++) {
        let node = renderQueue[i];
        node.reRender(kmv);
    }
}

export let reRenderFor = (kmv, forKey) => {
    let renderQueue = kmv.renderQueue.getQueue();
    let data = kmv.$data;
    for (let i = 0; i < renderQueue.length; i++) {
        let vnode = renderQueue[i];
        if (vnode.renderType == RenderType.FOR) {
            let arrKey = vnode.forObjectKey;
            let newArray = getDotVal(data, arrKey);
            if (Array.isArray(newArray)) {
                let change = diff(vnode.iteratorData, newArray);
                vnode.notifyDataChange(change, kmv);
            } else {
                vnode.notifyDataChange(null, kmv);
            }
        }
    }
}
