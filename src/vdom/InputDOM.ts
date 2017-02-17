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
    renderInit(data, kmv) {
        this.$dom.value = getDotVal(data, this.kmodel);
        this.$dom.oninput = (ev) => {
            setObserveDotVal(kmv.data, this.kmodel, this.$dom.value);
        }
    }
    reRender (data, kmv) {
        let text = getDotVal(data, this.kmodel);
        this.$dom.value = text;
    }
}