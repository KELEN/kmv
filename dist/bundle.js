/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var render_1 = __webpack_require__(1);
	var observer_1 = __webpack_require__(9);
	var watcher_1 = __webpack_require__(10);
	function Kmv(opts) {
	    var elSelector = opts['el'];
	    var elem = document.querySelector(elSelector);
	    var that = this;
	    this.data = opts.data;
	    // 获取需要渲染的dom列表
	    this.watchers = new watcher_1.Watcher(elem);
	    // 原始数据
	    this.$data = observer_1.observer(opts.data, this);
	    this.methods = opts.methods;
	    console.log(this.watchers);
	    render_1.renderInit(that);
	    return this;
	}
	window.Kmv = Kmv;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Kmv;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var template_1 = __webpack_require__(2);
	var constant_1 = __webpack_require__(3);
	var object_1 = __webpack_require__(4);
	var array_1 = __webpack_require__(5);
	var DomUtil = __webpack_require__(6);
	var event_1 = __webpack_require__(8);
	exports.renderInit = function (Kmv) {
	    var watcher = Kmv.watchers;
	    var data = Kmv.$data;
	    var observeData = Kmv.data;
	    var renderQueue = watcher.getQueue();
	    var _loop_1 = function (i) {
	        var node = renderQueue[i];
	        switch (node.renderType) {
	            case constant_1.RenderType.TEXT:
	                var template = node.template;
	                var text = template_1.compileTpl(template, data);
	                node.nodeValue = text;
	                break;
	            case constant_1.RenderType.INPUT:
	                var kModel_1 = node.getAttribute("k-model");
	                node.value = object_1.getDotVal(data, kModel_1);
	                node.oninput = function () {
	                    object_1.setObserveDotVal(observeData, kModel_1, this.value);
	                };
	                DomUtil.removeAttribute(node, "k-model");
	                break;
	            case constant_1.RenderType.FOR:
	                node.renderInit(Kmv);
	                break;
	            case constant_1.RenderType.IF:
	                var kIf = node.getAttribute("k-if");
	                var val = object_1.getDotVal(data, kIf);
	                if (val) {
	                    DomUtil.showNode(node);
	                }
	                else {
	                    DomUtil.hideNode(node);
	                }
	                node.kIf = kIf;
	                break;
	            case constant_1.RenderType.ATTRIBUTE:
	                var nAttr = node.nAttr;
	                var kAttr = node.kAttr;
	                var kOn = node.kOn;
	                for (var i_1 = 0; i_1 < kAttr.length; i_1++) {
	                    // k属性
	                    var attr = kAttr[i_1].kAttr.replace(constant_1.RegexpStr.kAttribute, '$1');
	                    var val_1 = template_1.compileTpl(kAttr[i_1].kAttrVal, data);
	                    node.setAttribute(attr, val_1);
	                }
	                for (var i_2 = 0; i_2 < kOn.length; i_2++) {
	                    // k-on事件
	                    var event_2 = kOn[i_2].kEvent.replace(constant_1.RegexpStr.kOnAttribute, '$1');
	                    var func = template_1.compileTpl(kOn[i_2].kFunc, data);
	                    var match = func.match(constant_1.RegexpStr.methodAndParam);
	                    if (match) {
	                        // 有参数 k-on:click = say() 或者 k-on:click = say('hello')
	                        var method = match[1];
	                        var params = match[2];
	                        event_1.bindEvent(node, event_2, method, params, Kmv.methods, Kmv.data);
	                    }
	                    else {
	                        event_1.bindEvent(node, event_2, func, '', Kmv.methods, Kmv.data);
	                    }
	                    DomUtil.removeAttribute(node, kOn[i_2].kEvent);
	                }
	                for (var i_3 = 0; i_3 < nAttr.length; i_3++) {
	                    // k属性
	                    var attr = nAttr[i_3].nAttr.replace(constant_1.RegexpStr.kAttribute, '$1');
	                    var val_2 = template_1.compileTpl(nAttr[i_3].nAttrVal, data);
	                    node.setAttribute(attr, val_2);
	                }
	                break;
	        }
	    };
	    for (var i = 0; i < renderQueue.length; i++) {
	        _loop_1(i);
	    }
	};
	exports.reRender = function (kmv, key) {
	    var renderQueue = kmv.watchers.getQueue();
	    var data = kmv.$data;
	    for (var i = 0; i < renderQueue.length; i++) {
	        var node = renderQueue[i];
	        switch (node.renderType) {
	            case constant_1.RenderType.TEXT:
	                var template = node.template;
	                node.nodeValue = template_1.compileTpl(template, data);
	                break;
	            case constant_1.RenderType.FOR:
	                node.reRenderList(kmv);
	                break;
	            case constant_1.RenderType.IF:
	                var kIf = node.kIf;
	                var val = object_1.getDotVal(data, kIf);
	                if (val) {
	                    DomUtil.showNode(node);
	                }
	                else {
	                    DomUtil.hideNode(node);
	                }
	                break;
	        }
	    }
	};
	exports.reRenderFor = function (kmv, forKey) {
	    var renderQueue = kmv.watchers.getQueue();
	    var data = kmv.$data;
	    for (var i = 0; i < renderQueue.length; i++) {
	        var node = renderQueue[i];
	        if (node.renderType == constant_1.RenderType.FOR) {
	            var vdom = node.vdom;
	            var arrKey = vdom.forObjectKey;
	            var newArray = object_1.getDotVal(data, arrKey);
	            var change = array_1.diff(vdom.arrayData, newArray);
	            node.reRender(change, kmv);
	        }
	    }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(3);
	var object_1 = __webpack_require__(4);
	/**
	 *  转换逻辑操作运算结果
	 *
	 */
	exports.transArithmeticOp = function (tpl, obj) {
	    var opReg = constant_1.RegexpStr.arithmeticOp;
	    var arr = tpl.split(opReg); // 符号切分
	    var opRegArr = tpl.match(opReg);
	    var isParamReg = constant_1.RegexpStr.isParams;
	    var tmp;
	    var newStr = '';
	    for (var i = 0; i < arr.length; i++) {
	        tmp = arr[i].trim();
	        if (isParamReg.test(tmp)) {
	            // 如果是变量
	            var val = object_1.getDotVal(obj, tmp);
	            if (isNaN(val)) {
	                newStr += '"' + val + '"';
	            }
	            else {
	                if (!val)
	                    val = 0;
	                newStr += val;
	            }
	        }
	        else {
	            newStr += tmp;
	        }
	        if (i < arr.length - 1) {
	            newStr += opRegArr[i];
	        }
	    }
	    return eval(newStr);
	};
	exports.compileTpl = function (tpl, obj) {
	    var braceReg = constant_1.RegexpStr.brace;
	    var regRes;
	    while (regRes = braceReg.exec(tpl)) {
	        var key = regRes ? regRes[1].trim() : ''; // 获取括号的键
	        var opReg = constant_1.RegexpStr.arithmeticOp; // 是否有操作符
	        var text = '';
	        if (opReg.test(key)) {
	            text = exports.transArithmeticOp(key, obj);
	        }
	        else {
	            text = object_1.getDotVal(obj, key);
	        }
	        tpl = tpl.replace(braceReg, text);
	    }
	    return tpl;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	/**
	 *   URL:
	 *   说明:
	 *   负责人: kelen
	 *   日期:  1/24 0024.
	 */
	exports.Attr = {
	    K_MODEL: 'k-model'
	};
	exports.RegexpStr = {
	    brace: /\{\{((?:.|\n)+?)\}\}/,
	    forStatement: /([a-z_]+[\w]*)\s+in\s+([a-z_][\w.]+)/,
	    bracket: /\[['|"]?(\w+)['|"]?\]/,
	    isString: /'([^']*)'|"([^\"]*)"/,
	    isParams: /^[^"|^'\d]+.*/,
	    arithmeticOp: /\*|\+|-\//g,
	    inputElement: /INPUT|TEXTAREA/,
	    arrtibuteKey: /k-for|k-model|k-if|k:.*|k-on:(.*)/,
	    kAttribute: /k:(.*)/,
	    kOnAttribute: /k-on:(.*)/,
	    methodAndParam: /([a-zA-Z\d_]+)\((.*)\)/
	};
	exports.NodeType = {
	    ELEMENT: 1,
	    ATTRIBUTE: 2,
	    TEXT: 3,
	    COMMENT: 8,
	    DOCUMENT: 9
	};
	exports.ArrayMethod = ['push', 'pop', 'splice', 'shift', 'unshift', 'sort', 'reverse'];
	var RenderType;
	(function (RenderType) {
	    RenderType[RenderType["TEXT"] = 0] = "TEXT";
	    RenderType[RenderType["INPUT"] = 1] = "INPUT";
	    RenderType[RenderType["TEXTAREA"] = 2] = "TEXTAREA";
	    RenderType[RenderType["FOR"] = 3] = "FOR";
	    RenderType[RenderType["IF"] = 4] = "IF";
	    RenderType[RenderType["ATTRIBUTE"] = 5] = "ATTRIBUTE";
	})(RenderType = exports.RenderType || (exports.RenderType = {}));
	var ArrayOp;
	(function (ArrayOp) {
	    ArrayOp[ArrayOp["PUSH"] = 0] = "PUSH";
	    ArrayOp[ArrayOp["POP"] = 1] = "POP";
	    ArrayOp[ArrayOp["SORT"] = 2] = "SORT";
	    ArrayOp[ArrayOp["CHANGE"] = 3] = "CHANGE";
	    ArrayOp[ArrayOp["SHIFT"] = 4] = "SHIFT";
	})(ArrayOp = exports.ArrayOp || (exports.ArrayOp = {}));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(3);
	exports.getDotVal = function (obj, key) {
	    var val, k;
	    if (key) {
	        key = key.replace(constant_1.RegexpStr.bracket, ".$1"); // 把arr['name']/arr["name"]/arr[0] 转为 arr.name/arr.0
	        val = obj;
	        // 获取对应的dot值
	        var arr = key.split(".") || [key];
	        while (k = arr.shift()) {
	            if (!val) {
	                val = undefined;
	                break;
	            }
	            val = val[k];
	        }
	    }
	    return val;
	};
	exports.depCopy = function (obj) {
	    var newObj = {};
	    for (var i in obj) {
	        if (typeof obj[i] === 'object') {
	            if (Array.isArray(obj[i])) {
	                newObj[i] = obj[i].slice(0);
	            }
	            else {
	                newObj[i] = exports.depCopy(obj[i]);
	            }
	        }
	        else {
	            newObj[i] = obj[i];
	        }
	    }
	    return newObj;
	};
	exports.setObserveDotVal = function (observeData, key, val) {
	    key = key.replace(constant_1.RegexpStr.bracket, ".$1"); // 把arr['name']/arr["name"]/arr[0] 转为 arr.name/arr.0
	    var tmp = observeData;
	    var arr = key.split(".");
	    var len = arr.length;
	    for (var i = 0; i < len - 1; i++) {
	        tmp = tmp[arr[i]];
	    }
	    tmp[arr[len - 1]] = val;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(3);
	exports.diff = function (arr1, arr2) {
	    var change = [];
	    var len1 = arr1.length, len2 = arr2.length;
	    var len = Math.min(len1, len2);
	    for (var i = 0; i < len; i++) {
	        if (arr1[i] !== arr2[i]) {
	            change.push({
	                op: constant_1.ArrayOp.CHANGE,
	                index: i,
	                text: arr2[i]
	            });
	        }
	    }
	    if (len1 > len2) {
	        var deleteArr = arr1.slice(len2);
	        for (var i = 0; i < deleteArr.length; i++) {
	            change.push({
	                op: constant_1.ArrayOp.POP,
	                index: i + len2,
	                text: deleteArr[i]
	            });
	        }
	    }
	    else {
	        var addArr = arr2.slice(len1);
	        for (var i = 0; i < addArr.length; i++) {
	            change.push({
	                op: constant_1.ArrayOp.PUSH,
	                index: i + len,
	                text: addArr[i]
	            });
	        }
	    }
	    return change;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Created by kelen on 2017/2/6.
	 */
	var constant_1 = __webpack_require__(3);
	var template_1 = __webpack_require__(2);
	var validator_1 = __webpack_require__(7);
	var event_1 = __webpack_require__(8);
	exports.insertAfter = function (node, newNode) {
	    node && node.parentNode && node.parentNode.insertBefore(newNode, node.nextSibling);
	};
	exports.createTextNode = function (text) {
	    return document.createTextNode(text);
	};
	exports.inserBefore = function (node, newNode) {
	    node && node.parentNode && node.parentNode.insertBefore(newNode, node);
	};
	exports.deleteNode = function (parent, node) {
	    parent && node && parent.removeChild(node);
	};
	exports.changeNodeValue = function (node, text) {
	    node && node.firstChild && (node.firstChild.nodeValue = text);
	};
	exports.changeTextContent = function (textNode, text) {
	    textNode && (textNode.textContent = text);
	};
	exports.removeAttribute = function (node, attr) {
	    node && node.removeAttribute(attr);
	};
	exports.findIteratorNode = function (parentNode, key) {
	    var childrens = parentNode.childNodes;
	    var iteratorNodes = [];
	    for (var i = 0; i < childrens.length; i++) {
	        var node = childrens[i];
	        if (node.forString && node.forKey && node.forKey == key) {
	            iteratorNodes.push(node);
	        }
	        if (node.childNodes.length) {
	            iteratorNodes.concat(exports.findIteratorNode(node, key));
	        }
	    }
	    return iteratorNodes;
	};
	exports.hideNode = function (node) {
	    node.style.display = "none";
	};
	exports.showNode = function (node) {
	    node.style.display = "block";
	};
	exports.copyAttr = function (node, attribute, Kmv) {
	    var data = Kmv.$data;
	    for (var i = 0; i < attribute.length; i++) {
	        var attr = attribute[i];
	        var attrName = attr.nodeName, attrVal = attr.nodeValue;
	        if (validator_1.isKvmAttribute(attrName, attrVal)) {
	            if (constant_1.RegexpStr.kAttribute.test(attrName)) {
	                var key = attr.nodeName.replace(constant_1.RegexpStr.kAttribute, '$1');
	                var val = template_1.compileTpl(attrVal, data);
	                node.setAttribute(key, val);
	                node.removeAttribute(attrName);
	            }
	            else if (constant_1.RegexpStr.kOnAttribute.test(attrName)) {
	                var event_2 = attrName.replace(constant_1.RegexpStr.kOnAttribute, '$1');
	                var func = template_1.compileTpl(attrVal, data);
	                var match = func.match(constant_1.RegexpStr.methodAndParam);
	                var method = match[1];
	                var params = match[2];
	                event_1.bindEvent(node, event_2, method, params, Kmv.methods, Kmv.data);
	                node.removeAttribute(attrName);
	            }
	        }
	        else {
	            node.setAttribute(attrName, attrVal);
	        }
	    }
	};
	// 新增元素, last最后添加
	exports.insertNodeByIndex = function (node, index, text) {
	    var tagName = node.tagName;
	    var idx = 0; // 第一个下标开始
	    var groupId = node.groupId;
	    var attrs = node.attributes;
	    var template = node.template;
	    if (index == 0) {
	        node.innerText = text;
	        node.style.display = "";
	    }
	    else {
	        while (idx < index - 1 && node) {
	            if (node.nextSibling && node.nextSibling.groupId == groupId) {
	                idx++;
	            }
	            node = node.nextSibling;
	        }
	        var newNode = document.createElement(tagName);
	        newNode.groupId = groupId;
	        newNode.template = template;
	        newNode.innerText = text;
	        // 父属性
	        for (var i = 0; i < attrs.length; i++) {
	            var kv = attrs[i];
	            switch (kv.name) {
	                default:
	                    newNode.setAttribute(kv.name, kv.nodeValue);
	            }
	        }
	        exports.insertAfter(node, newNode);
	    }
	};
	exports.removeNodeByIndex = function (node, index) {
	    var tagName = node.tagName;
	    var idx = 0;
	    var groupId = node.groupId;
	    // 当下标为1时，重新选举标准
	    if (index == 0) {
	        if (node.nextSibling.groupId == groupId) {
	            node.nextSibling['forKey'] = node.forKey;
	            node.nextSibling['forString'] = node.forString;
	            node.parentNode.removeChild(node);
	        }
	        else {
	            node.style.display = 'none';
	            node.innerText = '';
	        }
	    }
	    else {
	        while (idx < index && node) {
	            if (node.nextSibling && node.groupId == groupId) {
	                idx++;
	            }
	            node = node.nextSibling;
	        }
	        node && node.parentNode.removeChild(node);
	    }
	};
	exports.replaceNodeByIndex = function (node, index, text) {
	    var idx = 0;
	    var groupId = node.groupId;
	    while (idx < index && node) {
	        if (node.nextSibling && node.nextSibling.groupId == groupId) {
	            idx++;
	        }
	        node = node.nextSibling;
	    }
	    if (node) {
	        node.innerText = text;
	    }
	    else {
	    }
	};
	exports.removeNode = function (node) {
	    node && node.parentNode.removeChild(node);
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(3);
	var isBraceReg = function (str) {
	    return constant_1.RegexpStr.brace.test(str);
	};
	/**
	 *  是否有包含语法
	 * @param str
	 */
	var isForStatement = function (str) {
	    return constant_1.RegexpStr.forStatement.test(str);
	};
	var validator = {
	    isBraceReg: isBraceReg,
	    isForStatement: isForStatement
	};
	exports.isKvmAttribute = function (key, val) {
	    return constant_1.RegexpStr.arrtibuteKey.test(key) || constant_1.RegexpStr.brace.test(val);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = validator;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	exports.bindEvent = function (node, event, method, param, methodsObj, observeData) {
	    if (param === void 0) { param = ''; }
	    if (node.addEventListener) {
	        node.addEventListener(event, function () {
	            var params = param.split(',');
	            methodsObj[method].apply(observeData, params);
	        });
	    }
	    else {
	        node.attachEvent("on" + event, function () {
	            var params = param.split(',');
	            methodsObj[method].apply(observeData, params);
	        });
	    }
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ObjectUtil = __webpack_require__(4);
	var render_1 = __webpack_require__(1);
	var constant_1 = __webpack_require__(3);
	var object_1 = __webpack_require__(4);
	/**
	 *   URL:
	 *   说明:
	 *   负责人: kelen
	 *   日期:  1/24 0024.
	 */
	exports.observer = function (obj, kmv, key) {
	    if (key === void 0) { key = ''; }
	    var newObj = ObjectUtil.depCopy(obj);
	    var _loop_1 = function (i) {
	        var bigKey = key ? key + "." + i : i;
	        if (typeof obj[i] == 'object') {
	            if (Array.isArray(obj[i])) {
	                arrayObserve(obj[i], kmv, bigKey);
	            }
	            else {
	                exports.observer(obj[i], kmv, bigKey);
	            }
	        }
	        else {
	            Object.defineProperty(obj, i, {
	                set: function (newVal) {
	                    ObjectUtil.setObserveDotVal(kmv.$data, bigKey, newVal);
	                    render_1.reRender(kmv, i);
	                },
	                get: function () {
	                    return object_1.getDotVal(kmv.$data, bigKey);
	                }
	            });
	        }
	    };
	    for (var i in obj) {
	        _loop_1(i);
	    }
	    return newObj;
	};
	function arrayObserve(arr, kmv, bigKey) {
	    var timer;
	    // 监听array操作
	    constant_1.ArrayMethod.forEach(function (method) {
	        Object.defineProperty(arr, method, {
	            configurable: false,
	            enumerable: false,
	            writable: false,
	            value: function () {
	                Array.prototype[method].apply(object_1.getDotVal(kmv.$data, bigKey), arguments);
	                if (timer) {
	                    clearTimeout(timer);
	                }
	                timer = setTimeout(function () {
	                    render_1.reRenderFor(kmv, bigKey);
	                }, 10);
	            }
	        });
	    });
	    /*arr.push = function() {
	        Array.prototype.push.apply(getDotVal(kmv.$data, bigKey), arguments);
	        if (timer) {
	            clearTimeout(timer);
	        }
	        timer = setTimeout(function () {
	            reRenderFor(kmv, bigKey)
	        }, 10)
	    }
	
	    arr.pop = function () {
	        Array.prototype.pop.apply(getDotVal(kmv.$data, bigKey), arguments);
	        if (timer) {
	            clearTimeout(timer);
	        }
	        timer = setTimeout(function () {
	            reRenderFor(kmv, bigKey)
	        }, 10)
	    }
	
	    arr.shift = function () {
	        Array.prototype.shift.apply(getDotVal(kmv.$data, bigKey), arguments);
	        if (timer) {
	            clearTimeout(timer);
	        }
	        timer = setTimeout(function () {
	            reRenderFor(kmv, bigKey);
	        }, 10)
	    }
	
	    arr.unshift = function () {
	        Array.prototype.unshift.apply(getDotVal(kmv.$data, bigKey), arguments);
	        if (timer) {
	            clearTimeout(timer);
	        }
	        timer = setTimeout(function () {
	            reRenderFor(kmv, bigKey)
	        }, 10)
	    }
	
	    arr.splice = function () {
	        Array.prototype.splice.apply(getDotVal(kmv.$data, bigKey), arguments);
	        if (timer) {
	            clearTimeout(timer);
	        }
	        timer = setTimeout(function () {
	            reRenderFor(kmv, bigKey)
	        }, 10)
	    }
	
	    arr.sort =function () {
	        Array.prototype.sort.apply(getDotVal(kmv.$data, bigKey), arguments);
	        if (timer) {
	            clearTimeout(timer);
	        }
	        timer = setTimeout(function () {
	            reRenderFor(kmv, bigKey)
	        }, 10)
	    };*/
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(3);
	var validator_1 = __webpack_require__(7);
	var VirtualDOM = __webpack_require__(11);
	var Watcher = (function () {
	    function Watcher(node) {
	        this.queue = [];
	        this.queue = this.queueInit(node);
	    }
	    Watcher.prototype.getQueue = function () {
	        return this.queue;
	    };
	    Watcher.prototype.queueInit = function (node) {
	        var childNodes = node.childNodes;
	        for (var i = 0; i < childNodes.length; i++) {
	            var child = childNodes[i];
	            switch (child.nodeType) {
	                case constant_1.NodeType.TEXT:
	                    var nodeValue = child.nodeValue;
	                    if (constant_1.RegexpStr.brace.test(nodeValue)) {
	                        child.renderType = constant_1.RenderType.TEXT;
	                        child.template = nodeValue;
	                        this.queue.push(child);
	                    }
	                    break;
	                case constant_1.NodeType.ELEMENT:
	                    if (child.getAttribute("k-for")) {
	                        // 转为虚拟dom
	                        var vdom = new VirtualDOM.ForDOM(child);
	                        vdom.renderType = constant_1.RenderType.FOR;
	                        this.queue.push(vdom);
	                        continue; // 转为虚拟dom, 子元素不需要进队
	                    }
	                    else if (child.getAttribute("k-if")) {
	                        child.renderType = constant_1.RenderType.IF;
	                        this.queue.push(child);
	                    }
	                    else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
	                        child.renderType = constant_1.RenderType.INPUT;
	                        this.queue.push(child);
	                    }
	                    else {
	                        var attrs = child.attributes;
	                        child.nAttr = []; // 常规属性
	                        child.kAttr = []; // k属性
	                        child.kOn = []; // k-on属性
	                        for (var n = 0; n < attrs.length; n++) {
	                            var attr = attrs[n];
	                            if (validator_1.isKvmAttribute(attr.nodeName, attr.nodeValue)) {
	                                child.renderType = constant_1.RenderType.ATTRIBUTE;
	                                if (constant_1.RegexpStr.kAttribute.test(attr.nodeName)) {
	                                    child.kAttr.push({
	                                        kAttr: attr.nodeName,
	                                        kAttrVal: attr.nodeValue
	                                    });
	                                    child.removeAttribute(attr.nodeName);
	                                }
	                                else if (constant_1.RegexpStr.kOnAttribute.test(attr.nodeName)) {
	                                    child.kOn.push({
	                                        kEvent: attr.nodeName,
	                                        kFunc: attr.nodeValue
	                                    });
	                                }
	                                else {
	                                    //
	                                    child.nAttr.push({
	                                        nAttr: attr.nodeName,
	                                        nAttrVal: attr.nodeValue
	                                    });
	                                }
	                            }
	                        }
	                        if (child.renderType === constant_1.RenderType.ATTRIBUTE)
	                            this.queue.push(child);
	                    }
	                    break;
	            }
	            if (child.childNodes.length) {
	                this.queue.concat(this.queueInit(child));
	            }
	        }
	        return this.queue;
	    };
	    return Watcher;
	}());
	exports.Watcher = Watcher;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(12));
	__export(__webpack_require__(13));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var DomUtil = __webpack_require__(6);
	var object_1 = __webpack_require__(4);
	var template_1 = __webpack_require__(2);
	var constant_1 = __webpack_require__(3);
	var constant_2 = __webpack_require__(3);
	var NormalDOM_1 = __webpack_require__(13);
	var ForDOM = (function () {
	    function ForDOM(node) {
	        var forString = node.getAttribute("k-for");
	        var match = constant_1.RegexpStr.forStatement.exec(forString);
	        var template = []; // 模板可能是一个或者文本节点，元素
	        for (var i = 0; i < node.childNodes.length; i++) {
	            var childNode = node.childNodes[i];
	            template.push(new NormalDOM_1.NormalDOM(childNode));
	        }
	        this.vdom = {
	            tagName: node.tagName,
	            forString: forString,
	            forObjectKey: match[2].trim(),
	            forKey: match[1].trim(),
	            template: template,
	            previousSibling: node.previousSibling,
	            nextSibling: node.nextSibling,
	            nextElementSibling: node.nextElementSibling,
	            previousElementSibling: node.previousElementSibling,
	            parentNode: node.parentNode,
	            children: [],
	            arrayData: [],
	            previousVdom: null,
	            nextVdom: null,
	            attributes: node.attributes
	        };
	        this.vdom.attributes.removeNamedItem("k-for");
	        DomUtil.removeNode(node); // 需要移除自身元素
	        this.connect(node.previousElementSibling, node.nextElementSibling);
	    }
	    ForDOM.prototype.getVdom = function () {
	        return this.vdom;
	    };
	    ForDOM.prototype.renderInit = function (Kmv) {
	        var data = Kmv.$data;
	        var tagName = this.vdom.tagName;
	        var template = this.vdom.template;
	        var arrKey = this.vdom.forObjectKey;
	        var arrayData = object_1.getDotVal(data, arrKey);
	        var docFrag = document.createDocumentFragment();
	        var obj = object_1.depCopy(data); // 新的对象, 遍历元素需要
	        for (var i = 0; i < arrayData.length; i++) {
	            var newDom = document.createElement(tagName);
	            var text = object_1.getDotVal(data, this.vdom.forObjectKey + "." + i);
	            obj[this.vdom.forKey] = text;
	            var _loop_1 = function (n) {
	                var newEle;
	                var normalDOM = template[n];
	                switch (normalDOM.nodeType) {
	                    case constant_2.NodeType.TEXT:
	                        newEle = DomUtil.createTextNode(template_1.compileTpl(normalDOM.template, obj));
	                        break;
	                    case constant_2.NodeType.ELEMENT:
	                        newEle = document.createElement(normalDOM.tagName);
	                        newEle.template = normalDOM.template;
	                        var text_1 = template_1.compileTpl(normalDOM.template, obj);
	                        if (normalDOM.children) {
	                            normalDOM.children.forEach(function (child) {
	                                newEle.appendChild(child.transDOM(Kmv));
	                            });
	                        }
	                        else {
	                            newEle.innerText = text_1;
	                        }
	                        DomUtil.copyAttr(newEle, normalDOM.attributes, Kmv);
	                        break;
	                }
	                newEle && newDom.appendChild(newEle);
	            };
	            for (var n = 0; n < template.length; n++) {
	                _loop_1(n);
	            }
	            DomUtil.copyAttr(newDom, this.vdom.attributes, Kmv);
	            docFrag.appendChild(newDom);
	        }
	        DomUtil.insertAfter(this.vdom.previousSibling, docFrag);
	        this.vdom.arrayData = arrayData.slice(0);
	    };
	    ForDOM.prototype.connect = function (realPrevDom, realNextDom) {
	        realPrevDom && (realPrevDom.$nextSibling = this.vdom);
	        this.vdom.$nextSibling = realNextDom;
	    };
	    ForDOM.prototype.reRender = function (change, Kmv) {
	        var data = Kmv.$data;
	        for (var i = 0; i < change.length; i++) {
	            var op = change[i].op;
	            switch (op) {
	                case constant_2.ArrayOp.PUSH:
	                    this.pushDOM(Kmv, change[i].index);
	                    break;
	                case constant_2.ArrayOp.POP:
	                    this.popDOM();
	                    break;
	                case constant_2.ArrayOp.CHANGE:
	                    var obj = object_1.depCopy(data); // 拷贝一份对象
	                    this.changeText(obj, change[i].index);
	                    break;
	                case constant_2.ArrayOp.SHIFT:
	                    this.shiftDOM();
	                    break;
	            }
	        }
	        var arrKey = this.vdom.forObjectKey;
	        var arrayData = object_1.getDotVal(data, arrKey);
	        this.vdom.arrayData = arrayData.slice(0);
	    };
	    ForDOM.prototype.reRenderList = function (Kmv) {
	        var data = Kmv.$data;
	        var startElem = this.vdom.previousSibling; // 虚拟dom的前一个元素
	        var endElem = this.vdom.nextSibling;
	        var index = 0;
	        var obj = object_1.depCopy(data);
	        var template = this.vdom.template;
	        while (startElem !== endElem.previousSibling) {
	            startElem = startElem.nextSibling;
	            var text = object_1.getDotVal(data, this.vdom.forObjectKey + "." + index);
	            obj[this.vdom.forKey] = text;
	            var _loop_2 = function (n) {
	                var normalDOM = template[n];
	                var childEle = startElem.childNodes[n]; // 真实dom和虚拟dom是一样个数
	                switch (normalDOM.nodeType) {
	                    case constant_2.NodeType.TEXT:
	                        DomUtil.changeTextContent(childEle, template_1.compileTpl(normalDOM.template, obj));
	                        break;
	                    case constant_2.NodeType.ELEMENT:
	                        normalDOM.children.forEach(function (child) {
	                            child.reRender(Kmv, childEle);
	                        });
	                        break;
	                }
	            };
	            for (var n = 0; n < template.length; n++) {
	                _loop_2(n);
	            }
	            index++;
	        }
	    };
	    ForDOM.prototype.reRenderChild = function (node, data) {
	        var template = node.template;
	        node.firstChild.nodeValue = template_1.compileTpl(template, data);
	    };
	    ForDOM.prototype.pushDOM = function (Kmv, i) {
	        var data = Kmv.$data;
	        var elem = document.createElement(this.vdom.tagName);
	        var text = object_1.getDotVal(data, this.vdom.forObjectKey + "." + i);
	        var template = this.vdom.template;
	        var obj = object_1.depCopy(data);
	        obj[this.vdom.forKey] = text;
	        var _loop_3 = function (n) {
	            var newEle;
	            var normalDOM = template[n];
	            switch (normalDOM.nodeType) {
	                case constant_2.NodeType.TEXT:
	                    newEle = DomUtil.createTextNode(template_1.compileTpl(normalDOM.template, obj));
	                    break;
	                case constant_2.NodeType.ELEMENT:
	                    newEle = document.createElement(normalDOM.tagName);
	                    newEle.template = normalDOM.template;
	                    var text_2 = template_1.compileTpl(normalDOM.template, obj);
	                    if (normalDOM.children) {
	                        normalDOM.children.forEach(function (child) {
	                            newEle.appendChild(child.transDOM(Kmv));
	                        });
	                    }
	                    else {
	                        newEle.innerText = text_2;
	                    }
	                    DomUtil.copyAttr(newEle, normalDOM.attributes, Kmv);
	                    break;
	            }
	            newEle && elem.appendChild(newEle);
	        };
	        for (var n = 0; n < template.length; n++) {
	            _loop_3(n);
	        }
	        for (var n = 0; n < this.vdom.children.length; n++) {
	            elem.appendChild(this.vdom.children[n].transDOM(data));
	        }
	        // DomUtil.copyAttr(elem, this.vdom.attributes, Kmv);
	        DomUtil.inserBefore(this.vdom.nextSibling, elem);
	    };
	    ForDOM.prototype.popDOM = function () {
	        DomUtil.deleteNode(this.vdom.nextSibling.parentNode, this.vdom.nextSibling.previousSibling);
	    };
	    ForDOM.prototype.shiftDOM = function () {
	        DomUtil.deleteNode(this.vdom.previousSibling.parentNode, this.vdom.previousSibling.nextSibling);
	    };
	    ForDOM.prototype.changeText = function (data, i) {
	        var start = this.vdom.previousSibling;
	        var end = this.vdom.nextSibling;
	        var index = -1;
	        while (start != end && index < i) {
	            start = start.nextSibling;
	            index++;
	        }
	        var text = object_1.getDotVal(data, this.vdom.forObjectKey + "." + index);
	        DomUtil.changeNodeValue(start, text);
	    };
	    return ForDOM;
	}());
	exports.ForDOM = ForDOM;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var template_1 = __webpack_require__(2);
	var DomUtil = __webpack_require__(6);
	var constant_1 = __webpack_require__(3);
	var NormalDOM = (function () {
	    function NormalDOM(node) {
	        this.children = [];
	        // h3
	        this.tagName = node.tagName, this.attributes = node.attributes,
	            this.nodeType = node.nodeType;
	        switch (node.nodeType) {
	            case constant_1.NodeType.TEXT:
	                this.template = node.textContent;
	                break;
	            case constant_1.NodeType.ELEMENT:
	                this.template = node.firstChild.nodeValue;
	                break;
	        }
	        if (node.childNodes) {
	            for (var i = 0; i < node.childNodes.length; i++) {
	                var child = node.childNodes[i];
	                this.children.push(new NormalDOM(child));
	            }
	        }
	    }
	    NormalDOM.prototype.transDOM = function (Kmv) {
	        var data = Kmv.$data;
	        var newEle;
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                newEle = DomUtil.createTextNode(this.tagName);
	                newEle.textContent = template_1.compileTpl(this.template, data);
	                break;
	            case constant_1.NodeType.ELEMENT:
	                newEle = document.createElement(this.tagName);
	                newEle.template = this.template;
	                var text = template_1.compileTpl(this.template, data);
	                newEle.innerText = text;
	                DomUtil.copyAttr(newEle, this.attributes, Kmv);
	                break;
	        }
	        return newEle;
	    };
	    NormalDOM.prototype.reRender = function (Kmv, parentNode) {
	        var data = Kmv.$data;
	        var text = template_1.compileTpl(this.template, data);
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                DomUtil.changeTextContent(parentNode, text);
	                break;
	            case constant_1.NodeType.ELEMENT:
	                // DomUtil.changeNodeValue(this.dom, text)
	                break;
	        }
	    };
	    return NormalDOM;
	}());
	exports.NormalDOM = NormalDOM;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map