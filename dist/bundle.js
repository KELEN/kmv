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
	var observer_1 = __webpack_require__(2);
	var RenderQueue_1 = __webpack_require__(5);
	var event_1 = __webpack_require__(20);
	var object_1 = __webpack_require__(3);
	function Kmv(opts) {
	    var elSelector = opts['el'];
	    var elem = document.querySelector(elSelector);
	    this.data = opts.data;
	    // 原始数据
	    this.watch = opts.watch || {};
	    this.pendingValue = false;
	    this.pendingArray = false;
	    this.changeQueue = []; // 每次循环改变队列
	    this.methods = opts.methods; // 自定义事件
	    this.components = opts.components;
	    // 获取需要渲染的dom列表
	    this.renderQueue = new RenderQueue_1.RenderQueue(elem, this);
	    var that = this;
	    if (opts.beforeInit) {
	        var event_2 = new event_1.Event();
	        event_2.$once("initData", function (data) {
	            var allData = object_1.extend(opts.data, data);
	            that.$data = observer_1.observer(allData, that);
	            render_1.renderInit(that);
	        });
	        opts.beforeInit.call(that, event_2);
	    }
	    else {
	        this.$data = observer_1.observer(opts.data, this);
	        render_1.renderInit(this);
	    }
	    return this;
	}
	var init = function (kmv) {
	};
	window.Kmv = Kmv;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Kmv;


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	exports.renderInit = function (kmv) {
	    var watcher = kmv.renderQueue;
	    var renderQueue = watcher.getQueue();
	    for (var i = 0; i < renderQueue.length; i++) {
	        var node = renderQueue[i];
	        node.renderInit(kmv);
	    }
	    exports.nextTick(kmv);
	};
	var nextTickHandler = function (kmv) {
	    if (kmv.pendingValue) {
	        console.log("reRender");
	        kmv.pendingValue = false;
	        var lastOne = kmv.changeQueue.pop();
	        exports.reRender(lastOne.kmv, lastOne.bigKey);
	        kmv.changeQueue.length = 0;
	    }
	    exports.nextTick(kmv);
	};
	exports.nextTick = function (kmv) {
	    setTimeout(function () {
	        // 下一次事件循环
	        nextTickHandler(kmv);
	    }, 0);
	};
	exports.reRender = function (kmv, key) {
	    var renderQueue = kmv.renderQueue.getQueue();
	    for (var i = 0; i < renderQueue.length; i++) {
	        var node = renderQueue[i];
	        node.reRender(kmv);
	    }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ObjectUtil = __webpack_require__(3);
	var constant_1 = __webpack_require__(4);
	var object_1 = __webpack_require__(3);
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
	                    kmv.pendingValue = true;
	                    kmv.changeQueue.push({
	                        kmv: kmv,
	                        bigKey: bigKey
	                    });
	                    kmv.watch[bigKey] && kmv.watch[bigKey].call(kmv.data, newVal);
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
	    // 监听array操作
	    constant_1.ArrayMethod.forEach(function (method) {
	        Object.defineProperty(arr, method, {
	            configurable: false,
	            enumerable: false,
	            writable: false,
	            value: function () {
	                Array.prototype[method].apply(object_1.getDotVal(kmv.$data, bigKey), arguments);
	                kmv.changeQueue.push({
	                    kmv: kmv,
	                    bigKey: bigKey
	                });
	                kmv.pendingValue = true;
	            }
	        });
	    });
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(4);
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
	exports.extend = function (srcObj, extObj) {
	    for (var i in extObj) {
	        srcObj[i] = extObj[i];
	    }
	    return srcObj;
	};


/***/ },
/* 4 */
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
	    arithmeticOp: /\*|\+|-\/|\(|\)/g,
	    inputElement: /INPUT|TEXTAREA/,
	    arrtibuteKey: /k-for|k-model|k-if|k:.*|k-on:(.*)/,
	    kAttribute: /k:(.*)/,
	    kOnAttribute: /k-on:(.*)/,
	    methodAndParam: /([a-zA-Z\d_]+)\((.*)\)/,
	    isTernaryOp: /!.*|!!.*|.+?.+:.+/,
	    ternaryOpSplit: /\?|:|\(|\)|!!/,
	    isNormalHtmlTag: /html|body|base|head|link|meta|style|title|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|hgroup|nav|section|div|dd|dl|dt|figcaption|figure|hr|img|li|main|ol|p|pre|ul|a|b|abbr|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|rtc|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|map|track|video|embed|object|param|source|canvas|script|noscript|del|ins|caption|col|colgroup|table|thead|tbody|td|th|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|menuitem|summary|content|element|shadow|template/i
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(4);
	var ForDOM_1 = __webpack_require__(6);
	var NormalDOM_1 = __webpack_require__(16);
	var InputDOM_1 = __webpack_require__(18);
	var IfDOM_1 = __webpack_require__(17);
	var validator_1 = __webpack_require__(13);
	var ComponentDOM_1 = __webpack_require__(19);
	var RenderQueue = (function () {
	    function RenderQueue(node, kmv) {
	        this.queue = [];
	        this.kmv = kmv;
	        this.queue = this.queueInit(node);
	    }
	    RenderQueue.prototype.getQueue = function () {
	        return this.queue;
	    };
	    RenderQueue.prototype.queueInit = function (parentNode) {
	        var childNodes = parentNode.childNodes;
	        for (var i = 0; i < childNodes.length; i++) {
	            var child = childNodes[i];
	            switch (child.nodeType) {
	                case constant_1.NodeType.TEXT:
	                    this.queue.push(new NormalDOM_1.NormalDOM(child));
	                    break;
	                case constant_1.NodeType.ELEMENT:
	                    if (validator_1.isUnknowElement(child.tagName)) {
	                        // 组件
	                        this.queue.push(new ComponentDOM_1.ComponentDOM(child, this.kmv).transNormalDOM());
	                    }
	                    else {
	                        if (child.getAttribute("k-for")) {
	                            this.queue.push(new ForDOM_1.ForDOM(child));
	                        }
	                        else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
	                            this.queue.push(new InputDOM_1.InputDOM(child));
	                        }
	                        else if (child.getAttribute("k-if")) {
	                            this.queue.push(new IfDOM_1.IfDOM(child));
	                        }
	                        else {
	                            this.queue.push(new NormalDOM_1.NormalDOM(child));
	                        }
	                    }
	                    break;
	            }
	        }
	        return this.queue;
	    };
	    return RenderQueue;
	}());
	exports.RenderQueue = RenderQueue;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ForItemDOM_1 = __webpack_require__(7);
	var constant_1 = __webpack_require__(4);
	var object_1 = __webpack_require__(3);
	var DomOp = __webpack_require__(8);
	var array_1 = __webpack_require__(15);
	var ForDOM = (function () {
	    function ForDOM(node) {
	        this.childrenVdom = [];
	        this.renderType = constant_1.RenderType.FOR;
	        this.previousSibling = node.previousSibling;
	        this.nextSibling = node.nextSibling;
	        this.parentNode = node.parentNode;
	        this.templateNode = node;
	        this.isList = true;
	        this.connect(node.previousElementSibling, node.nextElementSibling);
	        var forString = node.getAttribute("k-for");
	        var match = constant_1.RegexpStr.forStatement.exec(forString);
	        this.tagName = node.tagName;
	        this.forString = forString;
	        this.forObjectKey = match[2].trim();
	        this.forKey = match[1].trim();
	        DomOp.removeNode(node);
	    }
	    ForDOM.prototype.renderInit = function (kmv) {
	        var iteratorData = object_1.getDotVal(kmv.$data, this.forObjectKey);
	        var docFrag = document.createDocumentFragment();
	        if (Array.isArray(iteratorData)) {
	            // 数组循环
	            this.iteratorData = iteratorData.slice(0);
	            for (var i = 0; i < this.iteratorData.length; i++) {
	                var forItem = new ForItemDOM_1.ForItemDOM(this.templateNode);
	                this.childrenVdom.push(forItem);
	                var forItemDom = forItem.transDOM(this.iteratorData[i], this.forKey, kmv);
	                docFrag.appendChild(forItemDom);
	            }
	        }
	        else if (typeof iteratorData === 'object') {
	            // 对象循环
	            this.iteratorData = iteratorData;
	            for (var i in iteratorData) {
	                var forItem = new ForItemDOM_1.ForItemDOM(this.templateNode);
	                this.childrenVdom.push(forItem);
	                var forItemDom = forItem.transDOM(iteratorData[i], this.forKey, kmv);
	                docFrag.appendChild(forItemDom);
	            }
	        }
	        if (this.previousSibling) {
	            DomOp.insertAfter(this.previousSibling, docFrag);
	        }
	        else if (this.parentNode) {
	            DomOp.appendChild(this.parentNode, docFrag);
	        }
	    };
	    ForDOM.prototype.connect = function (realPrevDom, realNextDom) {
	        realPrevDom && (realPrevDom.$nextSibling = this);
	        this.$nextSibling = realNextDom;
	    };
	    ForDOM.prototype.reRender = function (kmv) {
	        var arrKey = this.forObjectKey;
	        var newArray = object_1.getDotVal(kmv.$data, arrKey);
	        if (Array.isArray(newArray)) {
	            var change = array_1.diff(this.iteratorData, newArray);
	            if (change.length) {
	                this.notifyDataChange(change, kmv);
	            }
	            else {
	                for (var i = 0, len = this.iteratorData.length; i < len; i++) {
	                    this.childrenVdom[i].reRender(this.iteratorData[i], this.forKey, kmv);
	                }
	            }
	        }
	        else {
	            // 渲染对象
	            var idx = 0;
	            for (var key in this.iteratorData) {
	                this.childrenVdom[idx].reRender(this.iteratorData[key], this.forKey, kmv);
	                idx++;
	            }
	        }
	    };
	    ForDOM.prototype.notifyDataChange = function (change, kmv) {
	        var data = kmv.$data;
	        var arrKey = this.forObjectKey;
	        var arrayData = object_1.getDotVal(data, arrKey) || [];
	        if (Array.isArray(this.iteratorData)) {
	            this.iteratorData = arrayData.slice(0);
	            for (var i = 0; i < change.length; i++) {
	                var op = change[i].op;
	                if (change[i].batch) {
	                    switch (op) {
	                        case constant_1.ArrayOp.PUSH:
	                            this.batchAdd(change[i].array, kmv);
	                            break;
	                    }
	                }
	                else {
	                    switch (op) {
	                        case constant_1.ArrayOp.PUSH:
	                            this.addNewItem(change[i].text, kmv);
	                            break;
	                        case constant_1.ArrayOp.POP:
	                            this.popItem();
	                            break;
	                        case constant_1.ArrayOp.CHANGE:
	                            this.changeItem(change[i].index, kmv);
	                            break;
	                        case constant_1.ArrayOp.SHIFT:
	                            this.shiftItem();
	                            break;
	                    }
	                }
	            }
	        }
	    };
	    ForDOM.prototype.batchAdd = function (arr, kmv) {
	        if (arr === void 0) { arr = []; }
	        var docFrag = document.createDocumentFragment();
	        for (var i = 0, len = arr.length; i < len; i++) {
	            var newItem = new ForItemDOM_1.ForItemDOM(this.templateNode);
	            this.childrenVdom.push(newItem);
	            var newDom = newItem.transDOM(arr[i], this.forKey, kmv);
	            docFrag.appendChild(newDom);
	        }
	        if (this.nextSibling) {
	            DomOp.inserBefore(this.nextSibling, docFrag);
	        }
	        else if (this.parentNode) {
	            DomOp.appendChild(this.parentNode, docFrag);
	        }
	    };
	    ForDOM.prototype.addNewItem = function (val, kmv) {
	        var newItem = new ForItemDOM_1.ForItemDOM(this.templateNode);
	        var newDom = newItem.transDOM(val, this.forKey, kmv);
	        this.childrenVdom.push(newItem);
	        DomOp.inserBefore(this.nextSibling, newDom);
	    };
	    ForDOM.prototype.popItem = function () {
	        var popVdom = this.childrenVdom.pop();
	        popVdom.$dom && DomOp.removeNode(popVdom.$dom);
	    };
	    ForDOM.prototype.changeItem = function (i, kmv) {
	        this.childrenVdom[i].reRender(this.iteratorData[i], this.forKey, kmv);
	    };
	    ForDOM.prototype.shiftItem = function () {
	        var shiftVdom = this.childrenVdom.shift();
	        this.childrenVdom.shift();
	        DomOp.removeNode(shiftVdom.$dom);
	    };
	    return ForDOM;
	}());
	exports.ForDOM = ForDOM;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var DomUtil = __webpack_require__(8);
	var object_1 = __webpack_require__(3);
	var ForNormalDOM_1 = __webpack_require__(9);
	var VDOM_1 = __webpack_require__(12);
	var ForItemDOM = (function (_super) {
	    __extends(ForItemDOM, _super);
	    function ForItemDOM(node) {
	        var _this = _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        for (var i = 0; i < node.childNodes.length; i++) {
	            var childNode = node.childNodes[i];
	            _this.childrenVdom.push(new ForNormalDOM_1.ForNormalDOM(childNode));
	        }
	        node.removeAttribute("k-for");
	        _this.tagName = node.tagName;
	        _this.templateNode = node;
	        _this.attributes = node.attributes;
	        _this.nodeType = node.nodeType;
	        return _this;
	    }
	    ForItemDOM.prototype.transDOM = function (iteratorVal, iteratorKey, kmv) {
	        var data = object_1.depCopy(kmv.$data);
	        data[iteratorKey] = iteratorVal; // 构建迭代对象 eg: obj.i = 100;
	        var newElem = DomUtil.createElement(this.tagName);
	        for (var i = 0; i < this.childrenVdom.length; i++) {
	            kmv.$$data = data;
	            newElem.appendChild(this.childrenVdom[i].transDOM(kmv));
	        }
	        this.$dom = newElem;
	        this.renderAttr(kmv);
	        return newElem;
	    };
	    // 重新渲染
	    ForItemDOM.prototype.reRender = function (iteratorVal, iteratorKey, kmv) {
	        var data = object_1.depCopy(kmv.$data);
	        data[iteratorKey] = iteratorVal; // 构建迭代对象 eg: obj.i = 100;
	        kmv.$$data = data;
	        this.childrenVdom.forEach(function (child) {
	            child.reRender(kmv);
	        });
	        this.renderAttr(kmv);
	    };
	    return ForItemDOM;
	}(VDOM_1.VDOM));
	exports.ForItemDOM = ForItemDOM;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	exports.insertAfter = function (node, newNode) {
	    node && node.parentNode && node.parentNode.insertBefore(newNode, node.nextSibling);
	};
	exports.appendChild = function (parent, child) {
	    parent && child && (parent.appendChild(child));
	};
	exports.createTextNode = function (text) {
	    return document.createTextNode(text);
	};
	exports.createElement = function (tagName) {
	    return document.createElement(tagName);
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
	exports.removeNode = function (node) {
	    node && node.parentNode.removeChild(node);
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var template_1 = __webpack_require__(10);
	var DomUtil = __webpack_require__(8);
	var constant_1 = __webpack_require__(4);
	var VDOM_1 = __webpack_require__(12);
	var ForNormalDOM = (function (_super) {
	    __extends(ForNormalDOM, _super);
	    function ForNormalDOM(node) {
	        var _this = _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        // h3
	        _this.tagName = node.tagName, _this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0)),
	            _this.nodeType = node.nodeType;
	        switch (node.nodeType) {
	            case constant_1.NodeType.TEXT:
	                _this.template = node.textContent;
	                break;
	            case constant_1.NodeType.ELEMENT:
	                _this.template = node.firstChild.nodeValue;
	                break;
	        }
	        if (node.childNodes) {
	            for (var i = 0; i < node.childNodes.length; i++) {
	                var child = node.childNodes[i];
	                _this.childrenVdom.push(new ForNormalDOM(child));
	            }
	        }
	        return _this;
	    }
	    ForNormalDOM.prototype.transDOM = function (kmv) {
	        var data = kmv.$$data;
	        var newEle = document.createElement(this.tagName);
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                newEle = DomUtil.createTextNode(this.tagName);
	                newEle.textContent = template_1.compileTpl(this.template, data);
	                this.$dom = newEle;
	                break;
	            case constant_1.NodeType.ELEMENT:
	                newEle = document.createElement(this.tagName);
	                this.$dom = newEle;
	                this.childrenVdom
	                    &&
	                        this.childrenVdom.forEach(function (child) {
	                            newEle.appendChild(child.transDOM(kmv));
	                        });
	                this.renderAttr(kmv);
	                break;
	        }
	        this.renderAttr(kmv);
	        return newEle;
	    };
	    ForNormalDOM.prototype.reRender = function (kmv) {
	        var data = kmv.$$data; // $$data迭代的每一个对象
	        var text = template_1.compileTpl(this.template, data);
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                DomUtil.changeTextContent(this.$dom, text);
	                break;
	            case constant_1.NodeType.ELEMENT:
	                this.childrenVdom.forEach(function (child) {
	                    child.reRender(kmv);
	                });
	                break;
	        }
	    };
	    return ForNormalDOM;
	}(VDOM_1.VDOM));
	exports.ForNormalDOM = ForNormalDOM;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(4);
	var object_1 = __webpack_require__(3);
	var function_1 = __webpack_require__(11);
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
	    var res = eval(newStr);
	    return res;
	};
	exports.transTernaryOperator = function (tpl, obj) {
	    var arr = tpl.split(/\?|:|\(|\)|\+|-|\*|\/|!/);
	    var match = tpl.match(/\?|:|\(|\)|\+|-|\*|\/|!/g);
	    var newStr = '';
	    for (var i = 0; i < arr.length; i++) {
	        var item = arr[i].trim();
	        if (item && constant_1.RegexpStr.isParams.test(item)) {
	            newStr += '_data.' + item;
	        }
	        else {
	            newStr += item;
	        }
	        if (match[i])
	            newStr += match[i];
	    }
	    return (function (str, _data) {
	        return eval(str);
	    })(newStr, obj);
	};
	exports.compileTpl = function (tpl, obj) {
	    var braceReg = constant_1.RegexpStr.brace;
	    var regRes;
	    while (regRes = braceReg.exec(tpl)) {
	        var key = regRes ? regRes[1].trim() : ''; // 获取括号的键
	        if (key) {
	            var text = function_1.evalJs(key, obj);
	            tpl = tpl.replace(braceReg, text);
	        }
	        else {
	            return '';
	        }
	    }
	    /*var regRes;
	    while (regRes = braceReg.exec(tpl)) {
	        let key = regRes ? regRes[1].trim() : '';	// 获取括号的键
	        let opReg = RegexpStr.arithmeticOp;     // 是否有操作符
	        let text = '';
	        if (key) {
	            if (opReg.test(key)) {
	                text = transArithmeticOp(key, obj);
	            } else if (RegexpStr.isTernaryOp.test(key)) {
	                text = transTernaryOperator(key, obj);
	            } else {
	                text = getDotVal(obj, key);
	            }
	            tpl = tpl.replace(braceReg, text);
	        } else {
	            return '';
	        }
	    }*/
	    return tpl;
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	exports.evalJs = function (content, obj) {
	    // console.dir(obj);
	    // return (function() { return eval(content) }).call(obj);
	    return new Function("with(this){ return " + content + " }").call(obj);
	};
	exports.evalFunc = function (code) {
	    return new Function("with(this){ console.log(this); return " + code + " }");
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var template_1 = __webpack_require__(10);
	var constant_1 = __webpack_require__(4);
	var validator_1 = __webpack_require__(13);
	var constant_2 = __webpack_require__(4);
	var event_1 = __webpack_require__(14);
	var object_1 = __webpack_require__(3);
	var VDOM = (function () {
	    function VDOM(node) {
	        this.vdomAttr = {};
	        node.attributes && (this.attributes = [].slice.call(node.attributes).slice(0));
	    }
	    VDOM.prototype.renderAttr = function (kmv) {
	        if (this.nodeType === constant_1.NodeType.ELEMENT) {
	            var data = kmv.$data;
	            var node = this.$dom;
	            var attrs = this.attributes;
	            for (var i = 0; i < attrs.length; i++) {
	                var attr = attrs[i];
	                var attrName = attr.nodeName, attrVal = attr.nodeValue;
	                if (constant_2.RegexpStr.kAttribute.test(attrName)) {
	                    var key = attr.nodeName.replace(constant_2.RegexpStr.kAttribute, '$1');
	                    if (key === 'class') {
	                        // 类 a:'class2', b:'class2'
	                        var arr = attrVal.split(",");
	                        var valRes = "";
	                        for (var n = 0; n < arr.length; n++) {
	                            var ak = arr[n].split(":")[0];
	                            if (object_1.getDotVal(data, ak.trim())) {
	                                valRes += arr[n].split(":")[1].trim() + " ";
	                            }
	                        }
	                        node.setAttribute(key, valRes.trim());
	                        node.removeAttribute(attrName);
	                    }
	                    else {
	                        var val = template_1.compileTpl(attrVal, data);
	                        node.setAttribute(key, val);
	                        node.removeAttribute(attrName);
	                    }
	                }
	                else if (constant_2.RegexpStr.kOnAttribute.test(attrName)) {
	                    var event_2 = attrName.replace(constant_2.RegexpStr.kOnAttribute, '$1');
	                    var func = template_1.compileTpl(attrVal, data);
	                    var match = func.match(constant_2.RegexpStr.methodAndParam);
	                    var method = match[1];
	                    var params = match[2];
	                    event_1.bindEvent(node, event_2, method, params, kmv.methods, kmv.data);
	                    node.removeAttribute(attrName);
	                }
	                else {
	                    node.setAttribute(attrName, attrVal);
	                }
	            }
	        }
	    };
	    VDOM.prototype.reRenderAttr = function (kmv) {
	        var data = kmv.$data;
	        var node = this.$dom;
	        for (var i = 0; i < this.attributes.length; i++) {
	            var attr = this.attributes[i];
	            var attrName = attr.nodeName, attrVal = attr.nodeValue;
	            if (validator_1.isKvmAttribute(attrName)) {
	                if (constant_2.RegexpStr.kAttribute.test(attrName)) {
	                    var key = attr.nodeName.replace(constant_2.RegexpStr.kAttribute, '$1');
	                    if (key === 'class') {
	                        // 类 a:'class2', b:'class2'
	                        var arr = attrVal.split(",");
	                        var valRes = "";
	                        for (var n = 0; n < arr.length; n++) {
	                            var ak = arr[n].split(":")[0];
	                            if (object_1.getDotVal(data, ak.trim())) {
	                                valRes += arr[n].split(":")[1].trim() + " ";
	                            }
	                        }
	                        node.setAttribute(key, valRes.trim());
	                        node.removeAttribute(attrName);
	                    }
	                    else {
	                        var val = template_1.compileTpl(attrVal, data);
	                        node.setAttribute(key, val);
	                        node.removeAttribute(attrName);
	                    }
	                }
	                else if (constant_2.RegexpStr.kOnAttribute.test(attrName)) {
	                    var event_3 = attrName.replace(constant_2.RegexpStr.kOnAttribute, '$1');
	                    var func = template_1.compileTpl(attrVal, data);
	                    var match = func.match(constant_2.RegexpStr.methodAndParam);
	                    var method = match[1];
	                    var params = match[2];
	                    node.removeAttribute(attrName);
	                }
	                else {
	                    node.setAttribute(attrName, template_1.compileTpl(attrVal, data));
	                }
	            }
	            else {
	                node.setAttribute(attrName, attrVal);
	            }
	        }
	    };
	    return VDOM;
	}());
	exports.VDOM = VDOM;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(4);
	exports.isBraceReg = function (str) {
	    return constant_1.RegexpStr.brace.test(str);
	};
	/**
	 *  是否有包含语法
	 * @param str
	 */
	exports.isForStatement = function (str) {
	    return constant_1.RegexpStr.forStatement.test(str);
	};
	exports.isKvmAttribute = function (key) {
	    return constant_1.RegexpStr.arrtibuteKey.test(key);
	};
	exports.isUnknowElement = function (tag) {
	    var el = document.createElement(tag);
	    if (tag.indexOf('-') > -1) {
	        // http://stackoverflow.com/a/28210364/1070244
	        return (el.constructor === window.HTMLUnknownElement ||
	            el.constructor === window.HTMLElement);
	    }
	    else {
	        return /HTMLUnknownElement/.test(el.toString());
	    }
	};


/***/ },
/* 14 */
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var constant_1 = __webpack_require__(4);
	exports.diff = function (arr1, arr2) {
	    if (arr1 === void 0) { arr1 = []; }
	    if (arr2 === void 0) { arr2 = []; }
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
	        // 删除dom
	        for (var i = 0; i < deleteArr.length; i++) {
	            change.push({
	                op: constant_1.ArrayOp.POP,
	                index: i + len2,
	                text: deleteArr[i]
	            });
	        }
	    }
	    else if (len2 > len1) {
	        var addArr = arr2.slice(len1);
	        change.push({
	            batch: true,
	            op: constant_1.ArrayOp.PUSH,
	            array: addArr
	        });
	    }
	    return change;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var template_1 = __webpack_require__(10);
	var DomUtil = __webpack_require__(8);
	var constant_1 = __webpack_require__(4);
	var VDOM_1 = __webpack_require__(12);
	var ForDOM_1 = __webpack_require__(6);
	var IfDOM_1 = __webpack_require__(17);
	var InputDOM_1 = __webpack_require__(18);
	var NormalDOM = (function (_super) {
	    __extends(NormalDOM, _super);
	    function NormalDOM(node) {
	        var _this = _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        // h3
	        _this.tagName = node.tagName,
	            _this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0)),
	            _this.nodeType = node.nodeType;
	        _this.$dom = node;
	        switch (node.nodeType) {
	            case constant_1.NodeType.TEXT:
	                _this.template = node.textContent;
	                node.textContent = '';
	                break;
	            case constant_1.NodeType.ELEMENT:
	                _this.template = node.firstChild ? node.firstChild.nodeValue : '';
	                break;
	        }
	        if (node.childNodes) {
	            for (var i = 0; i < node.childNodes.length; i++) {
	                var child = node.childNodes[i];
	                if (child.nodeType === constant_1.NodeType.ELEMENT) {
	                    if (child.getAttribute("k-for")) {
	                        _this.childrenVdom.push(new ForDOM_1.ForDOM(child));
	                    }
	                    else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
	                        _this.childrenVdom.push(new InputDOM_1.InputDOM(child));
	                    }
	                    else if (child.getAttribute("k-if")) {
	                        _this.childrenVdom.push(new IfDOM_1.IfDOM(child));
	                    }
	                    else {
	                        _this.childrenVdom.push(new NormalDOM(child));
	                    }
	                }
	                else {
	                    _this.childrenVdom.push(new NormalDOM(child));
	                }
	            }
	        }
	        return _this;
	    }
	    NormalDOM.prototype.renderInit = function (kmv) {
	        var data = kmv.$data;
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                DomUtil.changeTextContent(this.$dom, template_1.compileTpl(this.template, data));
	                break;
	            case constant_1.NodeType.ELEMENT:
	                this.childrenVdom.forEach(function (child) {
	                    child.renderInit(kmv);
	                });
	                this.renderAttr(kmv);
	                break;
	        }
	    };
	    NormalDOM.prototype.reRender = function (kmv) {
	        var data = kmv.$data;
	        var text = template_1.compileTpl(this.template, data);
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                DomUtil.changeTextContent(this.$dom, text);
	                break;
	            case constant_1.NodeType.ELEMENT:
	                this.childrenVdom.forEach(function (child) {
	                    child.reRender(kmv);
	                });
	                this.reRenderAttr(kmv);
	                break;
	        }
	    };
	    return NormalDOM;
	}(VDOM_1.VDOM));
	exports.NormalDOM = NormalDOM;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var VDOM_1 = __webpack_require__(12);
	var object_1 = __webpack_require__(3);
	var IfDOM = (function (_super) {
	    __extends(IfDOM, _super);
	    function IfDOM(node) {
	        var _this = _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        // h3
	        _this.tagName = node.tagName, _this.attributes = node.attributes,
	            _this.nodeType = node.nodeType;
	        _this.kif = node.getAttribute("k-if");
	        _this.$dom = node;
	        node.removeAttribute("k-if");
	        return _this;
	    }
	    IfDOM.prototype.renderInit = function (kmv) {
	        var data = kmv.$data;
	        var isShow = object_1.getDotVal(data, this.kif);
	        if (!!isShow) {
	            this.$dom.style.display = "block";
	        }
	        else {
	            this.$dom.style.display = "none";
	        }
	    };
	    IfDOM.prototype.reRender = function (kmv) {
	        var data = kmv.$data;
	        var isShow = object_1.getDotVal(data, this.kif);
	        if (!!isShow) {
	            this.$dom.style.display = "block";
	        }
	        else {
	            this.$dom.style.display = "none";
	        }
	    };
	    return IfDOM;
	}(VDOM_1.VDOM));
	exports.IfDOM = IfDOM;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var object_1 = __webpack_require__(3);
	var InputDOM = (function () {
	    function InputDOM(node) {
	        this.childrenVdom = [];
	        // h3
	        this.tagName = node.tagName, this.attributes = node.attributes,
	            this.nodeType = node.nodeType;
	        this.kmodel = node.getAttribute("k-model");
	        this.$dom = node;
	        node.removeAttribute("k-model");
	    }
	    InputDOM.prototype.renderInit = function (kmv) {
	        var _this = this;
	        var data = kmv.$data;
	        this.$dom.value = object_1.getDotVal(data, this.kmodel);
	        this.$dom.oninput = function (ev) {
	            object_1.setObserveDotVal(kmv.data, _this.kmodel, _this.$dom.value);
	        };
	    };
	    InputDOM.prototype.reRender = function (kmv) {
	        var data = kmv.$data;
	        var text = object_1.getDotVal(data, this.kmodel);
	        this.$dom.value = text;
	    };
	    return InputDOM;
	}());
	exports.InputDOM = InputDOM;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var NormalDOM_1 = __webpack_require__(16);
	var VDOM_1 = __webpack_require__(12);
	var DomOp = __webpack_require__(8);
	var ComponentDOM = (function (_super) {
	    __extends(ComponentDOM, _super);
	    function ComponentDOM(node, kmv) {
	        var _this = _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        _this.tagName = node.tagName;
	        var component = kmv.components[_this.tagName.toLowerCase()];
	        if (component) {
	            var div = document.createElement("div");
	            div.innerHTML = component.template;
	            var firstChild = div.firstChild;
	            _this.$dom = firstChild;
	            DomOp.inserBefore(node, _this.$dom);
	            DomOp.removeNode(node);
	        }
	        else {
	            // 无效标签
	            console.error("无效标签" + _this.tagName);
	        }
	        return _this;
	    }
	    ComponentDOM.prototype.transNormalDOM = function () {
	        return new NormalDOM_1.NormalDOM(this.$dom);
	    };
	    return ComponentDOM;
	}(VDOM_1.VDOM));
	exports.ComponentDOM = ComponentDOM;


/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	var Event = (function () {
	    function Event() {
	        var _this = this;
	        this.eventObject = {};
	        this.$on = function (event, fn) {
	            _this.eventObject[event] = {
	                fn: fn,
	                once: false
	            };
	        };
	        this.$once = function (event, fn) {
	            _this.eventObject[event] = {
	                fn: fn,
	                once: true
	            };
	        };
	        this.$emit = function (event, params) {
	            var thisEvent = _this.eventObject[event];
	            if (thisEvent) {
	                if (thisEvent.once) {
	                    thisEvent['fn'].apply(_this, [].concat(params));
	                    delete _this.eventObject[event];
	                }
	                else {
	                    thisEvent['fn'].apply(_this, [].concat(params));
	                }
	            }
	        };
	    }
	    return Event;
	}());
	exports.Event = Event;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map