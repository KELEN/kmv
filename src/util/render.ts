import { compileTpl } from '../util/template'
import { NodeType, RegexpStr, RenderType } from '../constants/constant'
import {getDotVal, depCopy} from './object'
import {diff} from "./array";

export let renderInit = (watcher, data, observeData) => {

    let renderQueue = watcher.getQueue();
    for (let i = 0; i < renderQueue.length; i++) {
        let node = renderQueue[i];
        switch (node.renderType) {
            case RenderType.TEXT:
                let template = node.template;
                let text = compileTpl(template, data);
                node.nodeValue = text;
                break;
            case RenderType.INPUT:
                let kModel = node.getAttribute("k-model");
                node.value = getDotVal(data, kModel);
                node.oninput = function() {
                    observeData[kModel] = this.value;
                }
                break;
            case RenderType.FOR:
                node.renderInit(data);
                break;
        }

    }
}

export let reRender = (kmv, key) => {
    let renderQueue = kmv.watchers.getQueue();
    let data = kmv.$data;
    for (let i = 0; i < renderQueue.length; i++) {
        let node = renderQueue[i];
        switch (node.renderType) {
            case RenderType.TEXT:
                let template = node.template;
                node.nodeValue = compileTpl(template, data);
                break;
            case RenderType.FOR:
                node.reRenderList(data);
                break;
        }
    }
}

export let reRenderFor = (kmv, forKey) => {
    let renderQueue = kmv.watchers.getQueue();
    let data = kmv.$data;
    for (let i = 0; i < renderQueue.length; i++) {
        let node = renderQueue[i];
        if (node.renderType == RenderType.FOR) {
            let vdom = node.vdom;
            let arrKey = vdom.forObjectKey;
            let newArray = getDotVal(data, arrKey);
            let change = diff(vdom.arrayData, newArray);
            node.reRender(change, data);
        }
    }
}
