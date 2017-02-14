# 一个轻量的数据渲染框架, kmv.js, 压缩后只有17k~, 速度还行

### 数据双向绑定

``` html
<div id="div1" class="div">
    hello, {{ name }} {{ age }}  <!-- hello, kelen 25 -->
</div>
<script>
    var kmv = new Kmv({
        el: '#div1',
        data: {
            name: "kelen",
            age: 25
        }
    });
</script>
```
### 列表渲染 k-for

``` html
<li k-for="i in list">{{ i }}</li>
<!--
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
 -->
var kmv = new Kmv({
     el: '#div1',
     data: {
         list: [ 1, 2, 3, 4, 5 ]
     }
 });

####  支持 push() pop() shift() unshift() splice() sort() reverse()
用法: kmv.data.list.push(100);
```

### 属性模板 k:href
``` html
    <div id="div1" class="div">
        <a k:href="url">百度</a>
    </div>
    <script src="../dist/bundle.js"></script>
    <script>
        var kmv = new Kmv({
            el: '#div1',
            data: {
                url: "www.baidu.com"
            }
        });
    </script>
```

### 样式选择 k:class

语法: k:class="a: hello1, b: hello2"
说明: 当a为真class="hello1", b为真class="hello2", 同时为真class="hello1 hello2"

``` html
<a k:href="url" k:title="title" k:class="a: hello1, b: hello2">百度</a>
<button k-on:click="change()">change</button>
<script>
var kmv = new Kmv({
    el: '#div1',
    data: {
        title: "this is baidu",
        url: true,
        a: false,
        b: true
    },
    methods: {
        change: function() {
            this.a = !this.a;
        }
    }
});
</script>
```

### 事件绑定
``` html
    <div id="div1" class="div">
        <button k-on:click="say({{ name }})">click</button>
    </div>
    <script src="../dist/bundle.js"></script>
    <script>
        var kmv = new Kmv({
            el: '#div1',
            data: {
                name: "kelen"
            },
            methods: {
                say: function(name) {
                    alert(name);
                }
            }
        });
    </script>
```

### k-if语法
``` html
    <div id="div1" class="div">
        <h3 k-if="show">show</h3>
        <button k-on:click="say({{ name }})">click</button>
    </div>
    <script src="../dist/bundle.js"></script>
    <script>
        var kmv = new Kmv({
            el: '#div1',
            data: {
                name: "kelen",
                show: true
            },
            methods: {
                say: function(name) {
                    this.show = !this.show;
                }
            }
        });
    </script>
```

### watch监听属性变化

``` html
<div id="div1" class="div">
    <input k-model="name"/>
    <h1>{{ fullName }}</h1>
</div>
<script src="../dist/bundle.js"></script>
<script>
    var kmv = new Kmv({
        el: '#div1',
        data: {
            title: "this is baidu",
            name: "kelen",
            fullName: "huang kelen",
            url: true
        },
        watch: {
            name: function(newVal) {
                this.fullName = "huang " + this.name;
            },
        }
    });
</script>
```