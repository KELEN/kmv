import { ForItemDOM } from './ForItemDOM'
import {RegexpStr, ArrayOp } from '../constants/constant'
import {getDotVal, depCopy} from "../util/object"
import * as DomOp from "../dom/domOp"
import { diff } from "../util/array";

export class ForDOM {
    previousSibling;    // 前一个元素
    nextSibling;        // 后一个元素
    templateNode;       // 模板节点, 共列表元素使用
    parentNode;         // 父节点
    childrenVdom = [];
    forObjectKey;   // arr
    forKey;         // i
    tagName;
    iteratorData;
    $dom;           // 对应的真实dom
    isList;
    constructor (node) {
        this.previousSibling = node.previousSibling;
        this.nextSibling = node.nextSibling;
        this.parentNode = node.parentNode;
        this.templateNode = node.cloneNode(true);
        this.isList = true;
        let forString = node.getAttribute("k-for");
        let match = RegexpStr.forStatement.exec(forString);
        this.tagName = node.tagName;
        this.forObjectKey = match[2].trim();        // 循环的键 item in arr 的 arr
        this.forKey = match[1].trim();              // 循环的key值 item in arr 的 item
        this.$dom = node;
    }
    renderInit(data, kmv) {
        let docFrag = this.transDOM(data, kmv);
        this.insertNewDOM(docFrag);
        DomOp.removeNode(this.$dom);
    }
    transDOM (data, kmv) {
        let iteratorData = getDotVal(data, this.forObjectKey);
        let docFrag = document.createDocumentFragment();
        if (Array.isArray(iteratorData)) {
            // 数组循环
            this.iteratorData = iteratorData.slice(0);
            for (let i = 0; i < this.iteratorData.length; i++) {
                let forItem = new ForItemDOM(this.templateNode.cloneNode(true));
                this.childrenVdom.push(forItem);
                let iteratorObj = Object.create(data);     // 构造遍历的对象
                iteratorObj[this.forKey] = this.iteratorData[i];
                let forItemDom = forItem.transDOM(iteratorObj, kmv);
                docFrag.appendChild(forItemDom);
            }
        } else if (typeof iteratorData === 'object') {
            // 对象循环
            this.iteratorData = iteratorData;
            for (let i in iteratorData) {
                let forItem = new ForItemDOM(this.templateNode);
                this.childrenVdom.push(forItem);
                let iteratorObj = Object.create(data);     // 构造遍历的对象
                iteratorObj[this.forKey] = this.iteratorData[i];
                let forItemDom = forItem.transDOM(iteratorObj, kmv);
                docFrag.appendChild(forItemDom);
            }
        }
        return docFrag;
    }
    insertNewDOM (docFrag) {
        if (this.previousSibling) {
            DomOp.insertAfter(this.previousSibling, docFrag);
        } else if (this.parentNode) {
            DomOp.appendChild(this.parentNode, docFrag);
        }
    }
    reRender (data, kmv) {
        let arrKey = this.forObjectKey;
        let newArray = getDotVal(data, arrKey);
        if (Array.isArray(newArray)) {
            let change = diff(this.iteratorData, newArray);
            if (change.length) {
                this.notifyDataChange(change, kmv);
            } else {
                for (let i = 0, len = this.iteratorData.length; i < len; i++) {
                    let iteratorObj = Object.create(data);
                    iteratorObj[this.forKey] = this.iteratorData[i];
                    this.childrenVdom[i].reRender(iteratorObj, kmv);
                }
            }
        } else {
            // 渲染对象
            let idx = 0;
            for (let key in this.iteratorData) {
                let iteratorObj = Object.create(data);
                iteratorObj[this.forKey] = this.iteratorData[key];
                this.childrenVdom[idx].reRender(iteratorObj, kmv);
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
            let iteratorObj = Object.create(kmv.$data);     // 构造遍历的对象
            iteratorObj[this.forKey] = arr[i];
            let newDom = newItem.transDOM(iteratorObj, kmv);
            docFrag.appendChild(newDom);
        }
        this.insertNewDOM(docFrag)
    }
    addNewItem (val, kmv) {
        let newItem = new ForItemDOM(this.templateNode);
        let iteratorObj = Object.create(kmv.$data);     // 构造遍历的对象
        iteratorObj[this.forKey] = val;
        let newDom = newItem.transDOM(iteratorObj, kmv);
        this.childrenVdom.push(newItem);
        this.insertNewDOM(newDom);
    }
    popItem () {
        let popVdom = this.childrenVdom.pop();
        popVdom.$dom && DomOp.removeNode(popVdom.$dom);
    }
    changeItem (i, kmv) {
        let obj = Object.create(kmv.$data);
        obj[this.forKey] = this.iteratorData[i];
        this.childrenVdom[i].reRender(obj, kmv);
    }
    shiftItem () {
        let shiftVdom = this.childrenVdom.shift();
        this.childrenVdom.shift();
        DomOp.removeNode(shiftVdom.$dom);
    }
}