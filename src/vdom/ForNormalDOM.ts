import { compileTpl } from '../util/template'
import * as DomUtil from '../dom/domOp'
import { VDOM } from './VDOM'
import { ForDOM } from './ForDOM'
import { IfDOM } from './IfDOM'
import { InputDOM } from './InputDOM'
import { NodeType, RegexpStr } from "../constants/constant"

export class ForNormalDOM extends VDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    constructor (node) {
        // h3
        super(node);
        this.tagName = node.tagName, this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0)),
        this.nodeType = node.nodeType
        switch (node.nodeType) {
            case NodeType.TEXT:
                this.template = node.textContent;
                break;
            case NodeType.ELEMENT:
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
                                this.childrenVdom.push(new ForNormalDOM(child))
                            }
                        } else {
                            this.childrenVdom.push(new ForNormalDOM(child));
                        }
                    }
                }
                break;
        }
    }
    // iteratorObj 为遍历的数据，需要构造
    transDOM (iteratorObj, kmv) {
        let newEle = document.createElement(this.tagName) ;
        switch (this.nodeType) {
            case NodeType.TEXT:
                newEle = DomUtil.createTextNode(this.tagName);
                newEle.textContent = compileTpl(this.template, iteratorObj);
                this.$dom = newEle;
                break;
            case NodeType.ELEMENT:
                newEle = document.createElement(this.tagName);
                this.$dom = newEle;
                this.childrenVdom
                &&
                this.childrenVdom.forEach((child) => {
                    newEle.appendChild(child.transDOM(iteratorObj, kmv));
                });
                this.renderAttr(iteratorObj, kmv);
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
        switch (this.nodeType) {
            case NodeType.TEXT:
                DomUtil.changeTextContent(this.$dom, text)
                break;
            case NodeType.ELEMENT:
                this.childrenVdom.forEach((child) => {
                    child.reRender(data, kmv);
                })
                break;
        }
    }
}