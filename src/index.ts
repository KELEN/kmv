import { renderInit } from './util/render'
import { observer } from './util/observer'
import { RenderQueue } from "./util/RenderQueue"

function Kmv(opts) {

    let elSelector = opts['el'];
    let elem = document.querySelector(elSelector);
    this.data = opts.data;
    // 获取需要渲染的dom列表
    this.renderQueue = new RenderQueue(elem);
    // 原始数据
    this.$data = observer(opts.data, this);
    this.watch = opts.watch || {};

    this.pendingValue = false;
    this.pendingArray = false;

    this.circle = {};

    this.changeQueue = [];

    this.methods = opts.methods;
    renderInit(this);
    return this;
}

(<any>window).Kmv = Kmv;

export default Kmv;


