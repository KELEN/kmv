export let evalJs = (content, obj) => {
    // console.dir(obj);
    // return (function() { return eval(content) }).call(obj);
    let res;
    try {
        return new Function("with(this){ return " + content + " }").call(obj);
    } catch  (err) {
        return '';
    }
}

export let evalFunc = (code) => {
    return new Function("with(this){ console.log(this); return " + code + " }");
}