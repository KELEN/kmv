import { ForItemDOM } from './ForItemDOM'
import {RegexpStr, ArrayOp, RenderType} from '../constants/constant'
import { getDotVal } from "../util/object"
import * as DomOp from "../dom/domOp"

export class ForDOM {
    arrayData = [];          // 渲染数据列表
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
    $dom;           // 对应的真实dom
    constructor (node) {
        this.previousSibling = node.previousSibling;
        this.nextSibling = node.nextSibling;
        this.templateNode = node;
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
        this.arrayData = getDotVal(kmv.$data, this.forObjectKey).slice(0) || [];
        let docFrag = document.createDocumentFragment();
        for (let i = 0; i < this.arrayData.length; i++) {
            let forItem = new ForItemDOM(this.templateNode);
            this.childrenVdom.push(forItem);
            let forItemDom = forItem.transDOM(this.arrayData[i], this.forKey, kmv);
            docFrag.appendChild(forItemDom);
        }
        this.$dom = docFrag;
        DomOp.insertAfter(this.previousSibling, docFrag);
        this.connect(this.previousSibling, this.nextSibling);
    }
    connect (realPrevDom, realNextDom) {
        realPrevDom && (realPrevDom.$nextSibling = this);
        this.$nextSibling = realNextDom;
    }
    reRender (kmv) {
        for (let i = 0; i < this.arrayData.length; i++) {
            this.childrenVdom[i].reRender(this.arrayData[i], this.forKey, kmv);
        }
    }
    notifyDataChange (change, kmv) {
        let data = kmv.$data;
        let arrKey = this.forObjectKey;
        let arrayData = getDotVal(data, arrKey) || [];
        this.arrayData = arrayData.slice(0);
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
    batchAdd (arr = [], kmv) {
        let docFrag = document.createDocumentFragment();
        console.time("batchAdd");
        for (var i = 0; i < arr.length; i++) {
            let newItem = new ForItemDOM(this.templateNode);
            this.childrenVdom.push(newItem);
            let newDom = newItem.transDOM(arr[i], this.forKey, kmv);
            docFrag.appendChild(newDom);
        }
        DomOp.inserBefore(this.nextSibling, docFrag);
        console.timeEnd("batchAdd");
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
        this.childrenVdom[i].reRender(this.arrayData[i], this.forKey, kmv);
    }
    shiftItem () {
        let shiftVdom = this.childrenVdom.shift();
        this.childrenVdom.shift();
        DomOp.removeNode(shiftVdom.$dom);
    }
}