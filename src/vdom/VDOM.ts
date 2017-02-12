import { compileTpl } from '../util/template'
import * as DomUtil from '../dom/domOp'
import { NodeType } from "../constants/constant"
import { isKvmAttribute } from '../util/validator'
import { RegexpStr } from '../constants/constant'
import { bindEvent } from "../dom/event"

export class VDOM {
    nodeType;
    $dom;
    attributes;
    constructor (node) {}
    renderAttr (kmv) {
        if (this.nodeType === NodeType.ELEMENT) {
            let data = kmv.data;
            let node = this.$dom;
            for (let i = 0; i < this.attributes.length; i++) {
                let attr = this.attributes[i];
                let attrName = attr.nodeName, attrVal = attr.nodeValue;
                if (isKvmAttribute(attrName, attrVal)) {
                    if (RegexpStr.kAttribute.test(attrName)) {
                        let key = attr.nodeName.replace(RegexpStr.kAttribute, '$1');
                        let val = compileTpl(attrVal, data);
                        node.setAttribute(key, val);
                        node.removeAttribute(attrName);
                    } else if (RegexpStr.kOnAttribute.test(attrName)) {
                        let event = attrName.replace(RegexpStr.kOnAttribute, '$1');
                        let func = compileTpl(attrVal, data);
                        let match = func.match(RegexpStr.methodAndParam);
                        let method = match[1];
                        let params = match[2];
                        bindEvent(node, event, method, params, kmv.methods, kmv.data);
                        node.removeAttribute(attrName);
                    } else {
                        node.setAttribute(attrName, compileTpl(attrVal, data));
                    }
                } else {
                    node.setAttribute(attrName, attrVal);
                }
            }
        }
    }
}