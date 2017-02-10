import { compileTpl } from '../util/template'
import { copyAttr } from '../dom/domOp'

export class NormalDOM {
    vdom;
    methods;
    constructor (node) {
        // h3
        this.vdom = {
            tagName: node.tagName,
            template: node.firstChild.nodeValue,
            attributes: node.attributes
        }
    }
    transDOM(Kmv) {
        let data = Kmv.$data;
        let newEle = document.createElement(this.vdom.tagName);
        newEle.template = this.vdom.template;
        let text = compileTpl(this.vdom.template, data);
        newEle.innerText = text;
        copyAttr(newEle, this.vdom.attributes, Kmv);
        return newEle;
    }
}