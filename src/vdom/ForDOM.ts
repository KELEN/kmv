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
    tagName;
    forString;
    forObjectKey;
    forKey;
    template;
    previousSibling;
    nextSibling;
    nextElementSibling;
    previousElementSibling;
    parentNode;
    childrenVdom;
    arrayData;
    attributes;
    $nextSibling;       // 链接真实虚拟dom的
    $prevousSibling;
    constructor (node) {
        let forString = node.getAttribute("k-for");
        let match = RegexpStr.forStatement.exec(forString);
        let template = "";      // 模板可能是一个或者文本节点，元素
        this.tagName = node.tagName;
        this.forString = forString;
        this.forObjectKey = match[2].trim();
        this.forKey = match[1].trim();
        this.template = template;
        this.previousSibling = node.previousSibling;
        this.nextSibling = node.nextSibling;
        this.nextElementSibling = node.nextElementSibling;
        this.previousElementSibling = node.previousElementSibling;
        this.parentNode = node.parentNode;
        this.childrenVdom = [];
        this.arrayData = [];
        this.attributes = node.attributes
        for (let i = 0; i < node.childNodes.length; i++) {
            let childNode = node.childNodes[i];
            this.childrenVdom.push(new NormalDOM(childNode));
        }
        this.attributes.removeNamedItem("k-for");
        DomUtil.removeNode(node);       // 需要移除自身元素
        this.connect(node.previousElementSibling, node.nextElementSibling)
    }
    getVdom () {
        return this;
    }
    transDOM (kmv) {
        let docFrag = document.createDocumentFragment();
        this.childrenVdom.forEach((child) => {
            switch (child.nodeType) {
                case NodeType.TEXT:
                    let textNode = document.createTextNode(compileTpl(child.template, kmv.$$data));
                    docFrag.appendChild(textNode);
                    break;
                case NodeType.ELEMENT:
                    let elemNode = document.createElement(child.tagName);
                    elemNode.childrenVdom = this.childrenVdom;
                    if (child.childrenVdom) {
                        child.childrenVdom.forEach((subChild) => {
                            elemNode.appendChild(subChild.transDOM(kmv));
                        })
                    }
                    docFrag.appendChild(elemNode);
            }
        });
        return docFrag;
    }
    renderInit(kmv) {
        let data = kmv.$data
        let arrKey = this.forObjectKey;
        let arrayData = getDotVal(data, arrKey);
        var docFrag = document.createDocumentFragment();
        kmv.$$data = depCopy(data);        // 新的对象, 遍历元素需要
        for (let i = 0; i < arrayData.length; i++) {
            let text = getDotVal(data, this.forObjectKey + "." + i);
            kmv.$$data[this.forKey] = text;
            let elem = document.createElement(this.tagName);
            elem.childrenVdom = this.childrenVdom;
            elem.appendChild(this.transDOM(kmv));
            docFrag.appendChild(elem);
        }
        DomUtil.insertAfter(this.previousSibling, docFrag);
        this.arrayData = arrayData.slice(0);
    }
    renderChild (kmv, normalDOM) {
        let docFrag = document.createDocumentFragment();
        if (normalDOM.children) {
            normalDOM.children.forEach((child) => {
                console.log(child);
                switch (child.nodeType) {
                    case NodeType.TEXT:
                        // 文本节点
                        console.log(child.template);
                        break;
                    case NodeType.ELEMENT:
                        let newElem = document.createElement(child.tagName);
                        console.log(child);
                        newElem.appendChild(child.transDOM(kmv));
                        if (child.children) {
                            newElem.appendChild(this.renderChild(kmv, child));
                        }
                        docFrag.appendChild(newElem);
                        break;
                }
            })
        }
        return docFrag;
    }
    connect (realPrevDom, realNextDom) {
        realPrevDom && (realPrevDom.$nextSibling = this);
        this.$nextSibling = realNextDom;
    }
    reRender (change, kmv) {
        let data = kmv.$data;
        for (let i = 0; i < change.length; i++) {
            var op = change[i].op;
            switch (op) {
                case ArrayOp.PUSH:
                    this.pushDOM(kmv, change[i].index);
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
        let arrKey = this.forObjectKey;
        let arrayData = getDotVal(data, arrKey);
        this.arrayData = arrayData.slice(0);
    }
    reRenderList (kmv) {
        let data = kmv.$data;
        let startElem = this.previousSibling;  // 虚拟dom的前一个元素
        let endElem = this.nextSibling;
        let index = 0;
        let obj = depCopy(data);
        var template = this.template;
        while (startElem !== endElem.previousSibling) {
            // 开始到结束遍历每个节点
            startElem = startElem.nextSibling;
            let text = getDotVal(data, this.forObjectKey + "." + index);
            obj[this.forKey] = text;
            console.dir(startElem);
            for (let n = 0; n < template.length; n++) {
                let normalDOM = template[n];
                let childEle = startElem.childNodes[n];    // 真实dom和虚拟dom是一样个数
                switch (normalDOM.nodeType) {
                    case NodeType.TEXT:
                        DomUtil.changeTextContent(childEle, compileTpl(normalDOM.template, obj));
                        break;
                    case NodeType.ELEMENT:
                        normalDOM.children.forEach((child) => {
                            child.reRender(kmv, childEle);
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
    pushDOM(kmv, i) {
        let data = kmv.$data;
        let elem = document.createElement(this.tagName);
        let text = getDotVal(data, this.forObjectKey + "." + i);
        let template = this.template;
        let obj = depCopy(data);
        obj[this.forKey] = text;
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
                            newEle.appendChild(child.transDOM(kmv));
                        })
                    } else {
                        newEle.innerText = text;
                    }
                    DomUtil.copyAttr(newEle, normalDOM.attributes, kmv);
                    break;
            }
            newEle && elem.appendChild(newEle);
        }
        /*for (let n = 0; n < this.children.length; n++) {
            elem.appendChild(this.children[n].transDOM(data));
        }*/
        // DomUtil.copyAttr(elem, this.attributes, kmv);
        DomUtil.inserBefore(this.nextSibling, elem);
    }
    popDOM() {
        DomUtil.deleteNode(this.nextSibling.parentNode, this.nextSibling.previousSibling);
    }
    shiftDOM() {
        DomUtil.deleteNode(this.previousSibling.parentNode, this.previousSibling.nextSibling);
    }
    changeText(data, i) {
        let start = this.previousSibling;
        let end = this.nextSibling;
        let index = -1;
        while (start != end && index < i) {
            start = start.nextSibling;
            index++;
        }
        let text = getDotVal(data, this.forObjectKey + "." + index);
        DomUtil.changeNodeValue(start, text);
    }
}