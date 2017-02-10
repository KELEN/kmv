import * as TemplateUtil from '../util/template';
// 模板功能测试
let obj = {
    a: 222,
    name: "kelen",
}
let res = TemplateUtil.transArithmeticOp("a + name + 20", obj);
console.log(res);

res = TemplateUtil.compileTpl("hello world my name is {{ a * a }}", obj);
console.log(res);

res = TemplateUtil.compileTpl("{{ a + name }} {{ name }}", obj);
console.log(res);