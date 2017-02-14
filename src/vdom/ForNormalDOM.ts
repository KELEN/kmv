import { compileTpl } from '../util/template'
import * as DomUtil from '../dom/domOp'
import { NodeType } from "../constants/constant"
import { isKvmAttribute } from '../util/validator'
import { RegexpStr } from '../constants/constant'
import { bindEvent } from "../dom/event"
import { VDOM } from "./VDOM";

export class ForNormalDOM extends VDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    constructor (node) {
        super(node);
        // h3
        this.tagName = node.tagName, this.attributes = node.attributes,
        this.nodeType = node.nodeType
        switch (node.nodeType) {
            case NodeType.TEXT:
                this.template = node.textContent;
                break;
            case NodeType.ELEMENT:
                this.template = node.firstChild.nodeValue;
                break;
        }
        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let child = node.childNodes[i];
                this.childrenVdom.push(new ForNormalDOM(child))
            }
        }
    }
    transDOM (kmv) {
        let data = kmv.$$data;
        let newEle = document.createElement(this.tagName) ;
        switch (this.nodeType) {
            case NodeType.TEXT:
                newEle = DomUtil.createTextNode(this.tagName);
                newEle.textContent = compileTpl(this.template, data);
                this.$dom = newEle;
                break;
            case NodeType.ELEMENT:
                newEle = document.createElement(this.tagName);
                this.$dom = newEle;
                this.childrenVdom
                &&
                this.childrenVdom.forEach((child) => {
                    newEle.appendChild(child.transDOM(kmv));
                });
                this.renderAttr(kmv);
                break;
        }
        this.renderAttr(kmv);
        return newEle;
    }
    reRender (kmv) {
        let data = kmv.$$data;  // $$data迭代的每一个对象
        let text = compileTpl(this.template, data);
        switch (this.nodeType) {
            case NodeType.TEXT:
                DomUtil.changeTextContent(this.$dom, text)
                break;
            case NodeType.ELEMENT:
                this.childrenVdom.forEach((child) => {
                    child.reRender(kmv);
                })
                break;
        }
    }
}