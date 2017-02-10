import { NodeType, RegexpStr, RenderType } from '../constants/constant'
import { isKvmAttribute } from './validator'
import * as VirtualDOM from "../vdom/vdom"

export class Watcher {
    queue = [];
    constructor(node) {
        this.queue = this.queueInit(node);
    }
    getQueue() {
        return this.queue;
    }
    queueInit (node) {
        let childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            let child = childNodes[i];
            switch (child.nodeType) {
                case NodeType.TEXT:
                    let nodeValue = child.nodeValue;
                    if (RegexpStr.brace.test(nodeValue)) {
                        child.renderType = RenderType.TEXT;
                        child.template = nodeValue;
                        this.queue.push(child);
                    }
                    break;
                case NodeType.ELEMENT:
                    if (child.getAttribute("k-for")) {
                        // 转为虚拟dom
                        let vdom = new VirtualDOM.ForDOM(child);
                        vdom.renderType = RenderType.FOR;
                        this.queue.push(vdom);
                        child.parentNode.removeChild(child);    // 移除自身元素
                    } else if (child.getAttribute("k-if")) {
                        child.renderType = RenderType.IF;
                        this.queue.push(child);
                    } else if (child.getAttribute("k-model")) {
                        let attrs = child.attributes;
                        for (let n = 0; n < attrs.length; n++) {
                            let attr = attrs[n];
                            if (isKvmAttribute(attr.nodeName, attr.nodeValue)) {
                                child.renderType = RenderType.INPUT;
                                this.queue.push(child);
                                break;
                            }
                        }
                    } else {
                        let attrs = child.attributes;
                        child.nAttr = [];           // 常规属性
                        child.kAttr = [];           // k属性
                        child.kOn = [];           // k-on属性
                        for (let n = 0; n < attrs.length; n++) {
                            let attr = attrs[n];
                            if (isKvmAttribute(attr.nodeName, attr.nodeValue)) {
                                child.renderType = RenderType.ATTRIBUTE;
                                if (RegexpStr.kAttribute.test(attr.nodeName)) {
                                    child.kAttr.push({
                                        kAttr: attr.nodeName,
                                        kAttrVal: attr.nodeValue
                                    })
                                    child.removeAttribute(attr.nodeName);
                                } else if (RegexpStr.kOnAttribute.test(attr.nodeName)) {
                                    child.kOn.push({
                                        kEvent: attr.nodeName,
                                        kFunc: attr.nodeValue
                                    })
                                } else {
                                    //
                                    child.nAttr.push({
                                        nAttr: attr.nodeName,
                                        nAttrVal: attr.nodeValue
                                    })
                                }
                            }
                        }
                        if (child.renderType === RenderType.ATTRIBUTE) this.queue.push(child);
                    }

                    break;
            }
            if (child.childNodes.length) {
                this.queue.concat(this.queueInit(child));
            }
        }
        return this.queue;
    }
}

