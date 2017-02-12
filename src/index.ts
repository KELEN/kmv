import { renderInit } from './util/render'
import { observer } from './util/observer'
import { Watcher } from "./util/watcher"

function Kmv(opts) {

    let elSelector = opts['el'];
    let elem = document.querySelector(elSelector);
    this.data = opts.data;
    // 获取需要渲染的dom列表
    this.watchers = new Watcher(elem);
    // 原始数据
    this.$data = observer(opts.data, this);

    console.log(this.watchers);

    this.methods = opts.methods;
    renderInit(this);
    return this;
}

(<any>window).Kmv = Kmv;

export default Kmv;


