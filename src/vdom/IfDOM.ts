import {　VDOM　} from './VDOM'
import {getDotVal} from "../util/object";
export class IfDOM extends VDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    kif;
    constructor(node) {
        super(node);
        // h3
        this.tagName = node.tagName, this.attributes = node.attributes,
            this.nodeType = node.nodeType;
        this.kif = node.getAttribute("k-if");
        this.$dom = node;
        node.removeAttribute("k-if");
    }
    renderInit(kmv) {
        let data = kmv.$data;
        let isShow = getDotVal(data, this.kif);
        if (!!isShow) {
            this.$dom.style.display = "block";
        } else {
            this.$dom.style.display = "none";
        }
    }
    reRender (kmv) {
        let data = kmv.$data;
        let isShow = getDotVal(data, this.kif);
        if (!!isShow) {
            this.$dom.style.display = "block";
        } else {
            this.$dom.style.display = "none";
        }
    }
}