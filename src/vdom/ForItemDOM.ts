import * as DomUtil from "../dom/domOp"
import {depCopy, getDotVal} from '../util/object'
import { ForNormalDOM } from './ForNormalDOM'
import { isKvmAttribute } from '../util/validator'
import { RegexpStr } from '../constants/constant'
import { bindEvent } from "../dom/event"
import { NodeType } from "../constants/constant"
import { compileTpl } from '../util/template'

export class ForItemDOM {
    methods;
    tagName;
    templateNode;
    previousSibling;
    nextSibling;
    nextElementSibling;
    previousElementSibling;
    childrenVdom = [];
    attributes;
    $nextSibling;       // 链接真实虚拟dom的
    $dom;
    template;
    nodeType;
    constructor (node) {
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
        let data = depCopy(kmv.$data);
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
    renderAttr (kmv) {
        if (this.nodeType === NodeType.ELEMENT) {
            let data = kmv.$$data;
            let node = this.$dom;
            let attrs = this.attributes;
            for (let i = 0; i < attrs.length; i++) {
                let attr = attrs[i];
                let attrName = attr.nodeName, attrVal = attr.nodeValue;
                if (RegexpStr.kAttribute.test(attrName)) {
                    let key = attr.nodeName.replace(RegexpStr.kAttribute, '$1');
                    if (key === 'class') {
                        // 类 a:'class2', b:'class2'
                        let arr = attrVal.split(",");
                        let valRes = "";
                        for (var n = 0; n < arr.length; n++) {
                            var ak = arr[n].split(":")[0];
                            if (getDotVal(data, ak.trim())) {
                                valRes += arr[n].split(":")[1].trim() + " ";
                            }
                        }
                        node.setAttribute(key, valRes.trim());
                        node.removeAttribute(attrName);
                    } else {
                        let val = compileTpl(attrVal, data);
                        node.setAttribute(key, val);
                        node.removeAttribute(attrName);
                    }
                } else if (RegexpStr.kOnAttribute.test(attrName)) {
                    let event = attrName.replace(RegexpStr.kOnAttribute, '$1');
                    let func = compileTpl(attrVal, data);
                    let match = func.match(RegexpStr.methodAndParam);
                    let method = match[1];
                    let params = match[2];
                    let paramsArr = params.split(",")
                    for (var n = 0; n < paramsArr.length; n++) {
                        if (paramsArr[n] === 'this') {
                            paramsArr[n] = this.$dom;
                        } else {
                            paramsArr[n] = String(paramsArr[n]).trim();
                        }
                    }
                    bindEvent(node, event, method, paramsArr, kmv.methods, kmv.data);
                    node.removeAttribute(attrName);
                } else {
                    node.setAttribute(attrName, attrVal);
                }
            }
        }
    }
    reRenderAttr (kmv) {
        let data = kmv.$$data;
        let node = this.$dom;
        for (let i = 0; i < this.attributes.length; i++) {
            let attr = this.attributes[i];
            let attrName = attr.nodeName, attrVal = attr.nodeValue;
            if (isKvmAttribute(attrName)) {
                if (RegexpStr.kAttribute.test(attrName)) {
                    let key = attr.nodeName.replace(RegexpStr.kAttribute, '$1');
                    if (key === 'class') {
                        // 类 a:'class2', b:'class2'
                        let arr = attrVal.split(",");
                        let valRes = "";
                        for (var n = 0; n < arr.length; n++) {
                            var ak = arr[n].split(":")[0];
                            if (getDotVal(data, ak.trim())) {
                                valRes += arr[n].split(":")[1].trim() + " ";
                            }
                        }
                        node.setAttribute(key, valRes.trim());
                        node.removeAttribute(attrName);
                    } else {
                        let val = compileTpl(attrVal, data);
                        node.setAttribute(key, val);
                        node.removeAttribute(attrName);
                    }
                } else if (RegexpStr.kOnAttribute.test(attrName)) {
                    let event = attrName.replace(RegexpStr.kOnAttribute, '$1');
                    let func = compileTpl(attrVal, data);
                    let match = func.match(RegexpStr.methodAndParam);
                    let method = match[1];
                    let params = match[2];
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