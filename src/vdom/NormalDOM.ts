import { compileTpl } from '../util/template'
import * as DomUtil from '../dom/domOp'
import { NodeType } from "../constants/constant"
import { VDOM } from './VDOM';

export class NormalDOM extends VDOM {
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
        this.nodeType = node.nodeType;
        this.$dom = node;
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
                this.childrenVdom.push(new NormalDOM(child))
            }
        }
    }
    renderInit(kmv) {
        let data = kmv.$data;
        switch (this.nodeType) {
            case NodeType.TEXT:
                DomUtil.changeTextContent(this.$dom, compileTpl(this.template, data));
                break;
            case NodeType.ELEMENT:
                this.childrenVdom.forEach((child) => {
                    child.renderInit(kmv);
                });
                break;
        }
        this.renderAttr(kmv);
    }
    reRender (kmv) {
        let data = kmv.$data;  // $$data迭代的每一个对象
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