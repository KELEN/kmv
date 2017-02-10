import * as ObjectUtil from '../util/object'



let obj = { name: "kelen", age: 20, arr: [1, 2, 3], sub: { a: 1 } }
let res:any = ObjectUtil.depCopy(obj)
console.log(res);

res.arr[1] = 3;

console.log(obj);

import * as StringUtil from '../util/string';
let a = { a: 1 };
StringUtil.escapeObject(JSON.stringify(a));
