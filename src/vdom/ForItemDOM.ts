import * as DomUtil from "../dom/domOp"
import { ForNormalDOM } from './ForNormalDOM'
import { VDOM } from './VDOM'
import { ForDOM } from './ForDOM'
import { IfDOM } from './IfDOM'
import { InputDOM } from './InputDOM'
import { NodeType, RegexpStr } from "../constants/constant"
import {isUnknowElement} from "../util/validator";
import {ComponentDOM} from "./ComponentDOM";

export class ForItemDOM extends VDOM {
    tagName;
    templateNode;       // 模板节点, 每次构造时候需要获取template和attributes
    childrenVdom = [];
    attributes;
    $dom;
    template;
    nodeType;
    constructor (node, kmv, parentData = {}) {
        super(node);
        this.tagName = node.tagName;
        this.attributes = node.attributes;
        this.nodeType = node.nodeType;
        this.templateNode = node;
        for (let i = 0; i < node.childNodes.length; i++) {
            let child = node.childNodes[i];
            if (child.nodeType === NodeType.ELEMENT) {
                if (isUnknowElement(child.tagName)) {
                    this.childrenVdom.push(new ComponentDOM(child, kmv, parentData));
                } else {
                    if (child.getAttribute("k-for")) {
                        this.childrenVdom.push(new ForDOM(child, kmv, parentData));
                    } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                        this.childrenVdom.push(new InputDOM(child));
                    } else if (child.getAttribute("k-if")) {
                        this.childrenVdom.push(new IfDOM(child));
                    } else {
                        this.childrenVdom.push(new ForNormalDOM(child, kmv, parentData))
                    }
                }
            } else if (child.nodeType === NodeType.TEXT) {
                this.childrenVdom.push(new ForNormalDOM(child, kmv, kmv.$data));
            }
        }
        node.removeAttribute("k-for");
    }
    transDOM(iteratorObj, kmv) {
        let newElem = DomUtil.createElement(this.tagName);
        for (let i = 0, len = this.childrenVdom.length; i < len; i++) {
            let childVdom = this.childrenVdom[i];
            let newDom = childVdom.transDOM(iteratorObj, kmv);
            newDom && newElem.appendChild(newDom);
        }
        this.$dom = newElem;
        this.renderAttr(iteratorObj, kmv);
        return newElem;
    }
    // 重新渲染
    reRender (iteratorObj, kmv) {
        this.childrenVdom.forEach((child) => {
            child.reRender(iteratorObj, kmv);
        });
        this.reRenderAttr(iteratorObj, kmv);
    }
}