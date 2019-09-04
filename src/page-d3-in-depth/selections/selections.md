# 选择集
> Selections
>
> 原文：https://www.d3indepth.com/selections/
>
> 作者：Peter Cook

D3 selections提供了选择DOM元素以对元素进行操作的功能，可以修改元素样式（style）、属性（attributes）、绑定数据（data-joins）或者插入/删除元素。

比如，给定5个圆，我们可以使用`d3.selectAll`来选择所有的圆然后使用`.style`和`.attr`方法来修改它们。

```js
d3.selectAll('circle)
  .style('fill', 'orange')
  .attr('r', () => return 10 + Math.random() * 40)
```

## 创建选择集
> Making selections

D3有两个方法可以创建选择集：`d3.select`和`d3.selectAll`。

`d3.select`选择匹配到的第一个元素，而`d3.selectAll`选择所有匹配的元素。它们都接受一个CSS选择器字符串作为参数（也可以是DOM元素）。

比如使用`d3.selectAll('.item')`选择所有类名为`item`的元素。

## 修改元素
> Modifying elements

创建好选择集后，就可以使用以下方法来修改元素：

| 方法名（Name） | 行为（Behaviour） | 示例（Example） |
| :----- | :---- | :---- |
| .style | 更新样式 | d3.selectAll('circle').style('fill', 'red') |
| .attr | 更新attribute属性 | d3.selectAll('rect').attr('width', 10) |
| .classed | 添加/移除class属性 |	d3.select('.item').classed('selected', true) |
| .property |	更新元素的property属性 |	d3.selectAll('.checkbox').property('checked', false) |
| .text |	更新文本内容 | d3.select('div.title').text('My new book') |
| .html |	修改html内容	| d3.select('.legend').html('<div class="block"\></div\><div\>0 - 10</div\>') |

不管是使用`.select`还是`.selectAll`，选择集里的所有元素都会被修改。

[示例](https://bl.ocks.org/d3indepth/3236a4658005ab78d60816b74830694b)

## 根据函数更新选择集
> Updating selections with functions

除了可以传递类似`red`、`10`、`true`之类的常量参数给`.style`、`.attr`、`.classed`、`.property`、`.text`和`.html`方法，还可以传递函数作为参数：

```js
d3.selectAll('circle')
  .attr('cx', function(d, i) {
    return i * 100
  })
```

这个函数通常接受两个参数`d`和`i`。第一个参数`d`是绑定到元素的数据（参考章节[data joins](https://www.d3indepth.com/datajoins/)），参数`i`是元素在选择集中的索引。（使用`d`和`i`作为参数名称不过是约定俗成，完全可以自定义命名）

如果想根据在选择集中的位置来更新元素，我们可以利用参数`i`。比如设置`rect`的水平位置：

```js
d3.selectAll('rect')
  .attr('x', (d, i) {
    return i * 40
  })
```

[示例](https://bl.ocks.org/d3indepth/9c59fb1fe6e914538341308340296885)

大多数情况用作参数函数的是匿名函数，但是也可以使用具名函数，比如：

```js
function positionRects(d, i) {
  return i * 40
}

d3.selectAll('rect')
  .attr('x', positionRects)
```

## 事件处理
> Handling events

可以通过选择集的`.on`方法给选中的元素添加事件处理器，事件的回调函数接收`d`和`i`作为参数。如前所述，`d`是元素上绑定的数据，`i`是元素在选择集中的索引。

如下是包含的最常用的事件（详见[MDN event reference](https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events)）：

| 事件名 | 描述 |
| :---- | :---- |
| click | 元素被点击 |
| mouseenter | 鼠标指针（mouse pointer）移入元素 |
| mouseover | 鼠标指针移入元素或其子元素，即移入移出子元素时也会触发 |
| mouseleave | 鼠标指针移出元素 |
| mouseout | 鼠标指针移出元素或其子元素，即移入移出子元素时也会触发 |
| mousemove | 鼠标指针在元素上移动，包括在子元素上 |

在事件回调函数中，`this`被绑定为当前的DOM元素（注意如果要使用这个特性，不要使用箭头函数）。这允许我们这么做：

```js
d3.selectAll('circle')
  .on('click', function(d, i) {
    d3.select(this)
      .style('fill', 'orange')
  })
```

[示例](https://bl.ocks.org/d3indepth/b18879fe295375bb0e0b77cf21d11675)

要注意的是`this`是一个DOM元素而不是D3选择集，所以如果要使用D3去修改它，需要先使用`d3.select(this)`选择它。

## 插入和移除元素
> Inserting and removing elements

可以使用`.append`和`.insert`方法添加元素，用`.remove`方法移除元素。

`.append`方法向选择集里每个元素的子元素里追加一个元素，第一个参数声明元素的类型。

在下面示例中我们初始化3个包含一个`circle`元素的`g`元素：

```html
<g class="item" transform="translate(0, 0)">
  <circle r="40" />
</g>
<g class="item" transform="translate(120, 0)">
  <circle r="40" />
</g>
<g class="item" transform="translate(240, 0)">
  <circle r="40" />
</g>
```

我们可以这样给每个`g`元素添加一个`text`元素：

```js
d3.selectAll('g.item')
  .append('text')
  .text(function(d, i) {
    return i + 1
  })
```

这会给每个`g.item`代表的元素添加一个`text`元素：

```html
<g class="item" transform="translate(0, 0)">
  <circle r="40" />
  <text>1</text>
</g>
<g class="item" transform="translate(120, 0)">
  <circle r="40" />
  <text>2</text>
</g>
<g class="item" transform="translate(240, 0)">
  <circle r="40" />
  <text>3</text>
</g>
```

[示例](https://bl.ocks.org/d3indepth/15daaf6e65f1937c890aab8a1b94ce3a)

（`.append`方法通常结合[enter/exit](https://www.d3indepth.com/enterexit)的上下文使用，这种情况下会有不同的表现。）

`.insert`方法类似于`.append`，但是它允许声明一个`before`元素作为参数，如你所料，也就是说明新元素要插入在哪个元素之前。

因此如果我们重复上面的示例，但是改成在circle元素之前插入text：

```js
d3.selectAll('g.item')
  .insert('text', 'circle')
  .text(function(d, i) {
    return i + 1
  })
```

这样DOM就会是这样：

```html
<g class="item" transform="translate(0, 0)">
  <text>1</text>
  <circle r="40" />
</g>
<g class="item" transform="translate(120, 0)">
  <text>2</text>
  <circle r="40" />
</g>
<g class="item" transform="translate(240, 0)">
  <text>3</text>
  <circle r="40" />
</g>
```

[示例](https://bl.ocks.org/d3indepth/6e320e0fb89e5bc8bdde468d301880e5)

`.remove`方法移除选择集中的所有元素。比如给定一些circle元素，可以这样移除：

```js
d3.selectAll('circle')
  .remove()
```

[示例](https://bl.ocks.org/d3indepth/cd21d0522fc6f48e3fb88c7f770eb008)

## 链式调用
> Chaining

大部分选择集方法会返回当前选择集，这样的话选择集方法如`.style`、`.attr`和`.on`等可以被链式调用：

```js
d3.selectAll('circle')
  .style('fill', 'orange')
  .attr('r', 20)
  .on('click', function(d, i) {
    d3.select('.status')
      .text('You clicked on circle ' + i);
  });
```

[示例](https://bl.ocks.org/d3indepth/a8eb48f2add08e8f010c829863101773)

## each和call
> Each and call 遍历和调用

`.each`方法允许在选择集的每个元素上调用一个函数，`.call`方法则是在选择集自身上调用一个函数。

`.each`接收元素绑定的数据（通常用`d`表示）和元素在选择集的索引（通常用`i`表示）作为参数，它可用于组件复用，还可用于进行共享的计算后再调用`.style`、`.attr`等方法。

这是一个用`.each`调用一个可复用组件的例子：

```js
function addNumberedCircle(d, i) {
  d3.select(this)
    .append('circle')
    .attr('r', 40)

  d3.select(this)
    .append('text')
    .attr('x', 30)
    .attr('y', 50)
}

d3.selectAll('g.item')
  .each(addNumberedCircle)
```

[示例](https://bl.ocks.org/d3indepth/a3da017386189aec222e95a82c5f985e)

这是`.each`的后一种用法：

```js
d3.selectAll('circle')
  .each(function(d, i) {
    const odd = i % 2 === i

    d3.select(this)
      .style('fill', odd ? 'orange' : '#ddd')
      .attr('r', odd ? 40 : 20)
  })
```

[示例](https://bl.ocks.org/d3indepth/7126f834e490b29c9cc26df71c1c1f69)

`.call`方法接收调用它的选择集本身作为参数。使用`.call`是实现组件复用的一种通用模式。

下面的例子我们使用了和刚才很相似的组件，但这次传入选择集自身作为参数（而不是`d`和`i`）：

```js
function addNumberedCircle(selection) {
  selection
    .append('circle')
    .attr('r', 40);

  selection
    .append('text')
    .text(function(d, i) {
      return i + 1;
    })
    .attr('y', 50)
    .attr('x', 30);
}

d3.selectAll('g.item')
  .call(addNumberedCircle);
```

## 选择集筛选和排序
> Filtering and sorting selections

使用`.filter`方法可以对选择集进行筛选（过滤），它接收一个函数作为参数，会被选择集的每个元素调用，如果元素要被包含在筛选后的集合里，函数就返回`true`。`.filter`方法返回筛选后的新的选择集。

这个例子里我们将偶数索引的元素设为橙色：

```js
d3.selectAll('circle)
  .filter(function(d, i) {
    return i % 2 === 0
  })
  .style('fill', 'orange')
```

[示例](https://bl.ocks.org/d3indepth/57a3707ec2931ced16939000d113e8d4)

排序仅在选择集进行过数据绑定（data joins）后才有意义，所以请先阅读[data joins](https://www.d3indepth.com/datajoins)这一节。

使用`.sort`方法可以对选择的元素进行排序，它接收一个比较器函数作为参数。这个选择器函数接收两个参数，通常命名为`a`和`b`，这两个参数分别代表进行比较的两个元素所绑定的数据。如果比较器函数返回一个负值，那么`a`被放在`b`之前；如果是正值，`a`放在`b`之后。

所以如果我们有如下数据被绑定到选择集：

```js
[
  {
    "name": "Andy",
    "score": 37
  },
  {
    "name": "Beth",
    "score": 39
  },
  {
    "name": "Craig",
    "score": 31
  },
  {
    "name": "Diane",
    "score": 35
  },
  {
    "name": "Evelyn",
    "score": 38
  }
]
```

我们可以这样根据`score`的值排序：

```js
d3.selectAll('.person')
  .sort(function(a, b) {
    return b.score - a.score
  })
```

[示例](https://bl.ocks.org/d3indepth/961bb0efe94bde8b2b6fe2957ccb632f)