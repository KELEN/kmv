export class ComponentDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    outerHTML;
    $dom;       // 联系真实dom
    constructor (node) {
        this.outerHTML = node.outerHTML;
        this.tagName = node.tagName;
        this.$dom = node;
    }
    renderInit (kmv) {
        if (kmv.components[this.tagName]) {
            
        }
    }
}