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
    forStatement: /([a-z_]+[\w]*)\s+in\s+([a-z_][\w.]+)/,
    bracket: /\[['|"]?(\w+)['|"]?\]/,   // 中括号
    isString: /'([^']*)'|"([^\"]*)"/,
    isParams: /^[^"|^'\d]+.*/,
    arithmeticOp: /\*|\+|-\//g,          // 逻辑运算符
    inputElement: /INPUT|TEXTAREA/,
    arrtibuteKey: /k-for|k-model|k-if/
}

export const NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    COMMENT: 8,
    DOCUMENT: 9
}

export const ArrayMethod = ['push', 'pop', 'slice', 'splice', 'shift', 'unshift', 'soft', 'reverse']

export enum RenderType {
    TEXT, INPUT, TEXTAREA, FOR, IF,
}

export enum ArrayOp {
    PUSH, POP, SORT, CHANGE, SHIFT
}