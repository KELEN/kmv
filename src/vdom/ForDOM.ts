import { ForItemDOM } from './ForItemDOM'
import {RegexpStr, ArrayOp, RenderType} from '../constants/constant'
import {getDotVal, depCopy} from "../util/object"
import * as DomOp from "../dom/domOp"
import { diff } from "../util/array";

export class ForDOM {
    previousSibling;    // 前一个元素
    nextSibling;        // 后一个元素
    templateNode;       // 模板节点
    childrenVdom = [];
    $nextSibling;
    renderType = RenderType.FOR;
    forString;      // i in arr
    forObjectKey;   // arr
    forKey;         // i
    tagName;
    iteratorData;
    $dom;           // 对应的真实dom
    parentNode;
    isList;
    constructor (node) {
        this.previousSibling = node.previousSibling;
        this.nextSibling = node.nextSibling;
        this.parentNode = node.parentNode;
        this.templateNode = node;
        this.isList = true;
        this.connect(node.previousElementSibling, node.nextElementSibling);
        let forString = node.getAttribute("k-for");
        let match = RegexpStr.forStatement.exec(forString);
        this.tagName = node.tagName;
        this.forString = forString;
        this.forObjectKey = match[2].trim();
        this.forKey = match[1].trim();
        DomOp.removeNode(node);
    }
    renderInit(kmv) {
        let iteratorData = getDotVal(kmv.$data, this.forObjectKey);
        let docFrag = document.createDocumentFragment();
        if (Array.isArray(iteratorData)) {
            // 数组循环
            this.iteratorData = iteratorData.slice(0);
            for (let i = 0; i < this.iteratorData.length; i++) {
                let forItem = new ForItemDOM(this.templateNode);
                this.childrenVdom.push(forItem);
                let forItemDom = forItem.transDOM(this.iteratorData[i], this.forKey, kmv);
                docFrag.appendChild(forItemDom);
            }
        } else if (typeof iteratorData === 'object') {
            // 对象循环
            this.iteratorData = iteratorData;
            for (let i in iteratorData) {
                let forItem = new ForItemDOM(this.templateNode);
                this.childrenVdom.push(forItem);
                let forItemDom = forItem.transDOM(iteratorData[i], this.forKey, kmv);
                docFrag.appendChild(forItemDom);
            }
        }
        if (this.previousSibling) {
            DomOp.insertAfter(this.previousSibling, docFrag);
        } else if (this.parentNode) {
            DomOp.appendChild(this.parentNode, docFrag);
        }
    }
    connect (realPrevDom, realNextDom) {
        realPrevDom && (realPrevDom.$nextSibling = this);
        this.$nextSibling = realNextDom;
    }
    reRender (kmv) {
        let arrKey = this.forObjectKey;
        let newArray = getDotVal(kmv.$data, arrKey);
        if (Array.isArray(newArray)) {
            let change = diff(this.iteratorData, newArray);
            if (change.length) {
                this.notifyDataChange(change, kmv);
            } else {
                for (let i = 0, len = this.iteratorData.length; i < len; i++) {
                    this.childrenVdom[i].reRender(this.iteratorData[i], this.forKey, kmv);
                }
            }
        } else {
            // 渲染对象
            let idx = 0;
            for (let key in this.iteratorData) {
                this.childrenVdom[idx].reRender(this.iteratorData[key], this.forKey, kmv);
                idx++;
            }
        }
    }
    notifyDataChange (change, kmv) {
        let data = kmv.$data;
        let arrKey = this.forObjectKey;
        let arrayData = getDotVal(data, arrKey) || [];
        if (Array.isArray(this.iteratorData)) {
            this.iteratorData = arrayData.slice(0);
            for (let i = 0; i < change.length; i++) {
                var op = change[i].op;
                if (change[i].batch) {
                    switch (op) {
                        case ArrayOp.PUSH:
                            this.batchAdd(change[i].array, kmv);
                            break;
                    }
                } else {
                    switch (op) {
                        case ArrayOp.PUSH:
                            this.addNewItem(change[i].text, kmv);
                            break;
                        case ArrayOp.POP:
                            this.popItem();
                            break;
                        case ArrayOp.CHANGE:
                            this.changeItem (change[i].index, kmv)
                            break
                        case ArrayOp.SHIFT:
                            this.shiftItem();
                            break;
                    }
                }
            }
        }
    }
    batchAdd (arr = [], kmv) {
        let docFrag = document.createDocumentFragment();
        for (var i = 0, len = arr.length; i < len; i++) {
            let newItem = new ForItemDOM(this.templateNode);
            this.childrenVdom.push(newItem);
            let newDom = newItem.transDOM(arr[i], this.forKey, kmv);
            docFrag.appendChild(newDom);
        }
        if (this.nextSibling) {
            DomOp.inserBefore(this.nextSibling, docFrag);
        } else if (this.parentNode) {
            DomOp.appendChild(this.parentNode, docFrag);
        }
    }
    addNewItem (val, kmv) {
        let newItem = new ForItemDOM(this.templateNode);
        let newDom = newItem.transDOM(val, this.forKey, kmv);
        this.childrenVdom.push(newItem);
        DomOp.inserBefore(this.nextSibling, newDom);
    }
    popItem () {
        let popVdom = this.childrenVdom.pop();
        popVdom.$dom && DomOp.removeNode(popVdom.$dom);
    }
    changeItem (i, kmv) {
        this.childrenVdom[i].reRender(this.iteratorData[i], this.forKey, kmv);
    }
    shiftItem () {
        let shiftVdom = this.childrenVdom.shift();
        this.childrenVdom.shift();
        DomOp.removeNode(shiftVdom.$dom);
    }
}