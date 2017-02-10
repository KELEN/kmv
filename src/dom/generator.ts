import validate from '../util/validator'


/**
 *  {
 *      tag: 'div',
 *      attr: {},
 *      text: '',
 *  }
 *  @param domObj
 */
export let newNode = (domObj) => {
    let tag = domObj.tag;
    let attr = domObj.attr;
    let text = domObj.text;
    let children = domObj.children;
    let ele = document.createElement(tag);
    ele.innerText = text;
    for (let i in attr) {
        if (validate.isForStatement(attr[i]))  {
            // 语句
        } else if (validate.isBraceReg(attr[i])) {
            // 大括号
        } else {
            // 普通属性
            ele[i] = attr[i];
        }
    }
    if (children && children.length) {
        domObj.children.forEach(function(child) {
            ele.appendChild(newNode(child));
        })
    }
    return ele;
}
