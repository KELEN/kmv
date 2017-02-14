import { renderInit } from './util/render'
import { observer } from './util/observer'
import { RenderQueue } from "./util/RenderQueue"
import { Event } from './util/event'
import { extend } from './util/object'

function Kmv(opts) {

    let elSelector = opts['el'];
    let elem = document.querySelector(elSelector);
    this.data = opts.data;
    // 获取需要渲染的dom列表
    this.renderQueue = new RenderQueue(elem);
    // 原始数据
    this.watch = opts.watch || {};
    this.pendingValue = false;
    this.pendingArray = false;
    this.changeQueue = [];      // 每次循环改变队列
    this.methods = opts.methods;    // 自定义事件

    let that = this;
    if (opts.beforeInit) {
        let event = new Event();
        event.$once("initData", function(data) {
            let allData = extend(opts.data, data);
            that.$data = observer(allData, that);
            renderInit(that);
        });
        opts.beforeInit.call(that, event);
    } else {
        this.$data = observer(opts.data, this)
        renderInit(this);
    }
    return this;
}

let init = (kmv) => {

}

(<any>window).Kmv = Kmv;

export default Kmv;


