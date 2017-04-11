import { compileTpl } from '../util/template'
import * as DomOp from '../dom/domOp'
import { VDOM } from './VDOM'
import { ForDOM } from './ForDOM'
import { InputDOM } from './InputDOM'
import { NodeType, RegexpStr } from "../constants/constant"
import { isUnknowElement } from '../util/validator'
import { ComponentDOM } from './ComponentDOM'
import {getDotVal} from "../util/object";

export class ForNormalDOM extends VDOM {
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    constructor (node, kmv, parentData = {}) {
        // h3
        super(node);
        this.tagName = node.tagName;
        this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0));
        this.nodeType = node.nodeType;
        switch (node.nodeType) {
            case NodeType.TEXT:
                this.template = node.textContent;
                break;
            case NodeType.ELEMENT:
                this.kshow = node.getAttribute("k-show");
                if (node.childNodes) {
                    for (let i = 0; i < node.childNodes.length; i++) {
                        let child = node.childNodes[i];
                        if (child.nodeType === NodeType.ELEMENT) {
                            if (child.getAttribute("k-for")) {
                                this.childrenVdom.push(new ForDOM(child, kmv, parentData));
                            } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                                this.childrenVdom.push(new InputDOM(child));
                            } else {
                                this.childrenVdom.push(new ForNormalDOM(child, kmv, parentData))
                            }
                        } else {
                            this.childrenVdom.push(new ForNormalDOM(child, kmv, parentData));
                        }
                    }
                }
                break;
        }
    }
    // iteratorObj 为遍历的数据，需要构造, 第三个组件实例
    transDOM (data, kmv, component: any =  null) {
        let newEle = document.createElement(this.tagName) ;
        switch (this.nodeType) {
            case NodeType.TEXT:
                newEle = DomOp.createTextNode(this.tagName);
                let text;
                if (component) {
                    text = compileTpl(this.template, component.$data);
                } else {
                    text = compileTpl(this.template, data);
                }
                newEle.textContent = text;
                this.$dom = newEle;
                break;
            case NodeType.ELEMENT:
                newEle = document.createElement(this.tagName);
                this.$dom = newEle;
                this.childrenVdom
                &&
                this.childrenVdom.forEach((child) => {
                    if (child instanceof ForDOM) {
                        // 嵌套for
                        child.parentNode = newEle;  // 嵌套父节点必须重新更新
                        child.nextSibling = newEle.previousSibling;
                        child.renderInit(data, kmv)
                    } else {
                        newEle.appendChild(child.transDOM(data, kmv, component));
                    }

                });
                this.renderAttr(data, kmv, component);
                break;
        }
        return newEle;
    }
    /**
     * @param data      渲染的数据
     * @param kmv       kmv
     */
    reRender (data, kmv, component) {
        switch (this.nodeType) {
            case NodeType.TEXT:
                // 组件存在就用组件的数据去渲染
                // component && (data = component.$data);
                let text = compileTpl(this.template, data);
                DomOp.changeTextContent(this.$dom, text)
                break;
            case NodeType.ELEMENT:
                this.childrenVdom.forEach((child) => {
                    if (child instanceof ForDOM) {
                        // 嵌套for
                        child.reRender(data, kmv, component)
                    } else {
                        child.reRender(data, kmv, component);
                        this.reRenderAttr(data, kmv, component);
                    }
                })
                break;
        }
    }
}