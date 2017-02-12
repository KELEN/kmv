export class Event {
    eventObject = {};
    constructor() {}
    $on = (event, fn) => {
        this.eventObject[event] = {
            fn: fn,
            once: false
        };
    }
    $once = (event, fn) => {
        this.eventObject[event] = {
            fn: fn,
            once: true
        };
    }
    $emit = (event, params) => {
        let thisEvent = this.eventObject[event];
        if (thisEvent) {
            if (thisEvent.once) {
                thisEvent['fn'].apply(this, [].concat(params));
                delete this.eventObject[event];
            } else {
                thisEvent['fn'].apply(this, [].concat(params));
            }
        }
    }
}