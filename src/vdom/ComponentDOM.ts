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
import {observer} from "../core/observer";
import {isUnknowElement} from "../util/validator";
import {InputDOM} from "./InputDOM";

export class ComponentDOM extends VDOM implements VDOMInterface {
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    $data = {};
    node;
    methods;
    isComponent = true;
    forKey;
    model;
    constructor (node, kmv, parent: any = null) {
        super(node);
        this.isComponent = true;
        this.tagName = node.tagName;
        let component = kmv.components[this.tagName.toLowerCase()]; // 组件配置
        if (component) {
            this.methods = component.methods;
            let div = document.createElement("div");
            div.innerHTML = component.template.trim() ;         // 转为dom
            this.template = component.template.trim();
            this.attributes = node.attributes;
            for (let i = 0; i < node.attributes.length; i++) {
                (<any> div.firstChild).setAttribute(node.attributes[i].nodeName, node.attributes[i].nodeValue);
            }
            this.node = node;
            this.$dom = div.firstChild; // 关联dom
            this.model = node.getAttribute(":model");    // 数据键
            // console.log(parentData, this.model);
            let parentData;
            if (parent instanceof ComponentDOM) {
                parentData = parent['$data'];
            } else {
                parentData = kmv.data;
            }
            this.$data = {
                model: getDotVal(parentData, this.model)
            };   // 渲染的数据
            if (component.data) {
                this.$data = extend(this.$data, component.data());
            }
            observer(this.$data, kmv);
            if (this.$data['model']) {
                for (let i = 0; i < this.$dom.childNodes.length; i++) {
                    let child = this.$dom.childNodes[i];
                    if (child.nodeType == NodeType.ELEMENT) {
                        if (child.getAttribute("k-for")) {
                            this.childrenVdom.push(new ForDOM(child, kmv, this));
                        } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                            this.childrenVdom.push(new InputDOM(child));
                        } else if (isUnknowElement(child.tagName)) {
                            this.childrenVdom.push(new ComponentDOM(child, kmv, this));
                        } else {
                            this.childrenVdom.push(new NormalDOM(child, kmv, this));
                        }
                    } else {
                        this.childrenVdom.push(new NormalDOM(child, kmv, this));
                    }
                }
            }
            this.node = node;
        } else {
            console.error("无效标签" + this.tagName);
        }
    }
    renderInit(data = null, kmv) {
        this.insertNewDOM();
        DomOp.removeNode(this.node);
        // 先插入后渲染
        this.childrenVdom.forEach((child) => {
            child.renderInit(this.$data, kmv, this);
        });
    }
    transDOM (data, kmv) {
        return this.$dom;
    }
    reRender(data, kmv) {
        this.childrenVdom.forEach((child) => {
            child.reRender(this.$data, kmv, this);
        });
    }
    getRealDOM () {
        let div = document.createElement("div");
        div.innerHTML = this.template;         // 转为dom
        return div.firstChild;
    }
    replaceDOM () {
    }
    insertNewDOM () {
        DomOp.insertBefore(this.node, this.$dom);
        DomOp.removeNode(this.node);
    }
}