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
    kif;
    kshow;
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
    transDOM (iteratorObj, kmv, component =  {}) {
        let newEle = document.createElement(this.tagName) ;
        if (this.kif) {
            let isShow = getDotVal(iteratorObj, this.kif);
            if (!!isShow) {
                this.$dom.style.display = "block";
            } else {
                this.$dom.style.display = "none";
            }
        }
        switch (this.nodeType) {
            case NodeType.TEXT:
                newEle = DomOp.createTextNode(this.tagName);
                newEle.textContent = compileTpl(this.template, iteratorObj);
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
                        child.parentNode = newEle;
                        child.renderInit(iteratorObj, kmv)
                    } else {
                        newEle.appendChild(child.transDOM(iteratorObj, kmv, component));
                    }

                });
                this.renderAttr(iteratorObj, kmv, component);
                break;
        }
        return newEle;
    }
    /**
     * @param data      渲染的数据
     * @param kmv       kmv
     */
    reRender (data, kmv) {
        let text = compileTpl(this.template, data);
        if (this.kif) {
            let isShow = getDotVal(data, this.kif);
            if (!!isShow) {
                this.$dom.style.display = "block";
            } else {
                this.$dom.style.display = "none";
            }
        }
        switch (this.nodeType) {
            case NodeType.TEXT:
                DomOp.changeTextContent(this.$dom, text)
                break;
            case NodeType.ELEMENT:
                this.childrenVdom.forEach((child) => {
                    console.log(child);
                    if (child instanceof ForDOM) {
                        // 嵌套for
                        console.log(data);
                        child.reRender(data, kmv)
                    } else {
                        child.reRender(data, kmv);
                    }
                })
                break;
        }
    }
}