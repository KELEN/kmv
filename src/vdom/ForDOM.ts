import * as DomUtil from "../dom/domOp"
import { getDotVal, depCopy } from '../util/object'
import { compileTpl } from '../util/template'
import { RegexpStr } from '../constants/constant'
import { ArrayOp } from "../constants/constant"
import { NormalDOM } from './NormalDOM'

export class ForDOM {
    renderType;
    vdom;
    methods;
    constructor (node) {
        let forString = node.getAttribute("k-for");
        let match = RegexpStr.forStatement.exec(forString);
        let template = node.firstChild && node.firstChild.nodeValue;
        this.vdom = {
            tagName: node.tagName,
            forString: forString,
            forObjectKey: match[2].trim(),
            forKey: match[1].trim(),
            template: template,
            previousSibling: node.previousSibling,
            nextSibling: node.nextSibling,
            documentFragment: null,
            children: [],
            arrayData: [],
            attributes: node.attributes
        }
        this.vdom.attributes.removeNamedItem("k-for");
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                let virtualDOM = new NormalDOM(node.children[i]);
                this.vdom.children.push(virtualDOM)
            }
        }
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
        let obj = depCopy(data);
        for (let i = 0; i < arrayData.length; i++) {
            let newDom = document.createElement(tagName);
            let text = getDotVal(data, this.vdom.forObjectKey + "." + i);
            obj[this.vdom.forKey] = text;
            newDom.innerText = compileTpl(template, obj);
            for (let n = 0; n < this.vdom.children.length; n++) {
                newDom.appendChild(this.vdom.children[n].transDOM(Kmv));
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
        let start = this.vdom.previousSibling;
        let end = this.vdom.nextSibling;
        let index = 0;
        let obj = depCopy(data);
        var template = this.vdom.template;
        while (start !== end) {
            start = start.nextSibling
            let text = getDotVal(data, this.vdom.forObjectKey + "." + index);
            obj[this.vdom.forKey] = text;
            text = compileTpl(template, obj);
            DomUtil.changeNodeValue(start, text);
            let childrens = start.children || [];
            for (let i = 0; i < childrens.length; i++) {
                this.reRenderChild(childrens[i], data);
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
        elem.innerText = compileTpl(template, obj);
        for (let n = 0; n < this.vdom.children.length; n++) {
            elem.appendChild(this.vdom.children[n].transDOM(data));
        }
        DomUtil.copyAttr(elem, this.vdom.attributes, Kmv);
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