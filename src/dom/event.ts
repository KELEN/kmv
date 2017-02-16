export let bindEvent = (node, event, method, params, methodsObj, observeData) => {

    if (node.addEventListener) {
        node.addEventListener(event, function() {
            methodsObj[method].apply(observeData, params);
        });
    } else {
        node.attachEvent("on" + event, function() {
            methodsObj[method].apply(observeData, params);
        })
    }


}