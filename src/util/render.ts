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
}

export let reRender = (kmv, key) => {
    if (kmv.timer) {
        clearTimeout(kmv.timer);
    }
    kmv.timer = setTimeout(() => {
        let renderQueue = kmv.renderQueue.getQueue();
        for (let i = 0; i < renderQueue.length; i++) {
            let node = renderQueue[i];
            node.reRender(kmv);
        }
    }, 10)
}

export let reRenderFor = (kmv, forKey) => {
    if (kmv.forTimer) {
        clearTimeout(kmv.forTimer);
    }
    kmv.forTimer = setTimeout(function () {
        let renderQueue = kmv.renderQueue.getQueue();
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
    });
}
