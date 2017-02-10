export let escapeObject = (objStr) => {
    if (objStr) {
        objStr = objStr.replace(/"(\w+)"/g, "\\\"$1\\\"");
    }
    return objStr;
}