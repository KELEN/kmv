import { compileTpl } from '../util/template'
import * as DomOp from '../dom/domOp'
import { NodeType, RegexpStr } from "../constants/constant"
import { VDOM } from './VDOM'
import { ForDOM } from './ForDOM'
import { InputDOM } from './InputDOM'
import { isUnknowElement } from '../util/validator'
import { ComponentDOM } from './ComponentDOM'
import { getDotVal } from "../util/object";
import {renderInit} from "../util/render";

export class NormalDOM extends VDOM {
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    kif;
    kshow;
    // 第三个参数传递给子组件的数据
    constructor (node, kmv, parentData = {}) {
        super(node);
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
                break;
        }
        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let child = node.childNodes[i];
                if (child.nodeType === NodeType.ELEMENT) {
                    if (isUnknowElement(child.tagName)) {
                        this.childrenVdom.push(new ComponentDOM(child, kmv, parentData));
                    } else {
                        if (child.getAttribute("k-for")) {
                            this.childrenVdom.push(new ForDOM(child, kmv));
                        } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                            this.childrenVdom.push(new InputDOM(child));
                        } else {
                            this.childrenVdom.push(new NormalDOM(child, kmv, parentData));
                        }
                    }
                } else {
                    this.childrenVdom.push(new NormalDOM(child, kmv));
                }
            }
        }
    }
    renderInit(data, kmv, component = null) {
        switch (this.nodeType) {
            case NodeType.TEXT:
                DomOp.changeTextContent(this.$dom, compileTpl(this.template, data));
                break;
            case NodeType.ELEMENT:
                if (this.kshow) {
                    let isShow = getDotVal(data, this.kshow);
                    this.$dom.style.display = !!isShow ? "block" : "none";
                }
                if (this.kif) {
                    let isIf = getDotVal(data, this.kif);
                    if (!isIf) DomOp.replaceNode(this.$dom, this.$emptyComment);
                }
                this.childrenVdom.forEach((child) => {
                    child.renderInit(data, kmv, component);
                });
                this.renderAttr(data, kmv, component);
                break;
        }
    }
    reRender (data, kmv) {
        let text = compileTpl(this.template, data);
        switch (this.nodeType) {
            case NodeType.TEXT:
                let stext = DomOp.getTextContent(this.$dom);  // 原文本
                stext != text && DomOp.changeTextContent(this.$dom, text)
                break;
            case NodeType.ELEMENT:
                if (this.kshow) {
                    let isShow = getDotVal(data, this.kshow);
                    this.$dom.style.display = !!isShow ? "block" : "none";
                }
                if (this.kif) {
                    let isIf = getDotVal(data, this.kif);
                    if (!isIf) DomOp.replaceNode(this.$dom, this.$emptyComment);
                    else DomOp.replaceNode(this.$emptyComment, this.$dom);
                }
                this.childrenVdom.forEach((child) => {
                    child.reRender(data, kmv);
                });
                this.reRenderAttr(data, kmv);
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
            console.log(child);
            this.$dom.appendChild(child.transDOM(data, kmv));
        });
        return this.$dom;
    }
}