import { compileTpl } from '../util/template'
import * as DomUtil from '../dom/domOp'
import { NodeType, RegexpStr } from "../constants/constant"
import { VDOM } from './VDOM'
import { ForDOM } from './ForDOM'
import { IfDOM } from './IfDOM'
import { InputDOM } from './InputDOM'
import { isUnknowElement } from '../util/validator'
import { ComponentDOM } from './ComponentDOM'

export class NormalDOM extends VDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    // 第三个参数传递给子组件的数据
    constructor (node, kmv) {
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
        }
        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let child = node.childNodes[i];
                if (child.nodeType === NodeType.ELEMENT) {
                    if (isUnknowElement(child.tagName)) {
                        this.childrenVdom.push(new ComponentDOM(child, kmv));
                    } else {
                        if (child.getAttribute("k-for")) {
                            this.childrenVdom.push(new ForDOM(child, kmv));
                        } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                            this.childrenVdom.push(new InputDOM(child));
                        } else if (child.getAttribute("k-if")) {
                            this.childrenVdom.push(new IfDOM(child, kmv));
                        } else {
                            this.childrenVdom.push(new NormalDOM(child, kmv));
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
                DomUtil.changeTextContent(this.$dom, compileTpl(this.template, data));
                break;
            case NodeType.ELEMENT:
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