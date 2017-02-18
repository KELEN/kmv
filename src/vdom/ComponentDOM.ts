import { NormalDOM } from './NormalDOM'
import { VDOM } from './VDOM'
import * as DomOp from '../dom/domOp'
import { RegexpStr } from "../constants/constant"
import { depCopy, getDotVal, isNull } from "../util/object"
import { VDOMInterface } from "./VDOMInterface"

export class ComponentDOM extends VDOM implements VDOMInterface {
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    outerHTML;
    $dom;       // 联系真实dom
    $data = {};
    $parent;
    node;
    constructor (node, kmv, data) {
        super(node);
        this.tagName = node.tagName;
        let component = kmv.components[this.tagName.toLowerCase()]; // 组件配置
        if (component) {
            let srcData = depCopy(data);
            let div = document.createElement("div");
            div.innerHTML = component.template;         // 转为dom
            this.attributes = node.attributes;
            for (let i = 0; i < this.attributes.length; i++) {
                let attr = this.attributes[i];
                let res;
                if (res = RegexpStr.isProps.exec(attr.nodeName)) {
                    this.$data[res[1]] = getDotVal(srcData, attr.nodeValue);
                }
            }
            this.$dom = div.firstChild;
            if (!isNull(this.$data)) {
                // 父组件有数据传递
                this.childrenVdom.push(new NormalDOM(this.$dom, kmv, this.$data));
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
        if (!isNull(this.$data)) {
            // 对象为空, 不渲染数据
            console.log(this.childrenVdom);
            this.childrenVdom.forEach((child) => {
                child.renderInit(this.$data, kmv);
            });
        }
    }
    reRender() {

    }
    transNormalDOM () {

    }
}