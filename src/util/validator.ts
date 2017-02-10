import { RegexpStr } from '../constants/constant'

let isBraceReg = (str: string) => {
    return RegexpStr.brace.test(str);
}

/**
 *  是否有包含语法
 * @param str
 */
let isForStatement = (str: string) => {
    return RegexpStr.forStatement.test(str);
}

let validator =  {
    isBraceReg: isBraceReg,
    isForStatement: isForStatement
}

export let isKvmAttribute = (key, val) => {
    return RegexpStr.arrtibuteKey.test(key) || RegexpStr.brace.test(val);
}

export default validator;