import { compileTpl } from '../util/template'
import { NodeType, RegexpStr, RenderType } from '../constants/constant'
import { getDotVal, depCopy, setObserveDotVal } from './object'
import {diff} from "./array";
import * as DomUtil from '../dom/domOp'
import { bindEvent } from '../dom/event'

export let renderInit = (Kmv) => {

    let watcher = Kmv.watchers;
    let data = Kmv.$data;
    let observeData = Kmv.data;

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
                    setObserveDotVal(observeData, kModel, this.value);
                }
                break;
            case RenderType.FOR:
                node.renderInit(Kmv);
                break;
            case RenderType.IF:
                let kIf = node.getAttribute("k-if");
                let val = getDotVal(data, kIf);
                if (val) {
                    DomUtil.showNode(node);
                } else {
                    DomUtil.hideNode(node);
                }
                node.kIf = kIf;
                break;
            case RenderType.ATTRIBUTE:
                let nAttr = node.nAttr;
                let kAttr = node.kAttr;
                let kOn = node.kOn;
                for (let i = 0; i < kAttr.length; i++) {
                    // k属性
                    let attr = kAttr[i].kAttr.replace(RegexpStr.kAttribute, '$1');
                    let val = compileTpl(kAttr[i].kAttrVal, data);
                    node.setAttribute(attr, val);
                }
                for (let i = 0; i < kOn.length; i++) {
                    // k-on事件
                    let event = kOn[i].kEvent.replace(RegexpStr.kOnAttribute, '$1');
                    let func = compileTpl(kOn[i].kFunc, data);
                    let match = func.match(RegexpStr.methodAndParam);
                    if (match) {
                        // 有参数 k-on:click = say() 或者 k-on:click = say('hello')
                        let method = match[1];
                        let params = match[2];
                        bindEvent(node, event, method, params, Kmv.methods, Kmv.data);
                    } else {
                        bindEvent(node, event, func, '', Kmv.methods, Kmv.data);
                    }
                    DomUtil.removeAttribute(node, kOn[i].kEvent);
                }
                for (let i = 0; i < nAttr.length; i++) {
                    // k属性
                    let attr = nAttr[i].nAttr.replace(RegexpStr.kAttribute, '$1');
                    let val = compileTpl(nAttr[i].nAttrVal, data);
                    node.setAttribute(attr, val);
                }
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
            case RenderType.IF:
                let kIf = node.kIf;
                let val = getDotVal(data, kIf);
                if (val) {
                    DomUtil.showNode(node);
                } else {
                    DomUtil.hideNode(node);
                }
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
