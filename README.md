# 一个轻量的数据渲染框架, kmv.js, 压缩后只有20k~, 速度还行

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
<select class="select" k-on:change="change(this)">
    <option k-for="item in options" k:value={{ item.num }}>{{ item.name }}</option>
</select>
<h3>嵌套for循环</h3>
    <div k-for="ar in articles">
        <h3>{{ ar.title }}</h3>
        <div class="tags-wrap">
            <span k-for="tag in ar['tags']">{{ tag }}</span> <h1>{{ ar.author }}</h1>
        </div>
        <em>{{ ar.time }}</em>
    </div>
<script>
var kmv = new Kmv({
     el: '#div1',
     data: {
         list: [ 1, 2, 3, 4, 5 ],
         options: [
              { name: "语文", num: 100 },
              { name: "数学", num: 80 },
              { name: "英语", num: 70 },
              { name: "地理", num: 20 }
         ],
         articles: [
             {
                 title: "第一篇",
                 author: "kelen",
                 tags: [1,3,4,5],
                 time: new Date()
             },{
                 title: "第二篇",
                 author: "kelen",
                 tags: [1,3,4,5],
                 time: new Date()
             },{
                 title: "第三篇",
                 author: "kelen",
                 tags: [1,3,4,5],
                 time: new Date()
             },{
                 title: "我下下",
                 author: "kelen",
                 tags: [1,3,4,5],
                 time: new Date()
             },{
                 title: "第四篇",
                 author: "kelen",
                 tags: [1,3,4,5],
                 time: new Date()
             }
         ]
     }
 });
</script>
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

### beforeInit函数 初始化数据, 例如ajax获取后绑定到kmv实例上

``` html
<div id="div1" class="div">
    {{ postsPageData.totalPage }}
</div>
<span id="loading">loading</span>
<script>
    var spn = document.getElementById("loading");
    var kmv = new Kmv({
        el: '#div1',
        data: {
            name: "kelen"
        },
        beforeInit: function (event) {
            setTimeout(function() {
                // 模拟ajax获取数据
                var data = {
                    postsPageData: {"totalPage":6,"nowPage":1,"pageSize":8 }
                }
                spn.style.display = "none";
                // 触发initData事件
                event.$emit("initData", data);
            }, 1000)
        }
    });
</script>
```

### 自定义组件，组件共用同一实例的数据

``` html
<div id="div1" class="div">
    <my-comment :comment="comment" :name="name"></my-comment>
    <button k-on:click="addComment()">add comment</button>
    <input type="text" k-model="name">
</div>
<script>
    var temp = "<ul><li k-for='i in comment'>{{ i.title }} by {{ name }}</li></ul>";
    var spn = document.getElementById("loading");
    var kmv = new Kmv({
        el: '#div1',
        data: {
            name: "Hello kmv.js!",
            comment: [
                { title: "评论1", time: new Date() },
                { title: "评论2", time: new Date() },
                { title: "评论3", time: new Date() },
                { title: "评论4", time: new Date() },
            ]
        },
        components: {
            'my-comment': {
                template: temp
            }
        },
        methods: {
            addComment: function() {
                this.comment.push({
                    title: "评论" + Math.random(),
                    time: new Date()
                })
            }
        }
    });
</script>
```