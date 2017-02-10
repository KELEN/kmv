import { Attr, RegexpStr } from '../constants/constant'
import { getDotVal } from '../util/object'
/**
 *  转为虚拟dom
 * @param ele
 */
export let toForVdom = (forEle) => {
    let forString = forEle.getAttribute("k-for");
    let match = RegexpStr.forStatement.exec(forString);
    let template = forEle.innerText;
    let vdom = {
        isVdom: true,
        tagName: forEle.tagName,
        forString: forString,
        forObjectKey: match[2].trim(),
        forKey: match[1].trim(),
        template: template,
        previousSibling: forEle.previousSibling,
        nextSibling: forEle.nextSibling,
    }
    return vdom;
}
