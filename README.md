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
### 列表渲染



* 获取原始数据: kmv.$data
* 设置数据 kmv.data.name = "kobe";
* 元素属性 <img k:src="http://www.baidu.com/{{ name }}" />  ==> <img src="http://www.baidu.com/kelen" />

*
* 私有组件事件 <button k-on:click