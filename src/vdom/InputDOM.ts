import { compileTpl } from '../util/template'
import * as DomUtil from '../dom/domOp'
import { NodeType } from "../constants/constant";
import { getDotVal, setObserveDotVal} from "../util/object";

export class InputDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    kmodel;
    constructor (node) {
        // h3
        this.tagName = node.tagName, this.attributes = node.attributes,
            this.nodeType = node.nodeType;
        this.kmodel = node.getAttribute("k-model");
        this.$dom = node;
        node.removeAttribute("k-model");
    }
    renderInit(kmv) {
        let data = kmv.$data;
        this.$dom.value = getDotVal(data, this.kmodel);
        this.$dom.oninput = (ev) => {
            setObserveDotVal(kmv.data, this.kmodel, this.$dom.value);
        }
    }
    reRender (kmv) {
        let data = kmv.$data;
        let text = getDotVal(data, this.kmodel);
        this.$dom.value = text;
    }
}