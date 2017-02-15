import { compileTpl } from "../util/template"
import { NormalDOM } from './NormalDOM'
import { VDOM } from './VDOM'
import * as DomOp from '../dom/domOp'

export class ComponentDOM extends VDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    outerHTML;
    $dom;       // 联系真实dom
    constructor (node, kmv) {
        super(node);
        this.tagName = node.tagName;
        let component = kmv.components[this.tagName.toLowerCase()]
        if (component) {
            let div = document.createElement("div");
            div.innerHTML = component.template;
            let firstChild = div.firstChild;
            this.$dom = firstChild;
            DomOp.inserBefore(node, this.$dom);
            DomOp.removeNode(node);
        } else {
            // 无效标签
            console.error("无效标签" + this.tagName);
        }
    }
    transNormalDOM () {
        return new NormalDOM(this.$dom);
    }
}