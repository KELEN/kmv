import * as DomUtil from "../util/domOp"
import { getDotVal, depCopy } from '../util/object'
import { compileTpl } from '../util/template'
import { RegexpStr } from '../constants/constant'
import { ArrayOp } from "../constants/constant"

class VDOM {
    vdom;
    constructor (node) {
        // h3
        this.vdom = {
            tagName: node.tagName,
            template: node.firstChild.nodeValue,
        }
    }
    transDOM(data) {
        let newEle = document.createElement(this.vdom.tagName);
        newEle.template = this.vdom.template;
        let text = compileTpl(this.vdom.template, data);
        newEle.innerText = text;
        return newEle;
    }
}

export class ForDOM {
    renderType;
    vdom;
    constructor (node) {
        let forString = node.getAttribute("k-for");
        let match = RegexpStr.forStatement.exec(forString);
        let template = node.firstChild.nodeValue;
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
            arrayData: []
        }
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                let virtualDOM = new VDOM(node.children[i]);
                this.vdom.children.push(virtualDOM)
            }
        }
        console.log(this.vdom);
    }
    getVdom () {
        return this.vdom;
    }
    renderInit(data) {
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
                newDom.appendChild(this.vdom.children[n].transDOM(data));
            }
            docFrag.appendChild(newDom);
        }
        DomUtil.insertAfter(this.vdom.previousSibling, docFrag);
        this.vdom.arrayData = arrayData.slice(0);
    }
    removeFor(vdom) {
        var prev = vdom.previousSibling;
        var next = vdom.nextSibling;
        var tmp = prev;
        while (tmp.nextSibling !== next) {
            DomUtil.removeNode(tmp.nextSibling);
        }
    }
    connect (realPrevDom, realNextDom) {
        realPrevDom.$nextSibling = this.vdom;
        this.vdom.$nextSibling = realNextDom;
    }
    reRender (change, data) {
        for (let i = 0; i < change.length; i++) {
            var op = change[i].op;
            switch (op) {
                case ArrayOp.PUSH:
                    this.pushDOM(data, change[i].index);
                    break;
                case ArrayOp.POP:
                    this.popDOM();
                    break;
                case ArrayOp.CHANGE:
                    let obj = depCopy(data);
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
    reRenderList (data) {
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
            DomUtil.changeNodeValue(start.firstChild, text);
            let childrens = start.children || [];
            for (let i = 0; i < childrens.length; i++) {
                this.reRenderChild(childrens[i], data);
            }
            index ++;
        }
    }
    reRenderChild (node, data) {
        let template = node.template;
        console.log(node);
        node.firstChild.nodeValue = compileTpl(template, data);
    }
    pushDOM(data, i) {
        let elem = document.createElement(this.vdom.tagName);
        let text = getDotVal(data, this.vdom.forObjectKey + "." + i);
        let template = this.vdom.template;
        let obj = depCopy(data);
        obj[this.vdom.forKey] = text;
        elem.innerText = compileTpl(template, obj);
        for (let n = 0; n < this.vdom.children.length; n++) {
            elem.appendChild(this.vdom.children[n].transDOM(data));
        }
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

let VirtualDOM = {
    ForDOM: ForDOM
}

export default VirtualDOM;
