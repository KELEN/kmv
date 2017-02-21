import { NormalDOM } from './NormalDOM'
import { VDOM } from './VDOM'
import * as DomOp from '../dom/domOp'
import {RegexpStr, NodeType} from "../constants/constant"
import {
    depCopy, getDotVal, isNull,
    extend
} from "../util/object"
import { VDOMInterface } from "./VDOMInterface"
import {ForDOM} from "./ForDOM";
import {InputDOM} from "./InputDOM";
import {observer} from "../util/observer";
import {isUnknowElement} from "../util/validator";

export class ComponentDOM extends VDOM implements VDOMInterface {
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    outerHTML;
    $dom;       // 联系真实dom
    $data = {};
    node;
    methods;
    isComponent = true;
    forObjectKey;
    forKey;
    constructor (node, kmv, parentData = {}) {
        super(node);
        this.isComponent = true;
        this.tagName = node.tagName;
        let component = kmv.components[this.tagName.toLowerCase()]; // 组件配置
        if (component) {
            this.methods = component.methods;
            let div = document.createElement("div");
            div.innerHTML = component.template.trim() ;         // 转为dom
            this.attributes = node.attributes;
            for (let i = 0; i < node.attributes.length; i++) {
                (<any> div.firstChild).setAttribute(node.attributes[i].nodeName, node.attributes[i].nodeValue);
            }
            this.node = node;
            this.$dom = div.firstChild; // 关联dom

            let model = node.getAttribute(":model");    // 数据键
            this.$data = {
                model: getDotVal(parentData, model)
            };   // 渲染的数据

            observer(this.$data, kmv);

            if (node.getAttribute("k-for")) {
                let forDom = new ForDOM(div.firstChild, kmv, parentData);
                this.$dom = forDom.transDOM(this.$data, kmv);
            } else {
                if (this.$data['model']) {
                    for (let i = 0; i < this.$dom.childNodes.length; i++) {
                        let child = this.$dom.childNodes[i];
                        if (child.nodeType == NodeType.ELEMENT) {
                            if (isUnknowElement(child.tagName)) {
                                this.childrenVdom.push(new ComponentDOM(child, kmv, this.$data));
                            } else if (child.getAttribute("k-for")) {
                                this.childrenVdom.push(new ForDOM(child, kmv, this.$data));
                            } else {
                                this.childrenVdom.push(new NormalDOM(child, kmv, this.$data));
                            }
                        } else {
                            this.childrenVdom.push(new NormalDOM(child, kmv, this.$data));
                        }
                    }
                }
            }
            this.node = node;
        } else {
            console.error("无效标签" + this.tagName);
        }
    }
    renderInit(data = null, kmv) {
        DomOp.insertBefore(this.nextSibling, this.$dom);
        DomOp.removeNode(this.node);
        // 先插入后渲染
        this.childrenVdom.forEach((child) => {
             child.renderInit(this.$data, kmv, this);
        });
    }
    transDOM (data, kmv) {
        DomOp.removeNode(this.node);
        return this.$dom;
    }
    reRender(data, kmv) {
        for (let i = 0; i < this.attributes.length; i++) {
            let attr = this.attributes[i];
            let res;
            if (res = RegexpStr.isProps.exec(attr.nodeName)) {
                this.$data[res[1]] = getDotVal(data, attr.nodeValue);
            }
        }
        this.childrenVdom.forEach((child) => {
            child.reRender(this.$data, kmv, this);
        });
    }
    transNormalDOM () {

    }
    replaceDOM () {
    }
    insertNewDOM () {
        DomOp.insertBefore(this.node, this.$dom);
        DomOp.removeNode(this.node);
    }
}