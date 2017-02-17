import { compileTpl } from '../util/template'
import * as DomUtil from '../dom/domOp'
import { NodeType, RegexpStr } from "../constants/constant"
import { VDOM } from './VDOM'
import { ForDOM } from './ForDOM'
import { IfDOM } from './IfDOM'
import { InputDOM } from './InputDOM'

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
        this.tagName = node.tagName,
        this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0)),
        this.nodeType = node.nodeType;
        this.$dom = node;
        switch (node.nodeType) {
            case NodeType.TEXT:
                this.template = node.textContent;
                node.textContent = '';
                break;
            case NodeType.ELEMENT:
                this.template = node.firstChild ? node.firstChild.nodeValue: '';
                break;
        }
        if (node.childNodes) {
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
                        this.childrenVdom.push(new NormalDOM(child));
                    }
                } else {
                    this.childrenVdom.push(new NormalDOM(child));
                }
            }
        }
    }
    renderInit(data, kmv) {
        switch (this.nodeType) {
            case NodeType.TEXT:
                DomUtil.changeTextContent(this.$dom, compileTpl(this.template, data));
                break;
            case NodeType.ELEMENT:
                this.childrenVdom.forEach((child) => {
                    child.renderInit(data, kmv);
                });
                this.renderAttr(data, kmv);
                break;
        }
    }
    reRender (data, kmv) {
        let text = compileTpl(this.template, data);
        switch (this.nodeType) {
            case NodeType.TEXT:
                DomUtil.changeTextContent(this.$dom, text)
                break;
            case NodeType.ELEMENT:
                this.childrenVdom.forEach((child) => {
                    child.reRender(data, kmv);
                });
                this.reRenderAttr(data, kmv);
                break;
        }
    }
}