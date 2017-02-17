import * as DomUtil from "../dom/domOp"
import { ForNormalDOM } from './ForNormalDOM'
import { VDOM } from './VDOM'
import { ForDOM } from './ForDOM'
import { IfDOM } from './IfDOM'
import { InputDOM } from './InputDOM'
import { NodeType, RegexpStr } from "../constants/constant"

export class ForItemDOM extends VDOM {
    methods;
    tagName;
    templateNode;       // 模板节点, 每次构造时候需要获取template和attributes
    previousSibling;
    nextSibling;
    childrenVdom = [];
    attributes;
    $dom;
    template;
    nodeType;
    constructor (node) {
        super(node);
        for (let i = 0; i < node.childNodes.length; i++) {
            let child = node.childNodes[i];
            if (child.nodeType === NodeType.ELEMENT) {
                if (child.getAttribute("k-for")) {
                    this.childrenVdom.push(new ForDOM(child));
                } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                    this.childrenVdom.push(new InputDOM(child));
                } else if (child.getAttribute("k-if")) {
                    this.childrenVdom.push(new IfDOM(child));
                } else {
                    this.childrenVdom.push(new ForNormalDOM(child))
                }
            } else {
                this.childrenVdom.push(new ForNormalDOM(child));
            }
        }
        node.removeAttribute("k-for");
        this.tagName = node.tagName;
        this.templateNode = node;
        this.attributes = node.attributes;
        this.nodeType = node.nodeType;
    }
    transDOM(iteratorObj, kmv) {
        let newElem = DomUtil.createElement(this.tagName);
        for (let i = 0, len = this.childrenVdom.length; i < len; i++) {
            let childVdom = this.childrenVdom[i];
            newElem.appendChild(childVdom.transDOM(iteratorObj, kmv));
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