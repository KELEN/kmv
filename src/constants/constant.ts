/**
 *   URL:
 *   说明:
 *   负责人: kelen
 *   日期:  1/24 0024.
 */
export const Attr = {
    K_MODEL: 'k-model'
}

export const RegexpStr = {
    brace: /\{\{((?:.|\n)+?)\}\}/,  // {{ name }}  大括号
    forStatement: /([a-z_]+[\w]*)\s+in\s+([a-z_][\w.]+(\[.*\])*)/,
    bracket: /\[['|"]?(\w+)['|"]?\]/,   // 中括号
    isString: /'([^']*)'|"([^\"]*)"/,
    isParams: /^[^"|^'\d]+.*/,
    arithmeticOp: /\*|\+|-\/|\(|\)/g,          // 逻辑运算符
    inputElement: /INPUT|TEXTAREA/,
    arrtibuteKey: /k-for|k-model|k-if|k:.*|k-on:(.*)/,
    kAttribute: /k:(.*)/,
    kOnAttribute: /k-on:(.*)/,
    methodAndParam: /([a-zA-Z\d_]+)\((.*)\)/,
    isTernaryOp: /!.*|!!.*|.+?.+:.+/,
    ternaryOpSplit: /\?|:|\(|\)|!!/,        // 正则切割
    isNormalHtmlTag: /html|body|base|head|link|meta|style|title|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|hgroup|nav|section|div|dd|dl|dt|figcaption|figure|hr|img|li|main|ol|p|pre|ul|a|b|abbr|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|rtc|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|map|track|video|embed|object|param|source|canvas|script|noscript|del|ins|caption|col|colgroup|table|thead|tbody|td|th|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|menuitem|summary|content|element|shadow|template/i
}

export const NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    COMMENT: 8,
    DOCUMENT: 9
}

export const ArrayMethod = ['push', 'pop', 'splice', 'shift', 'unshift', 'sort', 'reverse']

export enum RenderType {
    TEXT, INPUT, TEXTAREA, FOR, IF, ATTRIBUTE
}

export enum ArrayOp {
    PUSH, POP, SORT, CHANGE, SHIFT
}