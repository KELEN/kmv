import { RegexpStr } from '../constants/constant'
import { getDotVal, depCopy } from './object'
import { evalJs } from './function'
/**
 *  转换逻辑操作运算结果
 *
 */
export let transArithmeticOp = (tpl, obj) => {

    let opReg = RegexpStr.arithmeticOp;
    let arr = tpl.split(opReg);   // 符号切分
    let opRegArr = tpl.match(opReg);
    let isParamReg = RegexpStr.isParams;

    let tmp;
    let newStr = '';

    for (let i = 0; i < arr.length; i++) {
        tmp = arr[i].trim();
        if (isParamReg.test(tmp)) {
            // 如果是变量
            let val = getDotVal(obj, tmp);
            if (isNaN(val)) {       // 字符串
                newStr += '"' + val + '"';
            } else {
                if (!val) val = 0;
                newStr += val;
            }
        } else {
            newStr += tmp;
        }

        if (i < arr.length - 1) {
            newStr += opRegArr[i];
        }
    }
    let res = eval(newStr);
    return res;
}

export let transTernaryOperator = (tpl, obj) => {
    let arr = tpl.split(/\?|:|\(|\)|\+|-|\*|\/|!/);
    let match = tpl.match(/\?|:|\(|\)|\+|-|\*|\/|!/g);

    let newStr = '';
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i].trim();
        if (item && RegexpStr.isParams.test(item)) {
            newStr += '_data.' + item;
        } else {
            newStr += item;
        }
        if (match[i])
            newStr += match[i];
    }
    return (function(str, _data) {
        return eval(str);
    })(newStr, obj)
}

export let compileTpl = (tpl, obj) => {
    let braceReg = RegexpStr.brace;
    var regRes;
    while (regRes = braceReg.exec(tpl)) {
        let key = regRes ? regRes[1].trim() : '';	// 获取括号的键
        if (key) {
            let text = evalJs(key, obj);
            tpl = tpl.replace(braceReg, text);
        } else {
            return '';
        }
    }
    /*var regRes;
    while (regRes = braceReg.exec(tpl)) {
        let key = regRes ? regRes[1].trim() : '';	// 获取括号的键
        let opReg = RegexpStr.arithmeticOp;     // 是否有操作符
        let text = '';
        if (key) {
            if (opReg.test(key)) {
                text = transArithmeticOp(key, obj);
            } else if (RegexpStr.isTernaryOp.test(key)) {
                text = transTernaryOperator(key, obj);
            } else {
                text = getDotVal(obj, key);
            }
            tpl = tpl.replace(braceReg, text);
        } else {
            return '';
        }
    }*/
    return tpl;
}


