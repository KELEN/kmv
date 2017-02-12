import　{　Event　} from '../util/event'

let event = new Event();

event.$on("change", (msg) => {
    console.log(msg);
});

event.$once("once", (msg) => {
    console.log(msg);
})

event.$emit("change", "what's your name");
event.$emit("change", "what's your name2");
event.$emit("once", "hello once");
event.$emit("once", "hello once");