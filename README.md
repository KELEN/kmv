# 一个简单的mvvm框架，Kmv.js


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

### 属性模板 k:href 或者 href
``` html
    <div id="div1" class="div">
        <!-- 第一种写法 -->
        <a k:href="{{ url }}">百度</a>
        <!-- 第二种写法 -->
        <button href="{{ url }}">百度</button>
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
