export let evalJs = (content, obj) => {
    // console.dir(obj);
    // return (function() { return eval(content) }).call(obj);
    return new Function("with(this){ return " + content + " }").call(obj);
}

export let evalFunc = (code) => {
    return new Function("with(this){ console.log(this); return " + code + " }");
}