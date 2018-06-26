!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},r.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Attr={K_MODEL:"k-model"},t.RegexpStr={brace:/\{\{((?:.|\n)+?)\}\}/,forStatement:/([a-z_]+[\w]*)\s+in\s+([a-z_][\w.]+(\[.*\])*)/,bracket:/\[['|"]?(\w+)['|"]?\]/,isString:/'([^']*)'|"([^\"]*)"/,isParams:/^[^"|^'\d]+.*/,arithmeticOp:/\*|\+|-\/|\(|\)/g,inputElement:/INPUT|TEXTAREA/,arrtibuteKey:/k-for|k-model|k-if|k:.*|k-on:(.*)|k-show/,kAttribute:/k:(.*)/,kOnAttribute:/k-on:(.*)/,methodAndParam:/([a-zA-Z\d_]+)\((.*)\)/,isTernaryOp:/!.*|!!.*|.+?.+:.+/,ternaryOpSplit:/\?|:|\(|\)|!!/,isNormalHtmlTag:/html|body|base|head|link|meta|style|title|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|hgroup|nav|section|div|dd|dl|dt|figcaption|figure|hr|img|li|main|ol|p|pre|ul|a|b|abbr|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|rtc|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|map|track|video|embed|object|param|source|canvas|script|noscript|del|ins|caption|col|colgroup|table|thead|tbody|td|th|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|menuitem|summary|content|element|shadow|template/i,isProps:/:(.*)/},t.NodeType={ELEMENT:1,ATTRIBUTE:2,TEXT:3,COMMENT:8,DOCUMENT:9},t.ArrayMethod=["push","pop","splice","shift","unshift","sort","reverse"],function(e){e[e.TEXT=0]="TEXT",e[e.INPUT=1]="INPUT",e[e.TEXTAREA=2]="TEXTAREA",e[e.FOR=3]="FOR",e[e.IF=4]="IF",e[e.ATTRIBUTE=5]="ATTRIBUTE"}(t.RenderType||(t.RenderType={})),function(e){e[e.PUSH=0]="PUSH",e[e.POP=1]="POP",e[e.SORT=2]="SORT",e[e.CHANGE=3]="CHANGE",e[e.SHIFT=4]="SHIFT"}(t.ArrayOp||(t.ArrayOp={}))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0);t.diff=function(e,t){void 0===e&&(e=[]),void 0===t&&(t=[]);for(var r=[],o=(e.slice(0),t.slice(0),e.length),i=t.length,a=Math.min(o,i),s=0;s<a;s++)e[s]!==t[s]&&r.push({op:n.ArrayOp.CHANGE,index:s,text:t[s]});if(o>i){var d=e.slice(i);for(s=0;s<d.length;s++)r.push({op:n.ArrayOp.POP,index:s+i,text:d[s]})}else if(i>o){var c=t.slice(o);r.push({batch:!0,op:n.ArrayOp.PUSH,array:c})}return r},t.depCopyArray=function(e){return"object"==typeof e?JSON.parse(JSON.stringify(e)):[]}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=r(1);t.getDotVal=function(e,t){var r,o;if(t){r=e;for(var i=(t=t.replace(n.RegexpStr.bracket,".$1")).split(".")||[t];o=i.shift();){if(!r){r=void 0;break}r=r[o]}}return r};var i=function(e){var t={};for(var r in e)"object"==typeof e[r]?Array.isArray(e[r])?t[r]=o.depCopyArray(e[r]):t[r]=i(e[r]):t[r]=e[r];return t};t.depCopy=i;t.setObserveDotVal=function(e,t,r){for(var o=e,i=(t=t.replace(n.RegexpStr.bracket,".$1")).split("."),a=i.length,s=0;s<a-1;s++)o=o[i[s]];o[i[a-1]]=r};t.extend=function(e,t){for(var r in void 0===e&&(e={}),t)e[r]=t[r];return e};t.isNull=function(e){var t;for(var r in e)e.hasOwnProperty(r)&&!e[r]&&(t=!0);return!t||null==e||0===Object.keys(e).length}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(19),o=r(12),i=r(18),a=r(13),s=r(2);function d(e){var t=e.el,r=document.querySelector(t);if(r){this.data=e.data,this.watch=e.watch||{},this.pendingValue=!1,this.changeQueue=[],this.methods=e.methods,this.components=s.extend(this.components,e.components),this.mounted="function"==typeof e.mounted?e.mounted:null;var d=this;if(e.beforeInit){var c=new a.Event;c.$once("initData",function(t){var a=s.extend(e.data,t);o.observer(a,d),d.renderQueue=new i.RenderQueue(r,this),n.renderInit(d)}),e.beforeInit.call(d,c)}else o.observer(e.data,this),this.renderQueue=new i.RenderQueue(r,this),n.renderInit(this);return this.mounted&&this.mounted.call(this),this}console.error("元素"+t+"不存在!")}d.components=function(e,t){d.prototype.components||(d.prototype.components={}),d.prototype.components[e]=t},window.Kmv=d},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.insertAfter=function(e,t){e&&e.parentNode&&e.parentNode.insertBefore(t,e.nextSibling)},t.appendChild=function(e,t){e&&t&&e.appendChild(t)},t.createTextNode=function(e){return document.createTextNode(e)},t.createComment=function(e){return document.createComment(e)},t.replaceNode=function(e,t){e.parentNode&&e.parentNode.replaceChild(t,e)},t.createElement=function(e){return document.createElement(e)},t.insertBefore=function(e,t){e&&e.parentNode&&e.parentNode.insertBefore(t,e)},t.deleteNode=function(e,t){e&&t&&e.removeChild(t)},t.changeNodeValue=function(e,t){e&&e.firstChild&&(e.firstChild.nodeValue=t)},t.changeTextContent=function(e,t){e&&(e.textContent=t)},t.getTextContent=function(e){return e&&e.textContent},t.removeAttribute=function(e,t){e&&e.removeAttribute(t)},t.findIteratorNode=function(e,r){for(var n=e.childNodes,o=[],i=0;i<n.length;i++){var a=n[i];a.forString&&a.forKey&&a.forKey==r&&o.push(a),a.childNodes.length&&o.concat(t.findIteratorNode(a,r))}return o},t.hideNode=function(e){e.style.display="none"},t.showNode=function(e){e.style.display="block"},t.removeNode=function(e){e&&e.parentNode&&e.parentNode.removeChild(e)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(10),o=r(4),i=r(0),a=r(7),s=r(14),d=r(2),c=r(4),u=r(2),p=function(){function e(e,t){void 0===t&&(t={}),this.childrenVdom=[],this.isComponent=!1,this.$emptyComment=o.createComment(""),e.attributes&&(this.attributes=[].slice.call(e.attributes).slice(0)),e.nodeType===i.NodeType.ELEMENT&&(this.kshow=e.getAttribute("k-show"),this.kif=e.getAttribute("k-if")),this.nextSibling=e.nextSibling,this.parentNode=e.parentNode}return e.prototype.renderAttr=function(e,t,r){if(void 0===r&&(r={}),this.nodeType===i.NodeType.ELEMENT)for(var o=this.$dom,a=this.attributes,p=0;p<a.length;p++){var l=a[p],h=l.nodeName,m=l.nodeValue;if(i.RegexpStr.kAttribute.test(h)){var f=l.nodeName.replace(i.RegexpStr.kAttribute,"$1");if("class"===f){for(var v=m.split(","),y="",b=0;b<v.length;b++){var g=v[b].split(":")[0];d.getDotVal(e,g.trim())&&(y+=v[b].split(":")[1].trim()+" ")}o.setAttribute(f,y.trim())}else{var O=n.compileTpl(m,e);o.setAttribute(f,O)}}else if(i.RegexpStr.kOnAttribute.test(h)){var N=h.replace(i.RegexpStr.kOnAttribute,"$1"),_=n.compileTpl(m,e).match(i.RegexpStr.methodAndParam),T=_[1],w=_[2].split(",");for(b=0;b<w.length;b++)"this"===w[b]?w[b]=this.$dom:w[b]=String(w[b]).trim();u.isNull(r)?s.bindEvent(o,N,T,w,t.methods,t.data):s.bindEvent(o,N,T,w,r.methods,r.$data),o.removeAttribute(h)}else o.setAttribute(h,m);if(this.kshow){var M=d.getDotVal(e,this.kshow);this.$dom.style.display=M?"block":"none"}if(this.kif)d.getDotVal(e,this.kif)?c.replaceNode(this.$emptyComment,this.$dom):c.replaceNode(this.$dom,this.$emptyComment)}},e.prototype.reRenderAttr=function(e,t,r){void 0===r&&(r={});for(var o=this.$dom,s=0;s<this.attributes.length;s++){var p=this.attributes[s],l=p.nodeName,h=p.nodeValue;if(a.isKvmAttribute(l))if(i.RegexpStr.kAttribute.test(l)){var m=p.nodeName.replace(i.RegexpStr.kAttribute,"$1");if("class"===m){for(var f=h.split(","),v="",y=0;y<f.length;y++){var b=f[y].split(":")[0];d.getDotVal(e,b.trim())&&(v+=f[y].split(":")[1].trim()+" ")}o.setAttribute(m,v.trim()),o.removeAttribute(l)}else{(g=n.compileTpl(h,e))!==o.getAttribute(m)&&o.setAttribute(m,g),o.removeAttribute(l)}}else{var g;(g=n.compileTpl(h,e))!==o.getAttribute(l)&&o.setAttribute(l,g)}else i.RegexpStr.kOnAttribute.test(l)?o.removeAttribute(l):o.setAttribute(l,h)}if(u.isNull(r)){if(this.kshow){O=d.getDotVal(e,this.kshow);this.$dom.style.display=O?"block":"none"}if(this.kif)d.getDotVal(e,this.kif)?c.replaceNode(this.$emptyComment,this.$dom):c.replaceNode(this.$dom,this.$emptyComment)}else{if(this.kshow){var O=d.getDotVal(r.$data,this.kshow);this.$dom.style.display=O?"block":"none"}if(this.kif)d.getDotVal(r.$data,this.kif)||c.replaceNode(this.$dom,this.$emptyComment)}},e}();t.VDOM=p},function(e,t,r){"use strict";var n,o=this&&this.__extends||(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var i=r(2),a=function(e){function t(t){var r=e.call(this,t)||this;return r.childrenVdom=[],r.tagName=t.tagName,r.attributes=t.attributes,r.nodeType=t.nodeType,r.kmodel=t.getAttribute("k-model"),r.$dom=t,t.removeAttribute("k-model"),r}return o(t,e),t.prototype.renderInit=function(e,t){var r=this;this.$dom.value=i.getDotVal(e,this.kmodel),this.$dom.oninput=function(t){i.setObserveDotVal(e,r.kmodel,r.$dom.value)},this.renderAttr(e,t,null)},t.prototype.reRender=function(e,t){var r=i.getDotVal(e,this.kmodel);this.$dom.value=r,this.reRenderAttr(e,t,null)},t}(r(5).VDOM);t.InputDOM=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0);t.isBraceReg=function(e){return n.RegexpStr.brace.test(e)},t.isForStatement=function(e){return n.RegexpStr.forStatement.test(e)},t.isKvmAttribute=function(e){return n.RegexpStr.arrtibuteKey.test(e)},t.isUnknowElement=function(e){var t=document.createElement(e);return e.indexOf("-")>-1?t.constructor===window.HTMLUnknownElement||t.constructor===window.HTMLElement:/HTMLUnknownElement/.test(t.toString())}},function(e,t,r){"use strict";var n,o=this&&this.__extends||(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var i=r(17),a=r(0),s=r(2),d=r(4),c=r(1),u=function(e){function t(t,r,n){void 0===n&&(n={});var o=e.call(this,t,r)||this;o.childrenVdom=[],o.nextSibling=t.nextSibling,o.parentNode=t.parentNode,o.tagName=t.tagName,o.templateNode=t,o.isList=!0;var i=t.getAttribute("k-for"),d=a.RegexpStr.forStatement.exec(i);o.forObjectKey=d[2].trim(),o.forKey=d[1].trim(),o.node=t;var u=s.isNull(n)?r.data:n.$data,p=s.getDotVal(u,o.forObjectKey);return Array.isArray(p)?o.$data=c.depCopyArray(p):o.$data=s.depCopy(p),o.isComponent=!0,o}return o(t,e),t.prototype.renderInit=function(e,t){var r=this.transDOM(e,t);this.$dom=r.firstChild,this.insertNewDOM(r),d.removeNode(this.node)},t.prototype.transDOM=function(e,t){var r=s.getDotVal(e,this.forObjectKey),n=document.createDocumentFragment();if(Array.isArray(this.$data))for(var o=0;o<this.$data.length;o++){(c=Object.create(e))[this.forKey]=this.$data[o];var a=new i.ForItemDOM(this.templateNode.cloneNode(!0),t,c);this.childrenVdom.push(a);var d=a.transDOM(c,t);n.appendChild(d)}else if("object"==typeof r)for(var o in this.$data=r,r){var c;a=new i.ForItemDOM(this.templateNode,t,e);this.childrenVdom.push(a),(c=Object.create(e))[this.forKey]=this.$data[o];d=a.transDOM(c,t);n.appendChild(d)}return n},t.prototype.insertNewDOM=function(e){this.nextSibling?d.insertBefore(this.nextSibling,e):this.parentNode&&d.appendChild(this.parentNode,e)},t.prototype.reRender=function(e,t,r){void 0===r&&(r=null);var n=this.forObjectKey,o=s.getDotVal(e,n);if(Array.isArray(this.$data)){var i=c.diff(this.$data,o);if(i.length)this.notifyDataChange(i,t,o,r),this.$data=c.depCopyArray(o);else for(var a=0,d=this.$data.length;a<d;a++){(l=Object.create(e))[this.forKey]=this.$data[a],this.childrenVdom[a]&&this.childrenVdom[a].reRender(l,t,r)}}else if("object"==typeof o){var u=0;for(var p in this.$data){var l;(l=Object.create(e))[this.forKey]=this.$data[p],this.childrenVdom[u].reRender(l,t),u++}}},t.prototype.notifyDataChange=function(e,t,r,n){if(Array.isArray(this.$data))for(var o=0;o<e.length;o++){var i=e[o].op;if(e[o].batch)switch(i){case a.ArrayOp.PUSH:this.batchAdd(e[o].array,t,n)}else switch(i){case a.ArrayOp.PUSH:this.addNewItem(e[o].text,t);break;case a.ArrayOp.POP:this.popItem();break;case a.ArrayOp.CHANGE:this.changeItem(e[o].index,t,r,n);break;case a.ArrayOp.SHIFT:this.shiftItem()}}},t.prototype.batchAdd=function(e,t,r){void 0===e&&(e=[]),void 0===r&&(r=null);for(var n=document.createDocumentFragment(),o=0,a=e.length;o<a;o++){var s=void 0;(s=r?Object.create(r.$data):Object.create(t.data))[this.forKey]=e[o];var d=new i.ForItemDOM(this.templateNode,t,s);this.childrenVdom.push(d);var c=d.transDOM(s,t);n.appendChild(c)}this.insertNewDOM(n)},t.prototype.addNewItem=function(e,t){var r=new i.ForItemDOM(this.templateNode,t),n=Object.create(t.data);n[this.forKey]=e;var o=r.transDOM(n,t);this.childrenVdom.push(r),this.insertNewDOM(o)},t.prototype.popItem=function(){var e=this.childrenVdom.pop();e.$dom&&d.removeNode(e.$dom)},t.prototype.changeItem=function(e,t,r,n){var o;(o=s.isNull(n)?Object.create(t.data):Object.create(n.$data))[this.forKey]=r[e],this.childrenVdom[e].reRender(o,t)},t.prototype.shiftItem=function(){var e=this.childrenVdom.shift();this.childrenVdom.shift(),d.removeNode(e.$dom)},t}(r(5).VDOM);t.ForDOM=u},function(e,t,r){"use strict";var n,o=this&&this.__extends||(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var i=r(11),a=r(5),s=r(4),d=r(0),c=r(2),u=r(8),p=r(12),l=r(7),h=r(6),m=function(e){function t(r,n,o){void 0===o&&(o=null);var a=e.call(this,r)||this;a.childrenVdom=[],a.$data={},a.isComponent=!0,a.isComponent=!0,a.tagName=r.tagName;var s=n.components[a.tagName.toLowerCase()];if(s){a.methods=s.methods;var m=document.createElement("div");m.innerHTML=s.template.trim(),a.template=s.template.trim(),a.attributes=r.attributes;for(var f=0;f<r.attributes.length;f++)m.firstChild.setAttribute(r.attributes[f].nodeName,r.attributes[f].nodeValue);a.node=r,a.$dom=m.firstChild,a.model=r.getAttribute(":model");var v=void 0;if(v=o instanceof t?o.$data:n.data,a.$data={model:c.getDotVal(v,a.model)},s.data&&(a.$data=c.extend(a.$data,s.data())),p.observer(a.$data,n),a.$data.model)for(f=0;f<a.$dom.childNodes.length;f++){var y=a.$dom.childNodes[f];y.nodeType==d.NodeType.ELEMENT?y.getAttribute("k-for")?a.childrenVdom.push(new u.ForDOM(y,n,a)):y.getAttribute("k-model")&&d.RegexpStr.inputElement.test(y.tagName)?a.childrenVdom.push(new h.InputDOM(y)):l.isUnknowElement(y.tagName)?a.childrenVdom.push(new t(y,n,a)):a.childrenVdom.push(new i.NormalDOM(y,n,a)):a.childrenVdom.push(new i.NormalDOM(y,n,a))}a.node=r}else console.error("无效标签"+a.tagName);return a}return o(t,e),t.prototype.renderInit=function(e,t){var r=this;void 0===e&&(e=null),this.insertNewDOM(),s.removeNode(this.node),this.childrenVdom.forEach(function(e){e.renderInit(r.$data,t,r)})},t.prototype.transDOM=function(e,t){return this.$dom},t.prototype.reRender=function(e,t){var r=this;this.childrenVdom.forEach(function(e){e.reRender(r.$data,t,r)})},t.prototype.getRealDOM=function(){var e=document.createElement("div");return e.innerHTML=this.template,e.firstChild},t.prototype.replaceDOM=function(){},t.prototype.insertNewDOM=function(){s.insertBefore(this.node,this.$dom),s.removeNode(this.node)},t}(a.VDOM);t.ComponentDOM=m},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var constant_1=__webpack_require__(0),object_1=__webpack_require__(2),function_1=__webpack_require__(15);exports.transArithmeticOp=function(tpl,obj){for(var opReg=constant_1.RegexpStr.arithmeticOp,arr=tpl.split(opReg),opRegArr=tpl.match(opReg),isParamReg=constant_1.RegexpStr.isParams,tmp,newStr="",i=0;i<arr.length;i++){if(tmp=arr[i].trim(),isParamReg.test(tmp)){var val=object_1.getDotVal(obj,tmp);isNaN(val)?newStr+='"'+val+'"':(val||(val=0),newStr+=val)}else newStr+=tmp;i<arr.length-1&&(newStr+=opRegArr[i])}var res=eval(newStr);return res},exports.transTernaryOperator=function(tpl,obj){for(var arr=tpl.split(/\?|:|\(|\)|\+|-|\*|\/|!/),match=tpl.match(/\?|:|\(|\)|\+|-|\*|\/|!/g),newStr="",i=0;i<arr.length;i++){var item=arr[i].trim();item&&constant_1.RegexpStr.isParams.test(item)?newStr+="_data."+item:newStr+=item,match[i]&&(newStr+=match[i])}return function(str,_data){return eval(str)}(newStr,obj)},exports.compileTpl=function(e,t){for(var r,n=constant_1.RegexpStr.brace;r=n.exec(e);){var o=r?r[1].trim():"";if(!o)return"";var i=function_1.evalJs(o,t);e=e.replace(n,i)}return e}},function(e,t,r){"use strict";var n,o=this&&this.__extends||(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var i=r(10),a=r(4),s=r(0),d=r(5),c=r(8),u=r(6),p=r(7),l=r(9),h=function(e){function t(r,n,o){void 0===o&&(o={});var i=e.call(this,r)||this;switch(i.childrenVdom=[],r.nodeType){case s.NodeType.TEXT:i.template=r.textContent,r.textContent="";break;case s.NodeType.ELEMENT:}if(i.tagName=r.tagName,i.attributes=r.attributes&&[].slice.call(r.attributes).slice(0),i.nodeType=r.nodeType,i.$dom=r,r.childNodes)for(var a=0;a<r.childNodes.length;a++){var d=r.childNodes[a];d.nodeType===s.NodeType.ELEMENT?d.getAttribute("k-for")?i.childrenVdom.push(new c.ForDOM(d,n,o)):d.getAttribute("k-model")&&s.RegexpStr.inputElement.test(d.tagName)?i.childrenVdom.push(new u.InputDOM(d)):p.isUnknowElement(d.tagName)?i.childrenVdom.push(new l.ComponentDOM(d,n,o)):i.childrenVdom.push(new t(d,n,o)):i.childrenVdom.push(new t(d,n,o))}return i}return o(t,e),t.prototype.renderInit=function(e,t,r){switch(void 0===r&&(r=null),this.nodeType){case s.NodeType.TEXT:var n=void 0;n=r?i.compileTpl(this.template,r.$data):i.compileTpl(this.template,e),a.changeTextContent(this.$dom,n);break;case s.NodeType.ELEMENT:this.childrenVdom.forEach(function(n){n.renderInit(e,t,r)}),this.renderAttr(e,t,r)}},t.prototype.reRender=function(e,t,r){switch(console.log(1),this.nodeType){case s.NodeType.TEXT:var n=void 0;(n=r?i.compileTpl(this.template,r.$data):i.compileTpl(this.template,e))&&a.changeTextContent(this.$dom,n);break;case s.NodeType.ELEMENT:this.childrenVdom.forEach(function(n){n.reRender(e,t,r)}),this.reRenderAttr(e,t,r)}},t.prototype.insertNewDOM=function(e){this.nextSibling?a.insertBefore(this.nextSibling,e):this.parentNode&&a.appendChild(this.parentNode,e)},t.prototype.transDOM=function(e,t){var r=this;return this.renderInit(e,t),this.childrenVdom.forEach(function(n){r.$dom.appendChild(n.transDOM(e,t))}),this.$dom},t}(d.VDOM);t.NormalDOM=h},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=r(2);t.observer=function(e,r,i){void 0===i&&(i="");var a=o.depCopy(e),s=function(o){var a=i?i+"."+o:o,s=e[o];Object.defineProperty(e,o,{configurable:!0,set:function(e){r.pendingValue=!0,r.changeQueue.push({kmv:r,bigKey:a}),r.watch[a]&&r.watch[a].call(r.data,e),this["__"+o+"__"]=e},get:function(){return void 0==this["__"+o+"__"]?s:this["__"+o+"__"]}}),"object"==typeof e[o]&&(Array.isArray(e[o])?function(e,t,r){n.ArrayMethod.forEach(function(n){Object.defineProperty(e,n,{configurable:!0,enumerable:!1,writable:!0,value:function(){Array.prototype[n].apply(e,arguments),t.changeQueue.push({kmv:t,bigKey:r}),t.pendingValue=!0}})})}(e[o],r,a):t.observer(e[o],r,a))};for(var d in e)s(d);return a}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){return function(){var e=this;this.eventObject={},this.$on=function(t,r){e.eventObject[t]={fn:r,once:!1}},this.$once=function(t,r){e.eventObject[t]={fn:r,once:!0}},this.$emit=function(t,r){var n=e.eventObject[t];n&&(n.once?(n.fn.apply(e,[].concat(r)),delete e.eventObject[t]):n.fn.apply(e,[].concat(r)))}}}();t.Event=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.bindEvent=function(e,t,r,n,o,i){e.addEventListener?e.addEventListener(t,function(){o&&o[r]?o[r].apply(i,n):console.error("未声明"+r+"方法")}):e.attachEvent("on"+t,function(){o&&o[r]?o[r].apply(i,n):console.error("未声明"+r+"方法")})}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.evalJs=function(e,t){try{return new Function("with(this){ return "+e+" }").call(t)}catch(e){return""}},t.evalFunc=function(e){return new Function("with(this){ console.log(this); return "+e+" }")}},function(e,t,r){"use strict";var n,o=this&&this.__extends||(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var i=r(10),a=r(4),s=r(5),d=r(8),c=r(6),u=r(0),p=function(e){function t(r,n,o){void 0===o&&(o={});var i=e.call(this,r)||this;switch(i.childrenVdom=[],i.tagName=r.tagName,i.attributes=r.attributes&&[].slice.call(r.attributes).slice(0),i.nodeType=r.nodeType,r.nodeType){case u.NodeType.TEXT:i.template=r.textContent;break;case u.NodeType.ELEMENT:if(i.kshow=r.getAttribute("k-show"),r.childNodes)for(var a=0;a<r.childNodes.length;a++){var s=r.childNodes[a];s.nodeType===u.NodeType.ELEMENT?s.getAttribute("k-for")?i.childrenVdom.push(new d.ForDOM(s,n,o)):s.getAttribute("k-model")&&u.RegexpStr.inputElement.test(s.tagName)?i.childrenVdom.push(new c.InputDOM(s)):i.childrenVdom.push(new t(s,n,o)):i.childrenVdom.push(new t(s,n,o))}}return i}return o(t,e),t.prototype.transDOM=function(e,t,r){void 0===r&&(r=null);var n=document.createElement(this.tagName);switch(this.nodeType){case u.NodeType.TEXT:n=a.createTextNode(this.tagName);var o=void 0;o=r?i.compileTpl(this.template,r.$data):i.compileTpl(this.template,e),n.textContent=o,this.$dom=n;break;case u.NodeType.ELEMENT:n=document.createElement(this.tagName),this.$dom=n,this.childrenVdom&&this.childrenVdom.forEach(function(o){o instanceof d.ForDOM?(o.parentNode=n,o.nextSibling=n.previousSibling,o.renderInit(e,t)):n.appendChild(o.transDOM(e,t,r))}),this.renderAttr(e,t,r)}return n},t.prototype.reRender=function(e,t,r){var n=this;switch(this.nodeType){case u.NodeType.TEXT:var o=i.compileTpl(this.template,e);a.changeTextContent(this.$dom,o);break;case u.NodeType.ELEMENT:this.childrenVdom.forEach(function(o){o instanceof d.ForDOM?o.reRender(e,t,r):(o.reRender(e,t,r),n.reRenderAttr(e,t,r))})}},t}(s.VDOM);t.ForNormalDOM=p},function(e,t,r){"use strict";var n,o=this&&this.__extends||(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var i=r(4),a=r(16),s=r(5),d=r(8),c=r(6),u=r(0),p=r(7),l=r(9),h=r(2),m=function(e){function t(t,r,n){void 0===n&&(n={});var o=e.call(this,t)||this;o.childrenVdom=[],o.componentInstance=null,t.nodeType==u.NodeType.ELEMENT&&p.isUnknowElement(t.tagName)&&(o.componentInstance=new l.ComponentDOM(t,r,n),(t=new l.ComponentDOM(t,r,n).getRealDOM()).$data=n,o.isComponent=!0),o.tagName=t.tagName,o.attributes=t.attributes,o.nodeType=t.nodeType,o.templateNode=t;for(var i=0;i<t.childNodes.length;i++){var s=t.childNodes[i];s.nodeType===u.NodeType.ELEMENT?p.isUnknowElement(s.tagName)?o.childrenVdom.push(new l.ComponentDOM(s,r,n)):s.getAttribute("k-for")?o.childrenVdom.push(new d.ForDOM(s,r,n)):s.getAttribute("k-model")&&u.RegexpStr.inputElement.test(s.tagName)?o.childrenVdom.push(new c.InputDOM(s)):o.childrenVdom.push(new a.ForNormalDOM(s,r,n)):s.nodeType===u.NodeType.TEXT&&o.childrenVdom.push(new a.ForNormalDOM(s,r,r.$data))}return t.removeAttribute("k-for"),o}return o(t,e),t.prototype.transDOM=function(e,t){for(var r=i.createElement(this.tagName),n=0,o=this.childrenVdom.length;n<o;n++){var a=this.childrenVdom[n].transDOM(e,t,this.componentInstance);a&&r.appendChild(a)}if(this.$dom=r,this.kshow){var s=h.getDotVal(e,this.kshow);this.$dom.style.display=s?"block":"none"}if(this.kif&&!h.getDotVal(e,this.kif))return this.$emptyComment;return this.$dom},t.prototype.reRender=function(e,t,r){void 0===r&&(r=null),this.isComponent&&(r=this.componentInstance),this.childrenVdom.forEach(function(n){n.reRender(e,t,r)})},t.prototype.insertNewDOM=function(e){this.nextSibling?i.insertBefore(this.nextSibling,e):this.parentNode&&i.appendChild(this.parentNode,e)},t}(s.VDOM);t.ForItemDOM=m},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=r(8),i=r(11),a=r(6),s=r(7),d=r(9),c=function(){function e(e,t){this.queue=[],this.kmv=t,this.queue=this.queueInit(e)}return e.prototype.getQueue=function(){return this.queue},e.prototype.queueInit=function(e){for(var t=e.childNodes,r=0;r<t.length;r++){var c=t[r];switch(c.nodeType){case n.NodeType.TEXT:this.queue.push(new i.NormalDOM(c,this.kmv));break;case n.NodeType.ELEMENT:s.isUnknowElement(c.tagName)?this.queue.push(new d.ComponentDOM(c,this.kmv,null)):c.getAttribute("k-for")?this.queue.push(new o.ForDOM(c,this.kmv,this.kmv.data)):c.getAttribute("k-model")&&n.RegexpStr.inputElement.test(c.tagName)?this.queue.push(new a.InputDOM(c)):this.queue.push(new i.NormalDOM(c,this.kmv))}}return this.queue},e}();t.RenderQueue=c},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.renderInit=function(e){for(var r=e.renderQueue.getQueue(),n=0;n<r.length;n++){r[n].renderInit(e.data,e)}t.nextTick(e)};t.nextTick=function(e){setTimeout(function(){!function(e){if(e.pendingValue){console.log("reRender"),e.pendingValue=!1;var r=e.changeQueue.pop();r&&t.reRender(r.kmv,r.bigKey),e.changeQueue.length=0}t.nextTick(e)}(e)},0)},t.reRender=function(e,t){for(var r=e.renderQueue.getQueue(),n=0;n<r.length;n++){r[n].reRender(e.data,e)}}}]);
//# sourceMappingURL=bundle.js.map