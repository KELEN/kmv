import * as DomUtil from "../dom/domOp"
import {depCopy, getDotVal} from '../util/object'
import { ForNormalDOM } from './ForNormalDOM'
import { VDOM } from './VDOM'

export class ForItemDOM extends VDOM {
    renderType;
    methods;
    tagName;
    templateNode;
    previousSibling;
    nextSibling;
    nextElementSibling;
    previousElementSibling;
    childrenVdom = [];
    arrayData;
    attributes;
    $nextSibling;       // 链接真实虚拟dom的
    $dom;
    template;
    nodeType;
    constructor (node) {
        super(node);
        for (let i = 0; i < node.childNodes.length; i++) {
            let childNode = node.childNodes[i];
            this.childrenVdom.push(new ForNormalDOM(childNode));
        }
        node.removeAttribute("k-for");
        this.tagName = node.tagName;
        this.templateNode = node;
        this.attributes = node.attributes;
        this.nodeType = node.nodeType;
    }
    transDOM(iteratorVal, iteratorKey, kmv) {
        let data = depCopy(getDotVal(kmv.$data, iteratorKey));
        data[iteratorKey] = iteratorVal;         // 构建迭代对象 eg: obj.i = 100;
        let newElem = DomUtil.createElement(this.tagName);
        for (let i = 0; i < this.childrenVdom.length; i++) {
            kmv.$$data = data;
            newElem.appendChild(this.childrenVdom[i].transDOM(kmv));
        }
        this.$dom = newElem;
        this.renderAttr(kmv);
        return newElem;
    }
    // 重新渲染
    reRender (iteratorVal, iteratorKey, kmv) {
        let data = depCopy(kmv.$data);
        data[iteratorKey] = iteratorVal;         // 构建迭代对象 eg: obj.i = 100;
        kmv.$$data = data;
        this.childrenVdom.forEach((child) => {
            child.reRender(kmv);
        });
        this.renderAttr(kmv);
    }
}