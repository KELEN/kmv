/**
 * Created by kelen on 2017/2/6.
 */
import { RegexpStr } from '../constants/constant'
import { compileTpl } from '../util/template'
import { isKvmAttribute } from '../util/validator'
import { bindEvent } from "./event";

export let insertAfter = (node, newNode) => {
    node && node.parentNode && node.parentNode.insertBefore(newNode, node.nextSibling);
}

export let createTextNode = (text) => {
    return document.createTextNode(text);
}

export let createElement = (tagName) => {
    return document.createElement(tagName);
}

export let inserBefore = (node, newNode) => {
    node && node.parentNode && node.parentNode.insertBefore(newNode, node);
}

export let deleteNode = (parent, node) => {
    parent && node && parent.removeChild(node);
}

export let changeNodeValue = (node, text) => {
    node && node.firstChild && (node.firstChild.nodeValue = text);
}

export let changeTextContent = (textNode, text) => {
    textNode && (textNode.textContent = text);
}

export let removeAttribute = (node, attr) => {
    node && node.removeAttribute(attr);
}

export let findIteratorNode = (parentNode, key) => {
    let childrens = parentNode.childNodes;
    let iteratorNodes = [];
    for (let i = 0; i < childrens.length; i++) {
        let node = childrens[i];
        if (node.forString && node.forKey && node.forKey == key) {
            iteratorNodes.push(node);
        }
        if (node.childNodes.length) {
            iteratorNodes.concat(findIteratorNode(node, key));
        }
    }
    return iteratorNodes;
}

export let hideNode = (node) => {
    node.style.display = "none";
}

export let showNode = (node) => {
    node.style.display = "block";
}

export let copyAttr = (node, attribute, Kmv) => {

    let data = Kmv.$data;

    for (let i = 0; i < attribute.length; i++) {
        let attr = attribute[i];
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
                bindEvent(node, event, method, params, Kmv.methods, Kmv.data);
                node.removeAttribute(attrName);
            }
        } else {
            node.setAttribute(attrName, attrVal);
        }
    }
}

export let removeNode = (node) => {
    node && node.parentNode.removeChild(node);
}

