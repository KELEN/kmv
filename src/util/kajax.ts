export let get = (url, opts, cb) => {
    let xmlhttp;
    if ((<any>window).XMLHttpRequest) { // code for all new browsers
        xmlhttp = new XMLHttpRequest();
    } else if ((<any>window).ActiveXObject) { // code for IE5 and IE6
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp != null) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    let res = eval('(' + xmlhttp.responseText + ')');
                    cb(null, res);
                } else {

                }
            }
        };
        xmlhttp.open("GET",url,true);
        xmlhttp.send(null);
    } else {
        alert("Your browser does not support XMLHTTP.");
    }
}