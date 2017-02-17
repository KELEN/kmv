import { compileTpl } from '../util/template'
import { NodeType } from "../constants/constant"
import { isKvmAttribute } from '../util/validator'
import { RegexpStr } from '../constants/constant'
import { bindEvent } from "../dom/event"
import { getDotVal } from "../util/object";

export class VDOM {
    nodeType;
    $dom;
    attributes;
    constructor (node) {
        node.attributes && (this.attributes = [].slice.call(node.attributes).slice(0));
    }
    renderAttr (data, kmv) {
        if (this.nodeType === NodeType.ELEMENT) {
            let node = this.$dom;
            let attrs = this.attributes;
            for (let i = 0; i < attrs.length; i++) {
                let attr = attrs[i];
                let attrName = attr.nodeName, attrVal = attr.nodeValue;
                if (RegexpStr.kAttribute.test(attrName)) {
                    let key = attr.nodeName.replace(RegexpStr.kAttribute, '$1');
                    if (key === 'class') {
                        // 类 a:'class2', b:'class2'
                        let arr = attrVal.split(",");
                        let valRes = "";
                        for (var n = 0; n < arr.length; n++) {
                            var ak = arr[n].split(":")[0];
                            if (getDotVal(data, ak.trim())) {
                                valRes += arr[n].split(":")[1].trim() + " ";
                            }
                        }
                        node.setAttribute(key, valRes.trim());
                        node.removeAttribute(attrName);
                    } else {
                        let val = compileTpl(attrVal, data);
                        node.setAttribute(key, val);
                        node.removeAttribute(attrName);
                    }
                } else if (RegexpStr.kOnAttribute.test(attrName)) {
                    let event = attrName.replace(RegexpStr.kOnAttribute, '$1');
                    let func = compileTpl(attrVal, data);
                    let match = func.match(RegexpStr.methodAndParam);
                    let method = match[1];
                    let params = match[2];
                    let paramsArr = params.split(",")
                    for (var n = 0; n < paramsArr.length; n++) {
                        if (paramsArr[n] === 'this') {
                            paramsArr[n] = this.$dom;
                        } else {
                            paramsArr[n] = String(paramsArr[n]).trim();
                        }
                    }
                    bindEvent(node, event, method, paramsArr, kmv.methods, kmv.data);
                    node.removeAttribute(attrName);
                } else {
                    node.setAttribute(attrName, attrVal);
                }
            }
        }
    }
    reRenderAttr (data, kmv) {
        let node = this.$dom;
        for (let i = 0; i < this.attributes.length; i++) {
            let attr = this.attributes[i];
            let attrName = attr.nodeName, attrVal = attr.nodeValue;
            if (isKvmAttribute(attrName)) {
                if (RegexpStr.kAttribute.test(attrName)) {
                    let key = attr.nodeName.replace(RegexpStr.kAttribute, '$1');
                    if (key === 'class') {
                        // 类 a:'class2', b:'class2'
                        let arr = attrVal.split(",");
                        let valRes = "";
                        for (var n = 0; n < arr.length; n++) {
                            var ak = arr[n].split(":")[0];
                            if (getDotVal(data, ak.trim())) {
                                valRes += arr[n].split(":")[1].trim() + " ";
                            }
                        }
                        node.setAttribute(key, valRes.trim());
                        node.removeAttribute(attrName);
                    } else {
                        let val = compileTpl(attrVal, data);
                        node.setAttribute(key, val);
                        node.removeAttribute(attrName);
                    }
                } else {
                    node.setAttribute(attrName, compileTpl(attrVal, data));
                }
            } else {
                node.setAttribute(attrName, attrVal);
            }
        }
    }
}