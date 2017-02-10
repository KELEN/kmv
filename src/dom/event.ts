export let bindEvent = (node, event, method, param = '', methodsObj, observeData) => {

    if (node.addEventListener) {
        node.addEventListener(event, function() {
            let params = param.split(',');
            methodsObj[method].apply(observeData, params);
        });
    } else {
        node.attachEvent("on" + event, function() {
            let params = param.split(',');
            methodsObj[method].apply(observeData, params);
        })
    }


}