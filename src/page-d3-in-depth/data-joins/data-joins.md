# 数据绑定
> Data joins
>
> 原文：https://www.d3indepth.com/datajoins/
>
> 作者：Peter Cook

给定一个数组数据和一个D3选择集，我们可以将每一个数组元素一一对应绑定（join）到选择集里的DOM元素上。（ps：原文单词是attach/join，直译是连接，data joins也许可以直译成数据连接或者数据关联，但是个人觉得数据绑定比较形象好懂，也就是把数据绑定/添加到DOM元素上，不过要区别于Vuejs的那种数据绑定，两者是完全不同的。）

这使得数据和图形元素之间实现了强关联，从而可以直接实现数据驱动元素更新。

比如我们有这样一些SVG circle元素：

```html
<circle r="40" />
<circle r="40" cx="120" />
<circle r="40" cx="240" />
<circle r="40" cx="360" />
<circle r="40" cx="480" />
```

以及一些数据：

```js
const scores = [
  {
    "name": "Andy",
    "score": 25
  },
  {
    "name": "Beth",
    "score": 39
  },
  {
    "name": "Craig",
    "score": 42
  },
  {
    "name": "Diane",
    "score": 35
  },
  {
    "name": "Evelyn",
    "score": 48
  }
]
```

我们可以选中这些圆，并将它们和数组绑定起来：

```js
d3.selectAll('circle')
  .data(scores);
```

现在我们可以根据绑定的数据来操作circle元素：

```js
d3.selectAll('circle')
  .attr('r', function(d) {
    return d.score;
  });
```

上述代码将每个圆的半径设置成了对应的人的分数。

[示例](https://bl.ocks.org/d3indepth/1316222b296ed9fd572978d90cde0971)



## 实现数据绑定
> Making a data join

给定一个数组`myData`和一个选择集`s`，可以使用`.data`方法来实现数据绑定：

```js
var myData = [ 10, 40, 20, 30 ];

var s = d3.selectAll('circle');

s.data(myData);
```

数组可以包含任意类型的元素，比如对象：

```js
var cities = [
  { name: 'London', population: 8674000},
  { name: 'New York', population: 8406000},
  { name: 'Sydney', population: 4293000}
];

var s = d3.selectAll('circle');

s.data(cities);
```

尽管执行`.data`方法后做了不少事，但是你可能注意不到有什么变化。

当你想要根据数据来修改元素时，此时真正的魔法发生了！


## 数据驱动修改元素
> Data-driven modification of elements

一旦将数据绑定到选择集后，我们可以通过给类似`.style`和`.attr`的方法传递一个函数来修改元素（参考[Selections](https://www.d3indepth.com/selections/)）：

```js
d3.selectAll('circle')
  .attr('r', function(d) {
    return d;
  });
```

对于选择集的每个元素D3都会调用这个函数，并传入当前元素绑定的数据作为第一个参数`d`。函数的返回值被用来设置某个样式或属性值

比如给定一下circle元素：

```html
<circle />
<circle />
<circle />
<circle />
<circle />
```

以及一些数据：

```js
var myData = [ 10, 40, 20, 30, 50 ];
```

来实现数据绑定：

```js
var s = d3.selectAll('circle');

// Do the join
s.data(myData);
```

现在我们来将选择集里每个圆的半径修改成对应的数据的值：

```js
s.attr('r', function(d) {
  return d;
});
```

传递给`.attr`方法的函数被调用了5次（选择集的每个元素调用了一次）。第一次`d`的值为10，所以圆的半径被设为10；第二次是40，以此类推。

函数可以返回任意我们想返回的结果，只要结果是当前调用方法（比如`.style`、`.attr`等）的合法值。（很可能会返回包含`d`的表达式。）

比如我们可以将圆的半径设为`d`的两倍：

```js
s.attr('r', function(d) {
  return 2 * d;
});
```

现在给没给值大于等于40的元素设置一个类：

```js
s.classed('high', function(d) {
  return d >= 40; // returns true or false
});
```

最后我们使用参数`i`设置圆的水平位置（参考[Selections](https://www.d3indepth.com/selections/)）：

```js
s.attr('cx', function(d, i) {
  return i * 120;
});
```

合并代如下：

```js
var myData = [ 10, 40, 20, 30, 50 ];

var s = d3.selectAll('circle');

// Do the data join
s.data(myData);

// Modify the selected elements
s.attr('r', function(d) {
  return d;
  })
  .classed('high', function(d) {
    return d >= 40;
  })
  .attr('cx', function(d, i) {
    return i * 120;
  });
```

[示例](https://bl.ocks.org/d3indepth/84111379a0387b2e6fa901babdbd6035)


## 对象数组
> Arrays of objects

我们可以像常用的方式一样绑定对象数组：

```js
var cities = [
  { name: 'London', population: 8674000},
  { name: 'New York', population: 8406000},
  { name: 'Sydney', population: 4293000},
  { name: 'Paris', population: 2244000},
  { name: 'Beijing', population: 11510000}
];

var s = d3.selectAll('circle');

s.data(cities);
```

现在我们根据绑定的数据修改元素时，`d`会是绑定的对象。也就是说对于选择集的第一个元素，`d`的值为`{ name: 'London', population: 8674000}`。

让我们根据每个城市的人口值按一定比例来设置圆的半径：

```js
s.attr('r', function(d) {
    var scaleFactor = 0.000005;
    return d.population * scaleFactor;
  })
  .attr('cx', function(d, i) {
    return i * 120;
  });
```

[示例](https://bl.ocks.org/d3indepth/053a606c7c488cdc0f0eabeaf85ec1dc)

当然，我们不只是可以修改`circle`元素。假设我们有了一些`rect`和`text`元素，那么可以根据所学的东西做一个简单的柱状图：

```js
var cities = [
  { name: 'London', population: 8674000},
  { name: 'New York', population: 8406000},
  { name: 'Sydney', population: 4293000},
  { name: 'Paris', population: 2244000},
  { name: 'Beijing', population: 11510000}
];

// Join cities to rect elements and modify height, width and position
d3.selectAll('rect')
  .data(cities)
  .attr('height', 19)
  .attr('width', function(d) {
    var scaleFactor = 0.00004;
    return d.population * scaleFactor;
  })
  .attr('y', function(d, i) {
    return i * 20;
  })

// Join cities to text elements and modify content and position
d3.selectAll('text')
  .data(cities)
  .attr('y', function(d, i) {
    return i * 20 + 13;
  })
  .attr('x', -4)
  .text(function(d) {
    return d.name;
  });
```

[示例](https://bl.ocks.org/d3indepth/90b992355b91f33db7c23e69cda98b5c)


## 背后的原理
> Under the hood

当D3进行数据绑定时，实际上是给选择集的每个DOM元素添加了一个`__data__`属性，并赋值为将要绑定的数据。

在Chrome浏览器中，通过右击并选择“检查”元素，我们可以看到这个：

这会打开Chrome浏览器的调试窗口。打开`Properties`选项卡，展开元素并展开`__data__`属性，这就是D3绑定到元素上的数据（入截图所示）。

![__data__](https://www.d3indepth.com/img/datajoins/inspect.png)

通过这种方式检查绑定的数据对于调试非常有用，这让我们可以看到数据绑定的结果是不是我们预期的效果。


## 如果数组比选择集更长（或更短）怎么办？
> What if our array’s longer (or shorter) than the selection?

目前为止我们看到的数据绑定示例都是选择集合数据数组一样长的，很显然情况并不会总这么恰好，所以D3提供了`enter`和`exit`方案来处理这种问题。具体参考[enter and exit](https://www.d3indepth.com/enterexit/)部分。


## `.datum`是做什么的？
> What’s .datum for?

少数情况下（比如处理地理可视化时）需要将单个数据绑定到选择集（通常只包含一个元素）。假设有这么个对象：

```js
var featureCollection = {type: 'FeatureCollection', features: features};
```

我们可以使用`.datum`将这个对象绑定到单个元素上：

```js
d3.select('path#my-map')
  .datum(featureCollection);
```

这会在元素上添加一个`__data__`属性并赋值为绑定的数据（这个例子中就是featureCollection`）。可以查看[geographic visualisations](https://www.d3indepth.com/geographic/)部分进行深入了解。

大多数情况下用`.data`来进行数据绑定，`.datum`仅用来处理像上面这样的特殊情况。