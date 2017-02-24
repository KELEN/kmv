import { getDotVal, setObserveDotVal } from "../util/object";
import {VDOM} from "./VDOM";

export class InputDOM extends VDOM {
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    kmodel;
    constructor (node) {
        super(node);
        this.tagName = node.tagName;
        this.attributes = node.attributes;
        this.nodeType = node.nodeType;
        this.kmodel = node.getAttribute("k-model");
        this.$dom = node;
        node.removeAttribute("k-model");
    }
    renderInit(data, kmv) {
        this.$dom.value = getDotVal(data, this.kmodel);
        this.$dom.oninput = (ev) => {
            setObserveDotVal(data, this.kmodel, this.$dom.value);
        }
        this.renderAttr(data, kmv, null);
    }
    reRender (data, kmv) {
        let text = getDotVal(data, this.kmodel);
        this.$dom.value = text;
        this.reRenderAttr(data, kmv, null);
    }
}