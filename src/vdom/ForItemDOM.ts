import * as DomOp from "../dom/domOp"
import { ForNormalDOM } from './ForNormalDOM'
import { VDOM } from './VDOM'
import { ForDOM } from './ForDOM'
import { InputDOM } from './InputDOM'
import { NodeType, RegexpStr } from "../constants/constant"
import {isUnknowElement} from "../util/validator";
import {ComponentDOM} from "./ComponentDOM";
import {getDotVal} from "../util/object";

export class ForItemDOM extends VDOM {
    tagName;
    templateNode;       // 模板节点, 每次构造时候需要获取template和attributes
    childrenVdom = [];
    attributes;
    $dom;
    template;
    nodeType;
    kshow;
    componentInstance = null;
    constructor (node, kmv, parentData = {}) {
        super(node);
        if (node.nodeType == NodeType.ELEMENT) {
            if (isUnknowElement(node.tagName)) {
                // 组件转换
                this.componentInstance = new ComponentDOM(node, kmv, parentData);
                node = new ComponentDOM(node, kmv, parentData).getRealDOM();
                node.$data = parentData;
                this.isComponent = true;
            }
        }
        this.tagName = node.tagName;
        this.attributes = node.attributes;
        this.nodeType = node.nodeType;
        this.templateNode = node;
        for (let i = 0; i < node.childNodes.length; i++) {
            let child = node.childNodes[i];
            if (child.nodeType === NodeType.ELEMENT) {
                if (isUnknowElement(child.tagName)) {
                    this.childrenVdom.push(new ComponentDOM(child, kmv, parentData));
                } else {
                    if (child.getAttribute("k-for")) {
                        this.childrenVdom.push(new ForDOM(child, kmv, parentData));
                    } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                        this.childrenVdom.push(new InputDOM(child));
                    } else {
                        this.childrenVdom.push(new ForNormalDOM(child, kmv, parentData))
                    }
                }
            } else if (child.nodeType === NodeType.TEXT) {
                this.childrenVdom.push(new ForNormalDOM(child, kmv, kmv.$data));
            }
        }
        node.removeAttribute("k-for");
    }
    transDOM(iteratorObj, kmv) {
        let newElem = DomOp.createElement(this.tagName);
        for (let i = 0, len = this.childrenVdom.length; i < len; i++) {
            let childVdom = this.childrenVdom[i];
            let newDom = childVdom.transDOM(iteratorObj, kmv, this.componentInstance);
            newDom && newElem.appendChild(newDom);
        }
        this.$dom = newElem;
        if (this.kshow) {
            let isShow = getDotVal(iteratorObj, this.kshow);
            this.$dom.style.display = !!isShow ? "block" : "none";
        }
        if (this.kif) {
            let isIf = getDotVal(iteratorObj, this.kif);
            if (!isIf) {
                // 不显示
                return this.$emptyComment;
            }
        }
        return this.$dom;
    }
    // 重新渲染
    reRender (iteratorObj, kmv, component: ComponentDOM = null) {
        if (this.isComponent) {
            // 需要子组件去渲染子元素
            component = this.componentInstance;
        }
        this.childrenVdom.forEach((child) => {
            child.reRender(iteratorObj, kmv, component);
        });
    }
    insertNewDOM (newDom) {
        if (this.nextSibling) {
            DomOp.insertBefore(this.nextSibling, newDom);
        } else if (this.parentNode) {
            DomOp.appendChild(this.parentNode, newDom);
        }
    }
}