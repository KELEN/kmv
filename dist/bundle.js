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
	Object.defineProperty(exports, "__esModule", { value: true });
	var render_1 = __webpack_require__(1);
	var observer_1 = __webpack_require__(2);
	var RenderQueue_1 = __webpack_require__(6);
	var event_1 = __webpack_require__(19);
	var object_1 = __webpack_require__(4);
	function Kmv(opts) {
	    var elSelector = opts['el'];
	    var elem = document.querySelector(elSelector);
	    if (!elem) {
	        console.error("元素" + elSelector + "不存在!");
	        return;
	    }
	    this.data = opts.data;
	    // 原始数据
	    this.watch = opts.watch || {};
	    this.pendingValue = false;
	    this.changeQueue = []; // 每次循环改变队列
	    this.methods = opts.methods; // 自定义事件
	    this.components = object_1.extend(this.components, opts.components);
	    this.mounted = typeof opts.mounted === 'function' ? opts.mounted : null;
	    var that = this;
	    if (opts.beforeInit) {
	        var event_2 = new event_1.Event();
	        // 初始化数据事件
	        event_2.$once("initData", function (data) {
	            var allData = object_1.extend(opts.data, data);
	            observer_1.observer(allData, that);
	            // 获取需要渲染的dom列表
	            that.renderQueue = new RenderQueue_1.RenderQueue(elem, this);
	            render_1.renderInit(that);
	        });
	        opts.beforeInit.call(that, event_2);
	    }
	    else {
	        observer_1.observer(opts.data, this);
	        // 获取需要渲染的dom列表
	        this.renderQueue = new RenderQueue_1.RenderQueue(elem, this);
	        render_1.renderInit(this);
	    }
	    this.mounted && this.mounted.call(this);
	    return this;
	}
	Kmv.components = function (name, config) {
	    if (!Kmv.prototype.components) {
	        Kmv.prototype.components = {};
	    }
	    Kmv.prototype.components[name] = config;
	};
	window.Kmv = Kmv;


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.renderInit = function (kmv) {
	    var watcher = kmv.renderQueue;
	    var renderQueue = watcher.getQueue();
	    for (var i = 0; i < renderQueue.length; i++) {
	        var node = renderQueue[i];
	        node.renderInit(kmv.data, kmv);
	    }
	    exports.nextTick(kmv);
	};
	var nextTickHandler = function (kmv) {
	    if (kmv.pendingValue) {
	        console.log("reRender");
	        kmv.pendingValue = false;
	        var lastOne = kmv.changeQueue.pop();
	        lastOne && exports.reRender(lastOne.kmv, lastOne.bigKey);
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
	        node.reRender(kmv.data, kmv);
	    }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
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
	    var srcData = object_1.depCopy(obj);
	    var _loop_1 = function (i) {
	        var bigKey = key ? key + "." + i : i;
	        var defVal = obj[i];
	        Object.defineProperty(obj, i, {
	            configurable: true,
	            set: function (newVal) {
	                kmv.pendingValue = true;
	                kmv.changeQueue.push({
	                    kmv: kmv,
	                    bigKey: bigKey
	                });
	                kmv.watch[bigKey] && kmv.watch[bigKey].call(kmv.data, newVal);
	                this['__' + i + '__'] = newVal;
	            },
	            get: function () {
	                return this['__' + i + '__'] == undefined ? defVal : this['__' + i + '__'];
	            }
	        });
	        if (typeof obj[i] == 'object') {
	            if (Array.isArray(obj[i])) {
	                arrayObserve(obj[i], kmv, bigKey);
	            }
	            else {
	                exports.observer(obj[i], kmv, bigKey);
	            }
	        }
	        /*((defVal) => {
	            let val = defVal;
	            Object.defineProperty(obj, i, {
	                set: function (newVal) {
	                    // ObjectUtil.setObserveDotVal(kmv.$data, bigKey, newVal);
	                    kmv.pendingValue = true;
	                    kmv.changeQueue.push({
	                        kmv: kmv,
	                        bigKey: bigKey
	                    });
	                    kmv.watch[bigKey] && kmv.watch[bigKey].call(kmv.data, newVal);
	                    val = newVal;
	                },
	                get: function() {
	                    return val; // getDotVal(kmv.$data, bigKey) || defVal;
	                }
	            })
	        })(obj[i])*/
	    };
	    for (var i in obj) {
	        _loop_1(i);
	    }
	    return srcData;
	};
	function arrayObserve(arr, kmv, bigKey) {
	    // 监听array操作
	    constant_1.ArrayMethod.forEach(function (method) {
	        Object.defineProperty(arr, method, {
	            configurable: true,
	            enumerable: false,
	            writable: true,
	            value: function () {
	                // 有可能操作的不是数组
	                Array.prototype[method].apply(arr, arguments);
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
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
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
	    forStatement: /([a-z_]+[\w]*)\s+in\s+([a-z_][\w.]+(\[.*\])*)/,
	    bracket: /\[['|"]?(\w+)['|"]?\]/,
	    isString: /'([^']*)'|"([^\"]*)"/,
	    isParams: /^[^"|^'\d]+.*/,
	    arithmeticOp: /\*|\+|-\/|\(|\)/g,
	    inputElement: /INPUT|TEXTAREA/,
	    arrtibuteKey: /k-for|k-model|k-if|k:.*|k-on:(.*)|k-show/,
	    kAttribute: /k:(.*)/,
	    kOnAttribute: /k-on:(.*)/,
	    methodAndParam: /([a-zA-Z\d_]+)\((.*)\)/,
	    isTernaryOp: /!.*|!!.*|.+?.+:.+/,
	    ternaryOpSplit: /\?|:|\(|\)|!!/,
	    isNormalHtmlTag: /html|body|base|head|link|meta|style|title|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|hgroup|nav|section|div|dd|dl|dt|figcaption|figure|hr|img|li|main|ol|p|pre|ul|a|b|abbr|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|rtc|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|map|track|video|embed|object|param|source|canvas|script|noscript|del|ins|caption|col|colgroup|table|thead|tbody|td|th|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|menuitem|summary|content|element|shadow|template/i,
	    isProps: /:(.*)/
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
	Object.defineProperty(exports, "__esModule", { value: true });
	var constant_1 = __webpack_require__(3);
	var array_1 = __webpack_require__(5);
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
	                newObj[i] = array_1.depCopyArray(obj[i]);
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
	    if (srcObj === void 0) { srcObj = {}; }
	    for (var i in extObj) {
	        srcObj[i] = extObj[i];
	    }
	    return srcObj;
	};
	exports.isNull = function (obj) {
	    var res;
	    for (var i in obj) {
	        if (obj.hasOwnProperty(i) && !obj[i]) {
	            res = true;
	        }
	    }
	    return !res || obj == null || Object.keys(obj).length === 0;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var constant_1 = __webpack_require__(3);
	exports.diff = function (arr1, arr2) {
	    if (arr1 === void 0) { arr1 = []; }
	    if (arr2 === void 0) { arr2 = []; }
	    var change = [];
	    var cp = arr1.slice(0), cp2 = arr2.slice(0); // 拷贝一份
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
	exports.depCopyArray = function (arr) {
	    if (typeof arr === 'object')
	        return JSON.parse(JSON.stringify(arr));
	    else {
	        return [];
	    }
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var constant_1 = __webpack_require__(3);
	var ForDOM_1 = __webpack_require__(7);
	var NormalDOM_1 = __webpack_require__(18);
	var InputDOM_1 = __webpack_require__(16);
	var validator_1 = __webpack_require__(14);
	var ComponentDOM_1 = __webpack_require__(17);
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
	                    this.queue.push(new NormalDOM_1.NormalDOM(child, this.kmv));
	                    break;
	                case constant_1.NodeType.ELEMENT:
	                    if (validator_1.isUnknowElement(child.tagName)) {
	                        // 组件
	                        this.queue.push(new ComponentDOM_1.ComponentDOM(child, this.kmv, null));
	                    }
	                    else {
	                        if (child.getAttribute("k-for")) {
	                            this.queue.push(new ForDOM_1.ForDOM(child, this.kmv, this.kmv.data));
	                        }
	                        else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
	                            this.queue.push(new InputDOM_1.InputDOM(child));
	                        }
	                        else {
	                            // 常规dom不需要传第三个参数
	                            this.queue.push(new NormalDOM_1.NormalDOM(child, this.kmv));
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var ForItemDOM_1 = __webpack_require__(8);
	var constant_1 = __webpack_require__(3);
	var object_1 = __webpack_require__(4);
	var DomOp = __webpack_require__(9);
	var array_1 = __webpack_require__(5);
	var VDOM_1 = __webpack_require__(13);
	var ForDOM = (function (_super) {
	    __extends(ForDOM, _super);
	    // 第三个参数组件用的
	    function ForDOM(node, kmv, parentComponent) {
	        if (parentComponent === void 0) { parentComponent = {}; }
	        var _this = _super.call(this, node, kmv) || this;
	        _this.childrenVdom = [];
	        _this.nextSibling = node.nextSibling;
	        _this.parentNode = node.parentNode;
	        _this.tagName = node.tagName;
	        _this.templateNode = node;
	        _this.isList = true;
	        var forString = node.getAttribute("k-for");
	        var match = constant_1.RegexpStr.forStatement.exec(forString);
	        _this.forObjectKey = match[2].trim(); // 循环的键 item in arr 的 arr
	        _this.forKey = match[1].trim(); // 循环的key值 item in arr 的 item
	        _this.node = node;
	        // 组件用组件的数据，否则用原始数据
	        var srcData = object_1.isNull(parentComponent) ? kmv.data : parentComponent['$data'];
	        var iteratorData = object_1.getDotVal(srcData, _this.forObjectKey);
	        if (Array.isArray(iteratorData)) {
	            _this.$data = array_1.depCopyArray(iteratorData);
	        }
	        else {
	            _this.$data = object_1.depCopy(iteratorData);
	        }
	        _this.isComponent = true;
	        return _this;
	    }
	    ForDOM.prototype.renderInit = function (data, kmv) {
	        var docFrag = this.transDOM(data, kmv);
	        this.$dom = docFrag.firstChild;
	        this.insertNewDOM(docFrag);
	        DomOp.removeNode(this.node);
	    };
	    ForDOM.prototype.transDOM = function (data, kmv) {
	        var iteratorData = object_1.getDotVal(data, this.forObjectKey);
	        var docFrag = document.createDocumentFragment();
	        // 组件的话拼接
	        if (Array.isArray(this.$data)) {
	            // 数组循环
	            // this.$data = iteratorData.slice(0);
	            for (var i = 0; i < this.$data.length; i++) {
	                var iteratorObj = Object.create(data); // 构造遍历的对象
	                iteratorObj[this.forKey] = this.$data[i];
	                // 第三个参数传递给组件的对象
	                var forItem = new ForItemDOM_1.ForItemDOM(this.templateNode.cloneNode(true), kmv, iteratorObj);
	                this.childrenVdom.push(forItem);
	                var forItemDom = forItem.transDOM(iteratorObj, kmv);
	                docFrag.appendChild(forItemDom);
	            }
	        }
	        else if (typeof iteratorData === 'object') {
	            // 对象循环
	            this.$data = iteratorData;
	            for (var i in iteratorData) {
	                var forItem = new ForItemDOM_1.ForItemDOM(this.templateNode, kmv, data);
	                this.childrenVdom.push(forItem);
	                var iteratorObj = Object.create(data); // 构造遍历的对象
	                iteratorObj[this.forKey] = this.$data[i];
	                var forItemDom = forItem.transDOM(iteratorObj, kmv);
	                docFrag.appendChild(forItemDom);
	            }
	        }
	        return docFrag;
	    };
	    ForDOM.prototype.insertNewDOM = function (docFrag) {
	        if (this.nextSibling) {
	            DomOp.insertBefore(this.nextSibling, docFrag);
	        }
	        else if (this.parentNode) {
	            DomOp.appendChild(this.parentNode, docFrag);
	        }
	    };
	    ForDOM.prototype.reRender = function (data, kmv, component) {
	        if (component === void 0) { component = null; }
	        var arrKey = this.forObjectKey;
	        var newDatas = object_1.getDotVal(data, arrKey); // 获取新的数据集合
	        if (Array.isArray(this.$data)) {
	            var change = array_1.diff(this.$data, newDatas);
	            if (change.length) {
	                this.notifyDataChange(change, kmv, newDatas, component);
	                this.$data = array_1.depCopyArray(newDatas);
	            }
	            else {
	                for (var i = 0, len = this.$data.length; i < len; i++) {
	                    var iteratorObj = Object.create(data); // data
	                    iteratorObj[this.forKey] = this.$data[i];
	                    this.childrenVdom[i] && this.childrenVdom[i].reRender(iteratorObj, kmv, component);
	                }
	            }
	        }
	        else if (typeof newDatas === 'object') {
	            // 渲染对象
	            var idx = 0;
	            for (var key in this.$data) {
	                var iteratorObj = Object.create(data);
	                iteratorObj[this.forKey] = this.$data[key];
	                this.childrenVdom[idx].reRender(iteratorObj, kmv);
	                idx++;
	            }
	        }
	    };
	    ForDOM.prototype.notifyDataChange = function (change, kmv, newDatas, component) {
	        if (Array.isArray(this.$data)) {
	            for (var i = 0; i < change.length; i++) {
	                var op = change[i].op;
	                if (change[i].batch) {
	                    switch (op) {
	                        case constant_1.ArrayOp.PUSH:
	                            this.batchAdd(change[i].array, kmv, component);
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
	                            this.changeItem(change[i].index, kmv, newDatas, component);
	                            break;
	                        case constant_1.ArrayOp.SHIFT:
	                            this.shiftItem();
	                            break;
	                    }
	                }
	            }
	        }
	    };
	    ForDOM.prototype.batchAdd = function (arr, kmv, component) {
	        if (arr === void 0) { arr = []; }
	        if (component === void 0) { component = null; }
	        var docFrag = document.createDocumentFragment();
	        for (var i = 0, len = arr.length; i < len; i++) {
	            var iteratorObj = void 0; // 构造遍历的对象
	            if (component) {
	                iteratorObj = Object.create(component.$data);
	            }
	            else {
	                iteratorObj = Object.create(kmv.data);
	            }
	            iteratorObj[this.forKey] = arr[i];
	            var newItem = new ForItemDOM_1.ForItemDOM(this.templateNode, kmv, iteratorObj);
	            this.childrenVdom.push(newItem);
	            var newDom = newItem.transDOM(iteratorObj, kmv);
	            docFrag.appendChild(newDom);
	        }
	        this.insertNewDOM(docFrag);
	    };
	    ForDOM.prototype.addNewItem = function (val, kmv) {
	        var newItem = new ForItemDOM_1.ForItemDOM(this.templateNode, kmv);
	        var iteratorObj = Object.create(kmv.data); // 构造遍历的对象
	        iteratorObj[this.forKey] = val;
	        var newDom = newItem.transDOM(iteratorObj, kmv);
	        this.childrenVdom.push(newItem);
	        this.insertNewDOM(newDom);
	    };
	    ForDOM.prototype.popItem = function () {
	        var popVdom = this.childrenVdom.pop();
	        popVdom.$dom && DomOp.removeNode(popVdom.$dom);
	    };
	    ForDOM.prototype.changeItem = function (i, kmv, newArray, component) {
	        var iteratorObj;
	        if (!object_1.isNull(component)) {
	            iteratorObj = Object.create(component.$data);
	        }
	        else {
	            iteratorObj = Object.create(kmv.data);
	        }
	        iteratorObj[this.forKey] = newArray[i];
	        this.childrenVdom[i].reRender(iteratorObj, kmv);
	    };
	    ForDOM.prototype.shiftItem = function () {
	        var shiftVdom = this.childrenVdom.shift();
	        this.childrenVdom.shift();
	        DomOp.removeNode(shiftVdom.$dom);
	    };
	    return ForDOM;
	}(VDOM_1.VDOM));
	exports.ForDOM = ForDOM;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var DomOp = __webpack_require__(9);
	var ForNormalDOM_1 = __webpack_require__(10);
	var VDOM_1 = __webpack_require__(13);
	var ForDOM_1 = __webpack_require__(7);
	var InputDOM_1 = __webpack_require__(16);
	var constant_1 = __webpack_require__(3);
	var validator_1 = __webpack_require__(14);
	var ComponentDOM_1 = __webpack_require__(17);
	var object_1 = __webpack_require__(4);
	var ForItemDOM = (function (_super) {
	    __extends(ForItemDOM, _super);
	    function ForItemDOM(node, kmv, parentData) {
	        if (parentData === void 0) { parentData = {}; }
	        var _this = _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        _this.componentInstance = null;
	        if (node.nodeType == constant_1.NodeType.ELEMENT) {
	            if (validator_1.isUnknowElement(node.tagName)) {
	                // 组件转换
	                _this.componentInstance = new ComponentDOM_1.ComponentDOM(node, kmv, parentData);
	                node = new ComponentDOM_1.ComponentDOM(node, kmv, parentData).getRealDOM();
	                node.$data = parentData;
	                _this.isComponent = true;
	            }
	        }
	        _this.tagName = node.tagName;
	        _this.attributes = node.attributes;
	        _this.nodeType = node.nodeType;
	        _this.templateNode = node;
	        for (var i = 0; i < node.childNodes.length; i++) {
	            var child = node.childNodes[i];
	            if (child.nodeType === constant_1.NodeType.ELEMENT) {
	                if (validator_1.isUnknowElement(child.tagName)) {
	                    _this.childrenVdom.push(new ComponentDOM_1.ComponentDOM(child, kmv, parentData));
	                }
	                else {
	                    if (child.getAttribute("k-for")) {
	                        _this.childrenVdom.push(new ForDOM_1.ForDOM(child, kmv, parentData));
	                    }
	                    else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
	                        _this.childrenVdom.push(new InputDOM_1.InputDOM(child));
	                    }
	                    else {
	                        _this.childrenVdom.push(new ForNormalDOM_1.ForNormalDOM(child, kmv, parentData));
	                    }
	                }
	            }
	            else if (child.nodeType === constant_1.NodeType.TEXT) {
	                _this.childrenVdom.push(new ForNormalDOM_1.ForNormalDOM(child, kmv, kmv.$data));
	            }
	        }
	        node.removeAttribute("k-for");
	        return _this;
	    }
	    ForItemDOM.prototype.transDOM = function (iteratorObj, kmv) {
	        var newElem = DomOp.createElement(this.tagName);
	        for (var i = 0, len = this.childrenVdom.length; i < len; i++) {
	            var childVdom = this.childrenVdom[i];
	            var newDom = childVdom.transDOM(iteratorObj, kmv, this.componentInstance);
	            newDom && newElem.appendChild(newDom);
	        }
	        this.$dom = newElem;
	        if (this.kshow) {
	            var isShow = object_1.getDotVal(iteratorObj, this.kshow);
	            this.$dom.style.display = !!isShow ? "block" : "none";
	        }
	        if (this.kif) {
	            var isIf = object_1.getDotVal(iteratorObj, this.kif);
	            if (!isIf) {
	                // 不显示
	                return this.$emptyComment;
	            }
	        }
	        return this.$dom;
	    };
	    // 重新渲染
	    ForItemDOM.prototype.reRender = function (iteratorObj, kmv, component) {
	        if (component === void 0) { component = null; }
	        if (this.isComponent) {
	            // 需要子组件去渲染子元素
	            component = this.componentInstance;
	        }
	        this.childrenVdom.forEach(function (child) {
	            child.reRender(iteratorObj, kmv, component);
	        });
	    };
	    ForItemDOM.prototype.insertNewDOM = function (newDom) {
	        if (this.nextSibling) {
	            DomOp.insertBefore(this.nextSibling, newDom);
	        }
	        else if (this.parentNode) {
	            DomOp.appendChild(this.parentNode, newDom);
	        }
	    };
	    return ForItemDOM;
	}(VDOM_1.VDOM));
	exports.ForItemDOM = ForItemDOM;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.insertAfter = function (node, newNode) {
	    node && node.parentNode && node.parentNode.insertBefore(newNode, node.nextSibling);
	};
	exports.appendChild = function (parent, child) {
	    parent && child && (parent.appendChild(child));
	};
	exports.createTextNode = function (text) {
	    return document.createTextNode(text);
	};
	exports.createComment = function (text) {
	    return document.createComment(text);
	};
	exports.replaceNode = function (oldNode, newNode) {
	    oldNode.parentNode && oldNode.parentNode.replaceChild(newNode, oldNode);
	};
	exports.createElement = function (tagName) {
	    return document.createElement(tagName);
	};
	exports.insertBefore = function (node, newNode) {
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
	exports.getTextContent = function (textNode) {
	    return textNode && textNode.textContent;
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
	    node && node.parentNode && node.parentNode.removeChild(node);
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var template_1 = __webpack_require__(11);
	var DomOp = __webpack_require__(9);
	var VDOM_1 = __webpack_require__(13);
	var ForDOM_1 = __webpack_require__(7);
	var InputDOM_1 = __webpack_require__(16);
	var constant_1 = __webpack_require__(3);
	var ForNormalDOM = (function (_super) {
	    __extends(ForNormalDOM, _super);
	    function ForNormalDOM(node, kmv, parentData) {
	        if (parentData === void 0) { parentData = {}; }
	        var _this = 
	        // h3
	        _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        _this.tagName = node.tagName;
	        _this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0));
	        _this.nodeType = node.nodeType;
	        switch (node.nodeType) {
	            case constant_1.NodeType.TEXT:
	                _this.template = node.textContent;
	                break;
	            case constant_1.NodeType.ELEMENT:
	                _this.kshow = node.getAttribute("k-show");
	                if (node.childNodes) {
	                    for (var i = 0; i < node.childNodes.length; i++) {
	                        var child = node.childNodes[i];
	                        if (child.nodeType === constant_1.NodeType.ELEMENT) {
	                            if (child.getAttribute("k-for")) {
	                                _this.childrenVdom.push(new ForDOM_1.ForDOM(child, kmv, parentData));
	                            }
	                            else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
	                                _this.childrenVdom.push(new InputDOM_1.InputDOM(child));
	                            }
	                            else {
	                                _this.childrenVdom.push(new ForNormalDOM(child, kmv, parentData));
	                            }
	                        }
	                        else {
	                            _this.childrenVdom.push(new ForNormalDOM(child, kmv, parentData));
	                        }
	                    }
	                }
	                break;
	        }
	        return _this;
	    }
	    // iteratorObj 为遍历的数据，需要构造, 第三个组件实例
	    ForNormalDOM.prototype.transDOM = function (data, kmv, component) {
	        if (component === void 0) { component = null; }
	        var newEle = document.createElement(this.tagName);
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                newEle = DomOp.createTextNode(this.tagName);
	                var text = void 0;
	                if (component) {
	                    text = template_1.compileTpl(this.template, component.$data);
	                }
	                else {
	                    text = template_1.compileTpl(this.template, data);
	                }
	                newEle.textContent = text;
	                this.$dom = newEle;
	                break;
	            case constant_1.NodeType.ELEMENT:
	                newEle = document.createElement(this.tagName);
	                this.$dom = newEle;
	                this.childrenVdom
	                    &&
	                        this.childrenVdom.forEach(function (child) {
	                            if (child instanceof ForDOM_1.ForDOM) {
	                                // 嵌套for
	                                child.parentNode = newEle; // 嵌套父节点必须重新更新
	                                child.nextSibling = newEle.previousSibling;
	                                child.renderInit(data, kmv);
	                            }
	                            else {
	                                newEle.appendChild(child.transDOM(data, kmv, component));
	                            }
	                        });
	                this.renderAttr(data, kmv, component);
	                break;
	        }
	        return newEle;
	    };
	    /**
	     * @param data      渲染的数据
	     * @param kmv       kmv
	     */
	    ForNormalDOM.prototype.reRender = function (data, kmv, component) {
	        var _this = this;
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                // 组件存在就用组件的数据去渲染
	                // component && (data = component.$data);
	                var text = template_1.compileTpl(this.template, data);
	                DomOp.changeTextContent(this.$dom, text);
	                break;
	            case constant_1.NodeType.ELEMENT:
	                this.childrenVdom.forEach(function (child) {
	                    if (child instanceof ForDOM_1.ForDOM) {
	                        // 嵌套for
	                        child.reRender(data, kmv, component);
	                    }
	                    else {
	                        child.reRender(data, kmv, component);
	                        _this.reRenderAttr(data, kmv, component);
	                    }
	                });
	                break;
	        }
	    };
	    return ForNormalDOM;
	}(VDOM_1.VDOM));
	exports.ForNormalDOM = ForNormalDOM;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var constant_1 = __webpack_require__(3);
	var object_1 = __webpack_require__(4);
	var function_1 = __webpack_require__(12);
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
/* 12 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.evalJs = function (content, obj) {
	    // console.dir(obj);
	    // return (function() { return eval(content) }).call(obj);
	    var res;
	    try {
	        return new Function("with(this){ return " + content + " }").call(obj);
	    }
	    catch (err) {
	        return '';
	    }
	};
	exports.evalFunc = function (code) {
	    return new Function("with(this){ console.log(this); return " + code + " }");
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var template_1 = __webpack_require__(11);
	var domOp_1 = __webpack_require__(9);
	var constant_1 = __webpack_require__(3);
	var validator_1 = __webpack_require__(14);
	var event_1 = __webpack_require__(15);
	var object_1 = __webpack_require__(4);
	var DomOp = __webpack_require__(9);
	var object_2 = __webpack_require__(4);
	var VDOM = (function () {
	    function VDOM(node, kmv) {
	        if (kmv === void 0) { kmv = {}; }
	        this.childrenVdom = [];
	        this.isComponent = false;
	        this.$emptyComment = domOp_1.createComment(''); // 空白注释, 替换kif dom
	        node.attributes && (this.attributes = [].slice.call(node.attributes).slice(0));
	        if (node.nodeType === constant_1.NodeType.ELEMENT) {
	            this.kshow = node.getAttribute("k-show");
	            this.kif = node.getAttribute("k-if");
	        }
	        this.nextSibling = node.nextSibling;
	        this.parentNode = node.parentNode;
	    }
	    // 传递组件对象, 组件私有方法
	    VDOM.prototype.renderAttr = function (data, kmv, component) {
	        if (component === void 0) { component = {}; }
	        if (this.nodeType === constant_1.NodeType.ELEMENT) {
	            var node = this.$dom;
	            var attrs = this.attributes;
	            for (var i = 0; i < attrs.length; i++) {
	                var attr = attrs[i];
	                var attrName = attr.nodeName, attrVal = attr.nodeValue;
	                if (constant_1.RegexpStr.kAttribute.test(attrName)) {
	                    var key = attr.nodeName.replace(constant_1.RegexpStr.kAttribute, '$1');
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
	                    }
	                    else {
	                        var val = template_1.compileTpl(attrVal, data);
	                        node.setAttribute(key, val);
	                    }
	                }
	                else if (constant_1.RegexpStr.kOnAttribute.test(attrName)) {
	                    var event_2 = attrName.replace(constant_1.RegexpStr.kOnAttribute, '$1');
	                    var func = template_1.compileTpl(attrVal, data);
	                    var match = func.match(constant_1.RegexpStr.methodAndParam);
	                    var method = match[1];
	                    var params = match[2];
	                    var paramsArr = params.split(",");
	                    for (var n = 0; n < paramsArr.length; n++) {
	                        if (paramsArr[n] === 'this') {
	                            paramsArr[n] = this.$dom;
	                        }
	                        else {
	                            paramsArr[n] = String(paramsArr[n]).trim();
	                        }
	                    }
	                    if (!object_2.isNull(component)) {
	                        if (this.kshow) {
	                            var isShow = object_1.getDotVal(component.$data, this.kshow);
	                            this.$dom.style.display = !!isShow ? "block" : "none";
	                        }
	                        if (this.kif) {
	                            var isIf = object_1.getDotVal(component.$data, this.kif);
	                            if (!isIf)
	                                DomOp.replaceNode(this.$dom, this.$emptyComment);
	                        }
	                        event_1.bindEvent(node, event_2, method, paramsArr, component.methods, component.$data);
	                    }
	                    else {
	                        if (this.kshow) {
	                            var isShow = object_1.getDotVal(data, this.kshow);
	                            this.$dom.style.display = !!isShow ? "block" : "none";
	                        }
	                        if (this.kif) {
	                            var isIf = object_1.getDotVal(data, this.kif);
	                            if (!isIf)
	                                DomOp.replaceNode(this.$dom, this.$emptyComment);
	                        }
	                        event_1.bindEvent(node, event_2, method, paramsArr, kmv.methods, kmv.data);
	                    }
	                }
	                else {
	                    if (!object_2.isNull(component)) {
	                        if (this.kshow) {
	                            var isShow = object_1.getDotVal(component.$data, this.kshow);
	                            this.$dom.style.display = !!isShow ? "block" : "none";
	                        }
	                        if (this.kif) {
	                            var isIf = object_1.getDotVal(component.$data, this.kif);
	                            if (!isIf)
	                                DomOp.replaceNode(this.$dom, this.$emptyComment);
	                        }
	                    }
	                    else {
	                        if (this.kshow) {
	                            var isShow = object_1.getDotVal(data, this.kshow);
	                            this.$dom.style.display = !!isShow ? "block" : "none";
	                        }
	                        if (this.kif) {
	                            var isIf = object_1.getDotVal(data, this.kif);
	                            if (!isIf)
	                                DomOp.replaceNode(this.$dom, this.$emptyComment);
	                        }
	                    }
	                    node.setAttribute(attrName, attrVal);
	                }
	            }
	        }
	    };
	    VDOM.prototype.reRenderAttr = function (data, kmv, component) {
	        if (component === void 0) { component = {}; }
	        var node = this.$dom;
	        for (var i = 0; i < this.attributes.length; i++) {
	            var attr = this.attributes[i];
	            var attrName = attr.nodeName, attrVal = attr.nodeValue;
	            if (validator_1.isKvmAttribute(attrName)) {
	                if (constant_1.RegexpStr.kAttribute.test(attrName)) {
	                    var key = attr.nodeName.replace(constant_1.RegexpStr.kAttribute, '$1');
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
	                        var newVal = template_1.compileTpl(attrVal, data);
	                        var oldVal = node.getAttribute(key);
	                        newVal !== oldVal && node.setAttribute(key, newVal);
	                        node.removeAttribute(attrName);
	                    }
	                }
	                else {
	                    var newVal = template_1.compileTpl(attrVal, data);
	                    var oldVal = node.getAttribute(attrName);
	                    newVal !== oldVal && node.setAttribute(attrName, newVal);
	                }
	            }
	            else if (constant_1.RegexpStr.kOnAttribute.test(attrName)) {
	                node.removeAttribute(attrName);
	            }
	            else {
	                node.setAttribute(attrName, attrVal);
	            }
	        }
	        if (!object_2.isNull(component)) {
	            if (this.kshow) {
	                var isShow = object_1.getDotVal(component.$data, this.kshow);
	                this.$dom.style.display = !!isShow ? "block" : "none";
	            }
	            if (this.kif) {
	                var isIf = object_1.getDotVal(component.$data, this.kif);
	                if (!isIf)
	                    DomOp.replaceNode(this.$dom, this.$emptyComment);
	            }
	        }
	        else {
	            if (this.kshow) {
	                var isShow = object_1.getDotVal(data, this.kshow);
	                this.$dom.style.display = !!isShow ? "block" : "none";
	            }
	            if (this.kif) {
	                var isIf = object_1.getDotVal(data, this.kif);
	                if (!isIf)
	                    DomOp.replaceNode(this.$dom, this.$emptyComment);
	            }
	        }
	    };
	    return VDOM;
	}());
	exports.VDOM = VDOM;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var constant_1 = __webpack_require__(3);
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
/* 15 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bindEvent = function (node, event, method, params, methodsObj, observeData) {
	    if (node.addEventListener) {
	        node.addEventListener(event, function () {
	            if (methodsObj && methodsObj[method]) {
	                methodsObj[method].apply(observeData, params);
	            }
	            else {
	                console.error("未声明" + method + "方法");
	            }
	        });
	    }
	    else {
	        node.attachEvent("on" + event, function () {
	            if (methodsObj && methodsObj[method]) {
	                methodsObj[method].apply(observeData, params);
	            }
	            else {
	                console.error("未声明" + method + "方法");
	            }
	        });
	    }
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var object_1 = __webpack_require__(4);
	var VDOM_1 = __webpack_require__(13);
	var InputDOM = (function (_super) {
	    __extends(InputDOM, _super);
	    function InputDOM(node) {
	        var _this = _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        _this.tagName = node.tagName;
	        _this.attributes = node.attributes;
	        _this.nodeType = node.nodeType;
	        _this.kmodel = node.getAttribute("k-model");
	        _this.$dom = node;
	        node.removeAttribute("k-model");
	        return _this;
	    }
	    InputDOM.prototype.renderInit = function (data, kmv) {
	        var _this = this;
	        this.$dom.value = object_1.getDotVal(data, this.kmodel);
	        this.$dom.oninput = function (ev) {
	            object_1.setObserveDotVal(data, _this.kmodel, _this.$dom.value);
	        };
	        this.renderAttr(data, kmv, null);
	    };
	    InputDOM.prototype.reRender = function (data, kmv) {
	        var text = object_1.getDotVal(data, this.kmodel);
	        this.$dom.value = text;
	        this.reRenderAttr(data, kmv, null);
	    };
	    return InputDOM;
	}(VDOM_1.VDOM));
	exports.InputDOM = InputDOM;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var NormalDOM_1 = __webpack_require__(18);
	var VDOM_1 = __webpack_require__(13);
	var DomOp = __webpack_require__(9);
	var constant_1 = __webpack_require__(3);
	var object_1 = __webpack_require__(4);
	var ForDOM_1 = __webpack_require__(7);
	var observer_1 = __webpack_require__(2);
	var validator_1 = __webpack_require__(14);
	var InputDOM_1 = __webpack_require__(16);
	var ComponentDOM = (function (_super) {
	    __extends(ComponentDOM, _super);
	    function ComponentDOM(node, kmv, parent) {
	        if (parent === void 0) { parent = null; }
	        var _this = _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        _this.$data = {};
	        _this.isComponent = true;
	        _this.isComponent = true;
	        _this.tagName = node.tagName;
	        var component = kmv.components[_this.tagName.toLowerCase()]; // 组件配置
	        if (component) {
	            _this.methods = component.methods;
	            var div = document.createElement("div");
	            div.innerHTML = component.template.trim(); // 转为dom
	            _this.template = component.template.trim();
	            _this.attributes = node.attributes;
	            for (var i = 0; i < node.attributes.length; i++) {
	                div.firstChild.setAttribute(node.attributes[i].nodeName, node.attributes[i].nodeValue);
	            }
	            _this.node = node;
	            _this.$dom = div.firstChild; // 关联dom
	            _this.model = node.getAttribute(":model"); // 数据键
	            // console.log(parentData, this.model);
	            var parentData = void 0;
	            if (parent instanceof ComponentDOM) {
	                parentData = parent['$data'];
	            }
	            else {
	                parentData = kmv.data;
	            }
	            _this.$data = {
	                model: object_1.getDotVal(parentData, _this.model)
	            }; // 渲染的数据
	            if (component.data) {
	                _this.$data = object_1.extend(_this.$data, component.data());
	            }
	            observer_1.observer(_this.$data, kmv);
	            if (_this.$data['model']) {
	                for (var i = 0; i < _this.$dom.childNodes.length; i++) {
	                    var child = _this.$dom.childNodes[i];
	                    if (child.nodeType == constant_1.NodeType.ELEMENT) {
	                        if (child.getAttribute("k-for")) {
	                            _this.childrenVdom.push(new ForDOM_1.ForDOM(child, kmv, _this));
	                        }
	                        else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
	                            _this.childrenVdom.push(new InputDOM_1.InputDOM(child));
	                        }
	                        else if (validator_1.isUnknowElement(child.tagName)) {
	                            _this.childrenVdom.push(new ComponentDOM(child, kmv, _this));
	                        }
	                        else {
	                            _this.childrenVdom.push(new NormalDOM_1.NormalDOM(child, kmv, _this));
	                        }
	                    }
	                    else {
	                        _this.childrenVdom.push(new NormalDOM_1.NormalDOM(child, kmv, _this));
	                    }
	                }
	            }
	            _this.node = node;
	        }
	        else {
	            console.error("无效标签" + _this.tagName);
	        }
	        return _this;
	    }
	    ComponentDOM.prototype.renderInit = function (data, kmv) {
	        var _this = this;
	        if (data === void 0) { data = null; }
	        this.insertNewDOM();
	        DomOp.removeNode(this.node);
	        // 先插入后渲染
	        this.childrenVdom.forEach(function (child) {
	            child.renderInit(_this.$data, kmv, _this);
	        });
	    };
	    ComponentDOM.prototype.transDOM = function (data, kmv) {
	        return this.$dom;
	    };
	    ComponentDOM.prototype.reRender = function (data, kmv) {
	        var _this = this;
	        this.childrenVdom.forEach(function (child) {
	            child.reRender(_this.$data, kmv, _this);
	        });
	    };
	    ComponentDOM.prototype.getRealDOM = function () {
	        var div = document.createElement("div");
	        div.innerHTML = this.template; // 转为dom
	        return div.firstChild;
	    };
	    ComponentDOM.prototype.replaceDOM = function () {
	    };
	    ComponentDOM.prototype.insertNewDOM = function () {
	        DomOp.insertBefore(this.node, this.$dom);
	        DomOp.removeNode(this.node);
	    };
	    return ComponentDOM;
	}(VDOM_1.VDOM));
	exports.ComponentDOM = ComponentDOM;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var template_1 = __webpack_require__(11);
	var DomOp = __webpack_require__(9);
	var constant_1 = __webpack_require__(3);
	var VDOM_1 = __webpack_require__(13);
	var ForDOM_1 = __webpack_require__(7);
	var InputDOM_1 = __webpack_require__(16);
	var validator_1 = __webpack_require__(14);
	var ComponentDOM_1 = __webpack_require__(17);
	var NormalDOM = (function (_super) {
	    __extends(NormalDOM, _super);
	    // 第三个参数传递给子组件的数据
	    function NormalDOM(node, kmv, parentData) {
	        if (parentData === void 0) { parentData = {}; }
	        var _this = _super.call(this, node) || this;
	        _this.childrenVdom = [];
	        switch (node.nodeType) {
	            case constant_1.NodeType.TEXT:
	                _this.template = node.textContent;
	                node.textContent = '';
	                break;
	            case constant_1.NodeType.ELEMENT:
	                break;
	        }
	        _this.tagName = node.tagName,
	            _this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0)),
	            _this.nodeType = node.nodeType;
	        _this.$dom = node;
	        if (node.childNodes) {
	            for (var i = 0; i < node.childNodes.length; i++) {
	                var child = node.childNodes[i];
	                if (child.nodeType === constant_1.NodeType.ELEMENT) {
	                    if (child.getAttribute("k-for")) {
	                        _this.childrenVdom.push(new ForDOM_1.ForDOM(child, kmv, parentData));
	                    }
	                    else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
	                        _this.childrenVdom.push(new InputDOM_1.InputDOM(child));
	                    }
	                    else if (validator_1.isUnknowElement(child.tagName)) {
	                        _this.childrenVdom.push(new ComponentDOM_1.ComponentDOM(child, kmv, parentData));
	                    }
	                    else {
	                        _this.childrenVdom.push(new NormalDOM(child, kmv, parentData));
	                    }
	                }
	                else {
	                    _this.childrenVdom.push(new NormalDOM(child, kmv, parentData));
	                }
	            }
	        }
	        return _this;
	    }
	    NormalDOM.prototype.renderInit = function (data, kmv, component) {
	        if (component === void 0) { component = null; }
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                var text = void 0;
	                if (component) {
	                    text = template_1.compileTpl(this.template, component.$data);
	                }
	                else {
	                    text = template_1.compileTpl(this.template, data);
	                }
	                DomOp.changeTextContent(this.$dom, text);
	                break;
	            case constant_1.NodeType.ELEMENT:
	                this.childrenVdom.forEach(function (child) {
	                    child.renderInit(data, kmv, component);
	                });
	                this.renderAttr(data, kmv, component);
	                break;
	        }
	    };
	    NormalDOM.prototype.reRender = function (data, kmv, component) {
	        switch (this.nodeType) {
	            case constant_1.NodeType.TEXT:
	                var text = void 0;
	                if (component) {
	                    text = template_1.compileTpl(this.template, component.$data);
	                }
	                else {
	                    text = template_1.compileTpl(this.template, data);
	                }
	                text && DomOp.changeTextContent(this.$dom, text);
	                break;
	            case constant_1.NodeType.ELEMENT:
	                this.childrenVdom.forEach(function (child) {
	                    child.reRender(data, kmv, component);
	                });
	                this.reRenderAttr(data, kmv, component);
	                break;
	        }
	    };
	    NormalDOM.prototype.insertNewDOM = function (newDom) {
	        if (this.nextSibling) {
	            DomOp.insertBefore(this.nextSibling, newDom);
	        }
	        else if (this.parentNode) {
	            DomOp.appendChild(this.parentNode, newDom);
	        }
	    };
	    NormalDOM.prototype.transDOM = function (data, kmv) {
	        var _this = this;
	        this.renderInit(data, kmv);
	        this.childrenVdom.forEach(function (child) {
	            _this.$dom.appendChild(child.transDOM(data, kmv));
	        });
	        return this.$dom;
	    };
	    return NormalDOM;
	}(VDOM_1.VDOM));
	exports.NormalDOM = NormalDOM;


/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
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