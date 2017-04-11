import { renderInit } from './util/render'
import { observer } from './core/observer'
import { RenderQueue } from "./core/RenderQueue"
import { Event } from './util/event'
import { extend } from './util/object'

function Kmv(opts) {

    let elSelector = opts['el'];
    let elem = document.querySelector(elSelector);
    if (!elem) {
        console.error("元素" + elSelector + "不存在!");
        return;
    }
    this.data = opts.data;
    // 原始数据
    this.watch = opts.watch || {};
    this.pendingValue = false;
    this.changeQueue = [];      // 每次循环改变队列
    this.methods = opts.methods;    // 自定义事件

    this.components = extend(this.components, opts.components);
    this.mounted = typeof opts.mounted === 'function' ? opts.mounted : null;

    let that = this;
    if (opts.beforeInit) {
        let event = new Event();
        // 初始化数据事件
        event.$once("initData", function(data) {
            let allData = extend(opts.data, data);
            observer(allData, that);
            // 获取需要渲染的dom列表
            that.renderQueue = new RenderQueue(elem, this);
            renderInit(that);
        });
        opts.beforeInit.call(that, event);
    } else {
        observer(opts.data, this);
        // 获取需要渲染的dom列表
        this.renderQueue = new RenderQueue(elem, this);
        renderInit(this);
    }
    this.mounted && this.mounted.call(this);
    return this;
}

(<any>Kmv).components = (name, config) => {
    if (!Kmv.prototype.components) {
        Kmv.prototype.components = {};
    }
    Kmv.prototype.components[name] = config;
}

(<any>window).Kmv = Kmv;


