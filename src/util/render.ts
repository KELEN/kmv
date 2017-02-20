import { RenderType } from '../constants/constant'
import { getDotVal } from './object'
import { diff } from "./array";

export let renderInit = (kmv) => {
    let watcher = kmv.renderQueue;
    let renderQueue = watcher.getQueue();
    for (let i = 0; i < renderQueue.length; i++) {
        let node = renderQueue[i];
        node.renderInit(kmv.data, kmv);
    }
    nextTick(kmv);
}

let nextTickHandler = (kmv) => {
    if (kmv.pendingValue) {
        console.log("reRender");
        kmv.pendingValue = false;
        let lastOne = kmv.changeQueue.pop();
        lastOne && reRender(lastOne.kmv, lastOne.bigKey);
        kmv.changeQueue.length = 0;
    }
    nextTick(kmv);
}

export let nextTick = (kmv) => {
    setTimeout(function() {
        // 下一次事件循环
        nextTickHandler(kmv);
    }, 0);
}

export let reRender = (kmv, key) => {
    let renderQueue = kmv.renderQueue.getQueue();
    for (let i = 0; i < renderQueue.length; i++) {
        let node = renderQueue[i];
        node.reRender(kmv.data, kmv);
    }
}

