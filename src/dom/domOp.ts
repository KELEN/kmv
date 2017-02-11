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

// 新增元素, last最后添加
export let insertNodeByIndex = (node, index, text) => {

    let tagName = node.tagName;
    let idx = 0; 		// 第一个下标开始
    let groupId = node.groupId;
    let attrs = node.attributes;
    let template = node.template;

    if (index == 0) {
        node.innerText = text;
        node.style.display = "";
    } else {
        while (idx < index - 1 && node) {
            if (node.nextSibling && node.nextSibling.groupId == groupId) {
                idx ++;
            }
            node = node.nextSibling;
        }
        let newNode = document.createElement(tagName);
        newNode.groupId = groupId;
        newNode.template = template;
        newNode.innerText = text;
        // 父属性
        for (let i = 0; i < attrs.length; i++) {
            let kv = attrs[i];
            switch (kv.name) {
                default:
                    newNode.setAttribute(kv.name, kv.nodeValue);
            }
        }
        insertAfter(node, newNode);
    }

}

export let removeNodeByIndex = (node, index) => {
    var tagName = node.tagName;
    var idx = 0;
    var groupId = node.groupId;
    // 当下标为1时，重新选举标准
    if (index == 0) {
        if (node.nextSibling.groupId == groupId) {
            node.nextSibling['forKey'] = node.forKey;
            node.nextSibling['forString'] = node.forString;
            node.parentNode.removeChild(node);
        } else {
            node.style.display = 'none';
            node.innerText = '';
        }
    } else {
        while (idx < index && node) {
            if (node.nextSibling && node.groupId == groupId) {
                idx ++;
            }
            node = node.nextSibling;
        }
        node && node.parentNode.removeChild(node);
    }
}

export let replaceNodeByIndex = (node, index, text) => {
    var idx = 0;
    var groupId = node.groupId;
    while (idx < index && node) {
        if (node.nextSibling && node.nextSibling.groupId == groupId) {
            idx ++;
        }
        node = node.nextSibling;
    }
    if (node) {
        node.innerText = text;
    } else {

    }
}

export let removeNode = (node) => {
    node && node.parentNode.removeChild(node);
}

