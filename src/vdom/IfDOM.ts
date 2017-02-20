import { NodeType, RegexpStr } from "../constants/constant"
import {　VDOM　} from './VDOM'
import { getDotVal } from "../util/object";
import { ForDOM } from './ForDOM'
import { InputDOM } from './InputDOM'
import { isUnknowElement } from '../util/validator'
import { ComponentDOM } from './ComponentDOM'
import { NormalDOM } from './NormalDOM'

export class IfDOM extends VDOM {
    methods;
    nodeType;
    tagName;
    attributes;
    template;
    childrenVdom = [];
    $dom;       // 联系真实dom
    kif;
    constructor(node, kmv) {
        super(node);
        // h3
        this.tagName = node.tagName, this.attributes = node.attributes,
            this.nodeType = node.nodeType;
        this.kif = node.getAttribute("k-if");
        this.$dom = node;
        node.removeAttribute("k-if");
        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let child = node.childNodes[i];
                if (child.nodeType === NodeType.ELEMENT) {
                    if (isUnknowElement(child.tagName)) {
                        this.childrenVdom.push(new ComponentDOM(child, kmv));
                    } else {
                        if (child.getAttribute("k-for")) {
                            this.childrenVdom.push(new ForDOM(child, kmv));
                        } else if (child.getAttribute("k-model") && RegexpStr.inputElement.test(child.tagName)) {
                            this.childrenVdom.push(new InputDOM(child));
                        } else if (child.getAttribute("k-if")) {
                            this.childrenVdom.push(new IfDOM(child, kmv));
                        } else {
                            this.childrenVdom.push(new NormalDOM(child, kmv));
                        }
                    }
                } else {
                    this.childrenVdom.push(new NormalDOM(child, kmv));
                }
            }
        }
    }
    renderInit(data, kmv) {
        let isShow = getDotVal(data, this.kif);
        if (!!isShow) {
            this.$dom.style.display = "block";
        } else {
            this.$dom.style.display = "none";
        }
        this.childrenVdom.forEach((child) => {
            console.log(child);
            child.renderInit(data, kmv);
        })
    }
    reRender (data, kmv) {
        let isShow = getDotVal(data, this.kif);
        if (!!isShow) {
            this.$dom.style.display = "block";
        } else {
            this.$dom.style.display = "none";
        }
        this.childrenVdom.forEach((child) => {
            child.reRender(data, kmv);
        });
    }
}