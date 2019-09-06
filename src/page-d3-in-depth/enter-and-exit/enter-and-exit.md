# Enter 和 Exit
> Enter and exit
>
> 原文：https://www.d3indepth.com/enterexit/
>
> 作者：Peter Cook


在[数据绑定](https://www.d3indepth.com/datajoins)章节，我们展示了如何将数组数据绑定到某个D3的选择集上。

回顾一下，给定DOM元素：

```html
<div id="content">
  <div></div>
  <div></div>
  <div></div>
</div>
```

和数据：

```js
var myData = [ 10, 40, 20 ];
```

我们这样讲数组绑定到`div`元素上：

```js
d3.select('#content')
  .selectAll('div')
  .data(myData);
```

这个例子中`myData`和选择集的长度是一样的。

然而，如果数组元素比选择集元素更多（或更少）会怎么样？

- 如果数组比选择集**长**，那么就**缺少**DOM元素，需要**添加**元素

- 如果数组比选择集**短**，那么DOM元素就有**多余**，需要**移除**元素

幸运的是D3提供了两个方法`.enter`和`.exit`来帮助添加和移除DOM元素。


## .enter

`.enter`标识了当绑定的数组比选择集长时需要添加的DOM元素。它被定义在一个**update选择集（update selection）**（由`.data`返回的选择集）上。

```js
d3.select('#content')
  .selectAll('div')
  .data(myData)
  .enter();
```

`.enter`返回一个**enter选择集（enter selection）**，代表需要添加的DOM元素。通常在后面接`.append`方法来真正添加元素到DOM中。

```js
d3.select('#content')
  .selectAll('div')
  .data(myData)
  .enter()
  .append('div');
```

看个例子，假设我们有如下`div`元素：

```html
<div id="content">
  <div></div>
  <div></div>
  <div></div>
</div>
```

和如下数据：

```js
var myData = ['A', 'B', 'C', 'D', 'E'];
```

我们使用`.enter`和`.append`来添加对应`D`和`E`的`div`元素：

```js
  d3.select('#content')
    .selectAll('div')
    .data(myData)
    .enter()
    .append('div');
```

[示例](https://bl.ocks.org/d3indepth/1450ba61704293ce528646a1cf02fd85)

注意，我们可以将数组绑定到空选择集，这是D3官网示例里一种非常通用的模式。

[示例](https://bl.ocks.org/d3indepth/8c88eef33524c142152038fc14798fd2)


## .exit

`.exit`返回一个**exit选择集（exit selection）**，包含需要从DOM中移除的元素。通常在后面用`.remove`方法来真正移除元素：

```js
d3.select('#content')
  .selectAll('div')
  .data(myData)
  .exit()
  .remove();
```

利用上面的例子尝试下`.exit`，开始时有这些元素：

```html
<div id="content">
  <div></div>
  <div></div>
  <div></div>
</div>
```

和数据（注意数据比选择集短）：

```js
var myData = ['A'];
```

使用`.exit`和`.remove`来移除多余元素：

```js
d3.select('#content')
  .selectAll('div')
  .data(myData)
  .exit()
  .remove();
```

[示例](https://bl.ocks.org/d3indepth/3a7df9b204de85aa0993ab87cd196ec0)


## 一起使用
> Putting it all together

本文目前为止我们还没有使用`.style`、`.attr`和`.classed`等方法修改元素。

D3允许我们在添加新元素时声明要修改哪部分元素：

- 已有元素
- 新增元素
- 同时包括已有元素和新增元素

（大多数时候最后一个选项就够用了，不过有时候我们可能想要为新增的元素设置不同的样式。）

已有元素被称作**update选择集（update selection）**，这个选择集是由`.data`方法返回的，在下面例子中用变量`u`表示：

```js
var myData = ['A', 'B', 'C', 'D', 'E'];

var u = d3.select('#content')
  .selectAll('div')
  .data(myData);

u.enter()
  .append('div');

u.text(function(d) {
  return d;
});
```

[示例](https://bl.ocks.org/d3indepth/2b99df70ff7209fa3a373ddf95f06a9d)

这个示例中添加了新元素，但是由于`.text`方法仅在**update选择集**上调用了，所以只修改了已有的元素。
<!-- When the button is clicked, new elements are added, but because .text is only called on the update selection, it’s only the existing elements that are modified. (Note that if the button is clicked a second time, all the elements are modified. This is because the selection will contain all 5 div elements. Don’t worry about this too much if you’re new here!) -->

新增元素被称为**enter选择集（enter selection）**，它是由`.enter`方法返回的。可以这样修改enter选择集：

```js
var myData = ['A', 'B', 'C', 'D', 'E'];

var u = d3.select('#content')
  .selectAll('div')
  .data(myData);

u.enter()
  .append('div')
  .text(function(d) {
    return d;
  });
```

[示例](https://bl.ocks.org/d3indepth/9c415c514c2efd693edc26a722b1b973)

在这个例子中，新增了元素并且它们的文本内容被更新了，而且因为只在enter选择集上调用了`.text`方法，所以仅仅只有新增的元素被更新了文本。
<!-- When the button is clicked, new elements are added and their text content is updated. Only the entering elements have their text updated because we call .text on the enter selection. -->

如果我们想同时修改已有元素和新增元素，我们可以分别为update选择集和enter选择集调用`.text`方法。
<!-- If we want to modify the existing and entering elements we could call .text on the update and enter selections. -->

然而D3提供了一个`.merge`方法来合并选择集，因此我们可以这么做：
<!-- However D3 has a function .merge which can merge selections together. This means we can do the following: -->

```js
var myData = ['A', 'B', 'C', 'D', 'E'];

var u = d3.select('#content')
  .selectAll('div')
  .data(myData);

u.enter()
  .append('div')
  .merge(u)
  .text(function(d) {
    return d;
  });
```

[示例](https://bl.ocks.org/d3indepth/79c8655fbd9a886b8ef8d36e00b9074b)

<!-- This is a big departure from v3. The entering elements were implicitly included in the update selection so there was no need for .merge. -->


## 通用更新模式
> General update pattern

一种通用模式（由D3作者Mike Bostock提出）是将上述的DOM元素添加、移除和更新行为封装到一个函数中：
<!-- A common pattern (proposed by D3’s creator Mike Bostock) is to encapsulate the above behaviour of adding, removing and updating DOM elements in a single function: -->

```js
function update(data) {
  var u = d3.select('#content')
    .selectAll('div')
    .data(data);

  u.enter()
    .append('div')
    .merge(u)
    .text(function(d) {
      return d;
    });

  u.exit().remove();
}
```

[示例](https://bl.ocks.org/d3indepth/e25e81566cea413de9873b9339fa7518)

通常每当数据发生变化时，`update`函数就会被调用。
<!-- Typically the update function is called whenever the data changes. -->

下面这个例子我们将新增元素的颜色设为橘黄色：
<!-- Here’s another example where we colour entering elements orange: -->

```js
// 用.new 类表示新增，样式颜色是orange
function update(data) {
  var u = d3.select('#content')
    .selectAll('div')
    .data(data);

  u.enter()
    .append('div')
    .classed('new', true)
    .text(function(d) {
      return d;
    });

  u.text(function(d) {
      return d;
    })
    .classed('new', false);

  u.exit().remove();
}
```

[示例](https://bl.ocks.org/d3indepth/bdc412597d64502e7ab82d8ff0d56bb7)


## 数据绑定的key函数
> Data join key function

进行数据绑定时，D3将第1个数组元素绑定（bind）到第1个选择集里的DOM元素，将第2个数组元素绑定到第2个DOM元素，以此类推。
<!-- When we do a data join D3 binds the first array element to the first element in the selection, the second array element to the second element in the selection and so on. -->

但是，如果数组元素的顺序变了（比如做了排序、插入和移除等），那么数组元素就可能会被绑定到不同的DOM元素上。
<!-- However, if the order of array elements changes (such as during element sorting, insertion or removal), the array elements might get joined to different DOM elements. -->

通过给`.data`方法提供一个`key函数`可以解决这个问题。这个函数需要为每个数组元素返回一个唯一的id值，以保证D3将每个数组元素始终绑定到同一个DOM元素。
<!-- We can solve this problem by providing .data with a key function. This function should return a unique id value for each array element, allowing D3 to make sure each array element stays joined to the same DOM element. -->

看个例子，先使用`key`函数，然后不用：
<!-- Let’s look at an example, first using a key function, and then without. -->

最开始给定一个数组`['Z']`，每次点击按钮都会在数组前面添加一个新的字母。
<!-- We start with an array ['Z'] and each time the button is clicked a new letter is added at the start of the array. -->

因为使用了`key`函数，每个字母会一直和同一个DOM元素绑定，这意味着添加新字母时，每个已有的字母会移动到新的位置。
<!-- Because of the key function each letter will stay bound to the same DOM element meaning that when a new letter is inserted each existing letter transitions into a new position: -->

[示例](https://bl.ocks.org/d3indepth/5e721266739f8324213171e2ef535c54)

不使用`key`函数时，DOM元素的文本（而不是位置）被修改，这意味着失去了有用的过渡效果：
<!-- Without a key function the DOM elements’ text is updated (rather than position) meaning we lose a meaningful transition effect: -->

[示例](https://bl.ocks.org/d3indepth/00bd03fa9ddf292a856a734102e74d9d)

很多情况没必要使用`key`函数，但是如果你的数据元素会改变位置（比如通过插入或排序）并且采用了过渡动画，那么你很可能应该使用`key`函数。
<!-- There’s many instances when key functions are not required but if there’s any chance that your data elements can change position (e.g. through insertion or sorting) and you’re using transitions then you should probably use them. -->