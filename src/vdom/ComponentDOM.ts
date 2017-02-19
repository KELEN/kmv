import { NormalDOM } from './NormalDOM'
import { VDOM } from './VDOM'
import * as DomOp from '../dom/domOp'
import {RegexpStr, NodeType} from "../constants/constant"
import { depCopy, getDotVal, isNull } from "../util/object"
import { VDOMInterface } from "./VDOMInterface"
import {ForDOM} from "./ForDOM";
import {InputDOM} from "./InputDOM";
import {IfDOM} from "./IfDOM";

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
    constructor (node, kmv, data = {}) {
        super(node);
        this.isComponent = true;
        this.tagName = node.tagName;
        let component = kmv.components[this.tagName.toLowerCase()]; // 组件配置
        if (component) {
            this.methods = component.methods;
            let div = document.createElement("div");
            div.innerHTML = component.template.trim() ;         // 转为dom
            this.attributes = node.attributes;
            for (let i = 0; i < this.attributes.length; i++) {
                let attr = this.attributes[i];
                let res;
                if (res = RegexpStr.isProps.exec(attr.nodeName)) {
                    this.$data[res[1]] = getDotVal(data, attr.nodeValue);
                }
            }
            this.$dom = div.firstChild;
            if (!isNull(this.$data)) {
                // 父组件有数据传递
                let childNodes = this.$dom.childNodes;
                for (let i = 0; i < childNodes.length; i++) {
                    let child = childNodes[i];
                    if (child.nodeType === NodeType.ELEMENT) {
                        if (child.getAttribute("k-for")) {
                            this.childrenVdom.push(new ForDOM(child, kmv, this.$data));
                        } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                            this.childrenVdom.push(new InputDOM(child));
                        } else if (child.getAttribute("k-if")) {
                            this.childrenVdom.push(new IfDOM(child));
                        } else {
                            this.childrenVdom.push(new NormalDOM(child, kmv));
                        }
                    } else {
                        this.childrenVdom.push(new NormalDOM(child, kmv));
                    }
                }
            }
            this.node = node;
        } else {
            console.error("无效标签" + this.tagName);
        }
    }
    renderInit(data = null, kmv) {
        // 先插入后渲染
        DomOp.insertAfter(this.node, this.$dom);
        DomOp.removeNode(this.node);
        this.childrenVdom.forEach((child) => {
            child.renderInit(this.$data, kmv, this);
        });
    }
    transDOM (data, kmv) {
        // 渲染子元素后返回
        this.childrenVdom.forEach((child) => {
            // 用当前数据渲染常规子dom
            child.renderInit(this.$data, kmv, this);
        });
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
}