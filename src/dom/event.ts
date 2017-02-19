export let bindEvent = (node, event, method, params, methodsObj, observeData) => {
    if (node.addEventListener) {
        node.addEventListener(event, function() {
            if (methodsObj && methodsObj[method]) {
                methodsObj[method].apply(observeData, params);
            } else {
                console.error("未声明" + method + "方法");
            }
        });
    } else {
        node.attachEvent("on" + event, function() {
            if (methodsObj && methodsObj[method]) {
                methodsObj[method].apply(observeData, params);
            } else {
                console.error("未声明" + method + "方法");
            }
        })
    }
}
