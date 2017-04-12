import { compileTpl } from '../util/template'
import * as DomOp from '../dom/domOp'
import { NodeType, RegexpStr } from "../constants/constant"
import { VDOM } from './VDOM'
import { ForDOM } from './ForDOM'
import { InputDOM } from './InputDOM'
import { isUnknowElement } from '../util/validator'
import { ComponentDOM } from './ComponentDOM'
import { getDotVal } from "../util/object";
import { renderInit } from "../util/render";

export class NormalDOM extends VDOM {
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    // 第三个参数传递给子组件的数据
    constructor (node, kmv, parentData: any = {}) {
        super(node);
        switch (node.nodeType) {
            case NodeType.TEXT:
                this.template = node.textContent;
                node.textContent = '';
                break;
            case NodeType.ELEMENT:
                break;
        }
        this.tagName = node.tagName,
        this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0)),
        this.nodeType = node.nodeType;
        this.$dom = node;
        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let child = node.childNodes[i];
                if (child.nodeType === NodeType.ELEMENT) {
                    if (child.getAttribute("k-for")) {
                        this.childrenVdom.push(new ForDOM(child, kmv, parentData));
                    } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                        this.childrenVdom.push(new InputDOM(child));
                    } else if (isUnknowElement(child.tagName)) {
                        this.childrenVdom.push(new ComponentDOM(child, kmv, parentData));
                    } else {
                        this.childrenVdom.push(new NormalDOM(child, kmv, parentData));
                    }
                } else {
                    this.childrenVdom.push(new NormalDOM(child, kmv, parentData));
                }
            }
        }
    }
    renderInit(data, kmv, component: ComponentDOM = null) {
        switch (this.nodeType) {
            case NodeType.TEXT:
                let text;
                if (component) {
                    text = compileTpl(this.template, component.$data);
                } else {
                    text = compileTpl(this.template, data);
                }
                DomOp.changeTextContent(this.$dom, text);
                break;
            case NodeType.ELEMENT:
                this.childrenVdom.forEach((child) => {
                    child.renderInit(data, kmv, component);
                });
                this.renderAttr(data, kmv, component);
                break;
        }
    }
    reRender (data, kmv, component) {
        console.log(1);
        switch (this.nodeType) {
            case NodeType.TEXT:
                let text;
                if (component) {
                    text = compileTpl(this.template, component.$data);
                } else {
                    text = compileTpl(this.template, data);
                }
                text && DomOp.changeTextContent(this.$dom, text)
                break;
            case NodeType.ELEMENT:
                this.childrenVdom.forEach((child) => {
                    child.reRender(data, kmv, component);
                });
                this.reRenderAttr(data, kmv, component);
                break;
        }
    }
    insertNewDOM (newDom) {
        if (this.nextSibling) {
            DomOp.insertBefore(this.nextSibling, newDom);
        } else if (this.parentNode) {
            DomOp.appendChild(this.parentNode, newDom);
        }
    }
    transDOM (data, kmv) {
        this.renderInit(data, kmv);
        this.childrenVdom.forEach((child) => {
            this.$dom.appendChild(child.transDOM(data, kmv));
        });
        return this.$dom;
    }
}