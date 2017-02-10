import { renderInit } from './util/render'
import { observer } from './util/observer'
import { Watcher } from "./util/watcher"

function Kmv(opts) {

    let elSelector = opts['el'];
    let elem = document.querySelector(elSelector);
    let that = this;

    this.data = opts.data;

    this.flush = false;

    this.watchers = new Watcher(elem);

    this.$data = observer(opts.data, this);

    this.methods = opts.methods;

    // console.log(this.watchers);
    setTimeout(function() {
        renderInit(that);
    }, 0);

    return this;
}

(<any>window).Kmv = Kmv;

export default Kmv;


