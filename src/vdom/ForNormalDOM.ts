import { compileTpl } from '../util/template'
import * as DomUtil from '../dom/domOp'
import { NodeType } from "../constants/constant"
import { isKvmAttribute } from '../util/validator'
import { RegexpStr } from '../constants/constant'
import { bindEvent } from "../dom/event"

export class ForNormalDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
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
                this.childrenVdom.push(new ForNormalDOM(child))
            }
        }
    }
    renderAttr(kmv) {
        if (this.nodeType === NodeType.ELEMENT) {
            let data = kmv.data;
            let node = this.$dom;
            for (let i = 0; i < this.attributes.length; i++) {
                let attr = this.attributes[i];
                let attrName = attr.nodeName, attrVal = attr.nodeValue;
                if (isKvmAttribute(attrName, attrVal)) {
                    if (RegexpStr.kAttribute.test(attrName)) {
                        let key = attr.nodeName.replace(RegexpStr.kAttribute, '$1');
                        let val = compileTpl(attrVal, data);
                        node.setAttribute(key, val);
                        node.removeAttribute(attrName);
                    } else if (RegexpStr.kOnAttribute.test(attrName)) {
                        let event = attrName.replace(RegexpStr.kOnAttribute, '$1');
                        let func = compileTpl(attrVal, data);
                        let match = func.match(RegexpStr.methodAndParam);
                        let method = match[1];
                        let params = match[2];
                        bindEvent(node, event, method, params, kmv.methods, kmv.data);
                        node.removeAttribute(attrName);
                    } else {
                        node.setAttribute(attrName, compileTpl(attrVal, data));
                    }
                } else {
                    node.setAttribute(attrName, attrVal);
                }
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
                newEle.template = this.template;
                newEle.childrenVdom = this.childrenVdom;
                this.$dom = newEle;
                DomUtil.copyAttr(newEle, this.attributes, kmv);
                this.childrenVdom
                &&
                this.childrenVdom.forEach((child) => {
                    newEle.appendChild(child.transDOM(kmv));
                })
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