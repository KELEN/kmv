import { compileTpl } from '../util/template'
import * as DomUtil from '../dom/domOp'
import { NodeType } from "../constants/constant";

export class NormalDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    children = [];
    constructor (node) {
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
                this.children.push(new NormalDOM(child))
            }
        }
    }
    transDOM (Kmv) {
        let data = Kmv.$data;
        let newEle;
        switch (this.nodeType) {
            case NodeType.TEXT:
                newEle = DomUtil.createTextNode(this.tagName);
                newEle.textContent = compileTpl(this.template, data);
                break;
            case NodeType.ELEMENT:
                newEle = document.createElement(this.tagName);
                newEle.template = this.template;
                let text = compileTpl(this.template, data);
                newEle.innerText = text;
                DomUtil.copyAttr(newEle, this.attributes, Kmv);
                break;
        }
        return newEle;
    }
    reRender (Kmv, parentNode) {
        let data = Kmv.$data;
        let text = compileTpl(this.template, data);
        switch (this.nodeType) {
            case NodeType.TEXT:
                DomUtil.changeTextContent(parentNode, text)
                break;
            case NodeType.ELEMENT:
                // DomUtil.changeNodeValue(this.dom, text)
                break;
        }
    }
}