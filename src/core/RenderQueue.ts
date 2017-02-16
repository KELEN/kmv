import { NodeType, RegexpStr } from '../constants/constant'
import { ForDOM } from "../vdom/ForDOM"
import { NormalDOM } from "../vdom/NormalDOM"
import { InputDOM } from "../vdom/InputDOM"
import { IfDOM } from "../vdom/IfDOM"
import { isUnknowElement } from '../util/validator'
import {ComponentDOM} from "../vdom/ComponentDOM";

export class RenderQueue {
    queue = [];
    kmv;
    constructor(node, kmv) {
        this.kmv = kmv;
        this.queue = this.queueInit(node);
    }
    getQueue() {
        return this.queue;
    }
    queueInit (parentNode) {
        let childNodes = parentNode.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            let child = childNodes[i];
            switch (child.nodeType) {
                case NodeType.TEXT:
                    this.queue.push(new NormalDOM(child));
                    break;
                case NodeType.ELEMENT:
                    if (isUnknowElement(child.tagName)) {
                        // 组件
                        this.queue.push(new ComponentDOM(child, this.kmv).transNormalDOM());
                    } else {
                        if (child.getAttribute("k-for")) {
                            this.queue.push(new ForDOM(child));
                        } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                            this.queue.push(new InputDOM(child));
                        } else if (child.getAttribute("k-if")) {
                            this.queue.push(new IfDOM(child));
                        } else {
                            this.queue.push(new NormalDOM(child));
                        }
                    }
                    break;
            }
        }
        return this.queue;
    }
}

