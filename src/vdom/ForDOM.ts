import * as DomUtil from "../dom/domOp"
import { getDotVal, depCopy } from '../util/object'
import { compileTpl } from '../util/template'
import { RegexpStr } from '../constants/constant'
import { ArrayOp, NodeType } from "../constants/constant"
import { NormalDOM } from './NormalDOM'

export class ForDOM {
    renderType;
    vdom;
    methods;
    constructor (node) {
        let forString = node.getAttribute("k-for");
        let match = RegexpStr.forStatement.exec(forString);
        let template = [];      // 模板可能是一个或者文本节点，元素
        for (let i = 0; i < node.childNodes.length; i++) {
            let childNode = node.childNodes[i];
            template.push(new NormalDOM(childNode));
        }
        this.vdom = {
            tagName: node.tagName,
            forString: forString,
            forObjectKey: match[2].trim(),
            forKey: match[1].trim(),
            template: template,
            previousSibling: node.previousSibling,
            nextSibling: node.nextSibling,
            nextElementSibling: node.nextElementSibling,
            previousElementSibling: node.previousElementSibling,
            parentNode: node.parentNode,
            children: [],
            arrayData: [],
            previousVdom: null,     // 上一个虚拟dom
            nextVdom: null,         // 下一个虚拟dom
            attributes: node.attributes
        }
        this.vdom.attributes.removeNamedItem("k-for");
        DomUtil.removeNode(node);       // 需要移除自身元素
        this.connect(node.previousElementSibling, node.nextElementSibling)
    }
    getVdom () {
        return this.vdom;
    }
    renderInit(Kmv) {
        let data = Kmv.$data
        var tagName = this.vdom.tagName;
        var template = this.vdom.template;
        let arrKey = this.vdom.forObjectKey;
        let arrayData = getDotVal(data, arrKey);
        var docFrag = document.createDocumentFragment();
        let obj = depCopy(data);        // 新的对象, 遍历元素需要
        for (let i = 0; i < arrayData.length; i++) {
            let newDom = document.createElement(tagName);
            let text = getDotVal(data, this.vdom.forObjectKey + "." + i);
            obj[this.vdom.forKey] = text;
            for (let n = 0; n < template.length; n++) {
                let newEle;
                let normalDOM = template[n];
                switch (normalDOM.nodeType) {
                    case NodeType.TEXT:
                        newEle = DomUtil.createTextNode(compileTpl(normalDOM.template, obj));
                        break;
                    case NodeType.ELEMENT:
                        newEle = document.createElement(normalDOM.tagName);
                        newEle.template = normalDOM.template;
                        let text = compileTpl(normalDOM.template, obj);
                        if (normalDOM.children) {
                            normalDOM.children.forEach((child) => {
                                newEle.appendChild(child.transDOM(Kmv));
                            })
                        } else {
                            newEle.innerText = text;
                        }
                        DomUtil.copyAttr(newEle, normalDOM.attributes, Kmv);
                        break;
                }
                newEle && newDom.appendChild(newEle);
            }
            DomUtil.copyAttr(newDom, this.vdom.attributes, Kmv);
            docFrag.appendChild(newDom);
        }
        DomUtil.insertAfter(this.vdom.previousSibling, docFrag);
        this.vdom.arrayData = arrayData.slice(0);
    }
    connect (realPrevDom, realNextDom) {
        realPrevDom && (realPrevDom.$nextSibling = this.vdom);
        this.vdom.$nextSibling = realNextDom;
    }
    reRender (change, Kmv) {
        let data = Kmv.$data;
        for (let i = 0; i < change.length; i++) {
            var op = change[i].op;
            switch (op) {
                case ArrayOp.PUSH:
                    this.pushDOM(Kmv, change[i].index);
                    break;
                case ArrayOp.POP:
                    this.popDOM();
                    break;
                case ArrayOp.CHANGE:
                    let obj = depCopy(data);        // 拷贝一份对象
                    this.changeText(obj, change[i].index)
                    break
                case ArrayOp.SHIFT:
                    this.shiftDOM();
                    break;
            }
        }
        let arrKey = this.vdom.forObjectKey;
        let arrayData = getDotVal(data, arrKey);
        this.vdom.arrayData = arrayData.slice(0);
    }
    reRenderList (Kmv) {
        let data = Kmv.$data;
        let startElem = this.vdom.previousSibling;  // 虚拟dom的前一个元素
        let endElem = this.vdom.nextSibling;
        let index = 0;
        let obj = depCopy(data);
        var template = this.vdom.template;
        while (startElem !== endElem.previousSibling) {
            startElem = startElem.nextSibling;
            let text = getDotVal(data, this.vdom.forObjectKey + "." + index);
            obj[this.vdom.forKey] = text;
            for (let n = 0; n < template.length; n++) {
                let normalDOM = template[n];
                let childEle = startElem.childNodes[n];    // 真实dom和虚拟dom是一样个数
                switch (normalDOM.nodeType) {
                    case NodeType.TEXT:
                        DomUtil.changeTextContent(childEle, compileTpl(normalDOM.template, obj));
                        break;
                    case NodeType.ELEMENT:
                        normalDOM.children.forEach((child) => {
                            child.reRender(Kmv, childEle);
                        })
                        break;
                }
            }
            index ++;
        }
    }
    reRenderChild (node, data) {
        let template = node.template;
        node.firstChild.nodeValue = compileTpl(template, data);
    }
    pushDOM(Kmv, i) {
        let data = Kmv.$data;
        let elem = document.createElement(this.vdom.tagName);
        let text = getDotVal(data, this.vdom.forObjectKey + "." + i);
        let template = this.vdom.template;
        let obj = depCopy(data);
        obj[this.vdom.forKey] = text;
        for (let n = 0; n < template.length; n++) {
            let newEle;
            let normalDOM = template[n];
            switch (normalDOM.nodeType) {
                case NodeType.TEXT:
                    newEle = DomUtil.createTextNode(compileTpl(normalDOM.template, obj));
                    break;
                case NodeType.ELEMENT:
                    newEle = document.createElement(normalDOM.tagName);
                    newEle.template = normalDOM.template;
                    let text = compileTpl(normalDOM.template, obj);
                    if (normalDOM.children) {
                        normalDOM.children.forEach((child) => {
                            newEle.appendChild(child.transDOM(Kmv));
                        })
                    } else {
                        newEle.innerText = text;
                    }
                    DomUtil.copyAttr(newEle, normalDOM.attributes, Kmv);
                    break;
            }
            newEle && elem.appendChild(newEle);
        }
        for (let n = 0; n < this.vdom.children.length; n++) {
            elem.appendChild(this.vdom.children[n].transDOM(data));
        }
        // DomUtil.copyAttr(elem, this.vdom.attributes, Kmv);
        DomUtil.inserBefore(this.vdom.nextSibling, elem);
    }
    popDOM() {
        DomUtil.deleteNode(this.vdom.nextSibling.parentNode, this.vdom.nextSibling.previousSibling);
    }
    shiftDOM() {
        DomUtil.deleteNode(this.vdom.previousSibling.parentNode, this.vdom.previousSibling.nextSibling);
    }
    changeText(data, i) {
        let start = this.vdom.previousSibling;
        let end = this.vdom.nextSibling;
        let index = -1;
        while (start != end && index < i) {
            start = start.nextSibling;
            index++;
        }
        let text = getDotVal(data, this.vdom.forObjectKey + "." + index);
        DomUtil.changeNodeValue(start, text);
    }
}