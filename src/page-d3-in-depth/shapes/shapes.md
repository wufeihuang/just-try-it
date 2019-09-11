# 图形
> Shapes
>
> 原文：https://www.d3indepth.com/shapes/
>
> 作者：Peter Cook

这一章关注D3提供的创建矢量图形的功能，比如折线：
<!-- This chapter looks at the functions D3 provides for taking the effort out of creating vector shapes such as lines: -->

[折线示例]()

曲线：
<!-- curves: -->

[曲线示例]()

饼图：
<!-- pie chart segments: -->

[饼图示例]()

任意图形符号（symbols）:
<!-- and symbols: -->

[符号示例]()


## SVG

先讲讲SVG（Scalable Vector Graphics，可缩放矢量图形）的背景。上面例子中用到的图形都是SVG `path`元素。每个`path`元素都有一个`d`属性用于定义其形状。path路径数据由一系列命令（如：`M0,80L100,100L200,30L300,50L400,40L500,80`）组成，比如`move to`（移动至）和`draw a line to`（画线至）（更多细节查看[SVG规范](https://www.w3.org/TR/SVG/paths.html)）
<!-- First a little background on Scalable Vector Graphics (SVG). The shapes in the examples above are made up of SVG path elements. Each of them has a d attribute (path data) which defines the shape of the path. The path data consists of a list of commands (e.g. M0,80L100,100L200,30L300,50L400,40L500,80) such as ‘move to’ and ‘draw a line to’ (see the SVG specification for more detail). -->

我们可以手动创建path数据，但是D3提供了被称作生成器（generators）的函数来帮我们做这件事，这些函数有以下形式：
<!-- We could create path data ourselves but D3 can help us using functions known as generators. These come in various forms: -->

| | |
| :--- | :--- |
| line	| 生成折线的path数据（常用于折线图） |
<!-- | line	| Generates path data for a multi-segment line (typically for line charts) | -->
| area | 生成面积区域的path数据 |
<!-- | area | Generates path data for an area (typically for stacked line charts and streamgraphs) | -->
| stack |	根据多系列数据创建堆叠面积区域的path数据 （常用于堆叠面积图和河流图）|
<!-- | stack |	Generates stack data from multi-series data | -->
| arc |	生成弧形的path数据（常用于饼图） |
<!-- | arc |	Generates path data for an arc (typically for pie charts) | -->
| pie |	根据数组数据生成饼图的角度数据 |
<!-- | pie |	Generates pie angle data from array of data | -->
| symbol | 生成符号图形的path数据，比如加号、星星、钻石 |
<!-- | symbol |	Generates path data for symbols such as plus, star, diamond | -->
|


## 线段生成器
> Line generator

给定**坐标数组**，D3的线段生成器会生成路径数据字符串（path data string）。
<!-- D3’s line generator produces a path data string given an array of co-ordinates. -->

我们使用`d3.line()`来创建一个线段生成器：
<!-- We start by constructing a line generator using d3.line(): -->

```js
var lineGenerator = d3.line();
```

`lineGenerator`只是一个接收一个做标数组参数，然后返回一个路径数据字符串的函数。
<!-- lineGenerator is just a function that accepts an array of co-ordinates and outputs a path data string. -->

所以下一步定义一个坐标数组：
<!-- So let’s go ahead and define an array of co-ordinates: -->

```js
var points = [
  [0, 80],
  [100, 100],
  [200, 30],
  [300, 50],
  [400, 40],
  [500, 80]
];
```

现在调用`lineGenerator`，以上面的数组为参数：
<!-- and now call lineGenerator, passing in our array: -->

```js
var pathData = lineGenerator(points);
// pathData is "M0,80L100,100L200,30L300,50L400,40L500,80"
```

`lineGenerator`做的仅仅是根据给定的`points`数组创建一个由`M`（move to）和`L`（line to）命令组成的字符串。现在可以将`pathData`设置为一个`path`元素的`d`属性：
<!-- All lineGenerator has done is create a string of M (move to) and L (line to) commands from our array of points. We can now use pathData to set the d attribute of a path element: -->

```js
d3.select('path')
  .attr('d', pathData);
```

[示例](https://bl.ocks.org/d3indepth/dd0e2e52b32f5c646b75acdfcb46864e)

也可以通过以下方法来配置线段生成器：
<!-- We can also configure our line generator in a number of ways: -->

- `.x()`和`.y()`访问器函数
- `.defined()`，处理空数据
- `.curve()`，声明点如何插值，实现曲线
- `.context()`，使用canvas元素渲染
<!-- 
.x() and .y() accessor functions,
.defined() (to handle missing data),
.curve (to specify how the points are interpolated) and
.context() to render to a canvas element.
-->

### `.x()`和`.y()`访问器
.x() and .y() accessor functions 

默认情况下每个数组元素应该是一个二维数组（如：[0, 100]）来表示坐标。但是我们通过`.x()`和`.y()`访问器函数来告诉线段生成器怎么处理每个数组元素。
<!-- By default each array element represents a co-ordinate defined by a 2-dimensional array (e.g. [0, 100]). However we can specify how the line generator interprets each array element using accessor functions .x() and .y(). -->

比如给定如下数据：
<!-- For example suppose our data is an array of objects: -->

```js
var data = [
  {value: 10},
  {value: 50},
  {value: 30},
  {value: 40},
  {value: 20},
  {value: 70},
  {value: 50}
];
```

可以这么定义访问器：
<!-- We can define the accessors like so: -->

```js
lineGenerator
  .x(function(d, i) {
    return xScale(i);
  })
  .y(function(d) {
    return yScale(d.value);
  });
```

这个例子中我们使用数组的索引俩定义x位置，另外注意我们使用了比例尺函数：
<!-- In this example we’re using the index of the array to define the x position. Note also that we’re using scale functions: -->

[示例](https://bl.ocks.org/d3indepth/5df095dd1604b08541ac6bd62adce3a0)


### .defined()

使用`.defined()`来配置处理空数据的行为。假设数据如下：
<!-- We can configure the behaviour when there’s missing data. Suppose our data has a gap in it: -->

```js
var points = [
  [0, 80],
  [100, 100],
  null,
  [300, 50],
  [400, 40],
  [500, 80]
];
```

我们可以告诉只有非空（non-null）的数据才是有效的坐标：
<!-- we can tell our line generator that each co-ordinate is valid only if it’s non-null: -->

```js
lineGenerator
  .defined(function(d) {
    return d !== null;
  });
```

现在调用`lineGenerator`会生成有间断的折线：
<!-- Now when we call lineGenerator it leaves a gap in the line: -->

[示例](https://bl.ocks.org/d3indepth/93903fe3ff9d31b7bbdd3f6b443aa8f6)

（如果没有配置`.defined`，这最终会报错。）
<!-- (Without configuring .defined this last call returns an error.) -->


### .curve()

也可以配置点的插值方式。比如使用**B-spline**的插值方式：
<!-- We can also configure how the points are interpolated. For example we can interpolate each data point with a B-spline: -->

```js
var lineGenerator = d3.line()
  .curve(d3.curveCardinal);
```

[示例](https://bl.ocks.org/d3indepth/64be9fc39a92ef074034e9a8fb29dcce)

尽管有很多种不同的弯曲（curve）方式，但都可以分成两类：经过点的（`curveLinear`、`curveCardinal`、`curveCatmullRom`、`curveMonotone`、`curveNatural`和`curveStep`）和不经过点的（`curveBasis`和`curveBundle`）。
<!-- Although there’s a multitude of different curve types available they can be divided into two camps: those which pass through the points (curveLinear, curveCardinal, curveCatmullRom, curveMonotone, curveNatural and curveStep) and those that don’t (curveBasis and curveBundle). -->

可以看这个[curve explorer]示例以了解更多。
<!-- See the curve explorer for more information. -->

### 使用canvas渲染
> Rendering to canvas

形状生成器默认生成SVG路径数据，但是可以使用`.context()`来配置使用canvas绘制：
<!-- By default the shape generators output SVG path data. However they can be configured to draw to a canvas element using the .context() function: -->

```js
var context = d3.select('canvas').node().getContext('2d');

lineGenerator.context(context);

context.strokeStyle = '#999';
context.beginPath();
lineGenerator(points);
context.stroke();
```

[示例](https://bl.ocks.org/d3indepth/90851f3bd602f17a7f32691819e2ed2e)


### 径向线段
> Radial line

径向线段生成器类似于线段生成器，但是点是基于**角度**（angle，基于12点钟的顺时针）和**半径**（radius），而不是`x`和`y`：
<!-- The radial line generator is similar to the line generator but the points are transformed by angle (working clockwise from 12 o’clock) and radius, rather than x and y: -->

```js
var radialLineGenerator = d3.radialLine();

var points = [
  [0, 80],
  [Math.PI * 0.25, 80],
  [Math.PI * 0.5, 30],
  [Math.PI * 0.75, 80],
  [Math.PI, 80],
  [Math.PI * 1.25, 80],
  [Math.PI * 1.5, 80],
  [Math.PI * 1.75, 80],
  [Math.PI * 2, 80]
];

var pathData = radialLineGenerator(points);
```

[示例](https://bl.ocks.org/d3indepth/39d798286a4bf92cee446add65290d70)

也可以使用`.angle()`和`.radius()`访问器进行配置：
<!-- Accessor functions .angle() and .radius() are also available: -->

```js
radialLineGenerator
  .angle(function(d) {
    return d.a;
  })
  .radius(function(d) {
    return d.r;
  });

var points = [
  {a: 0, r: 80},
  {a: Math.PI * 0.25, r: 80},
  {a: Math.PI * 0.5, r: 30},
  {a: Math.PI * 0.75, r: 80},
  ...
];

var pathData = radialLineGenerator(points);
```

## 区域生成器
> Area generator

面积生成器生成位于两条线段之间的面积区域的路径数据。默认情况下生成的是直线`y=0`和另一条由点数组定义的线段之间的面积区域：
<!-- The area generator outputs path data that defines an area between two lines. By default it generates the area between y=0 and a multi-segment line defined by an array of points: -->

```js
var areaGenerator = d3.area();

var points = [
  [0, 80],
  [100, 100],
  [200, 30],
  [300, 50],
  [400, 40],
  [500, 80]
];

var pathData = areaGenerator(points);
```

[示例](https://bl.ocks.org/d3indepth/a87bb6104d85931611e2ec9bacf5ea3a)

通过`.y0()`访问器来配置基线：
<!-- We can configure the baseline using the .y0() accessor function: -->

```js
areaGenerator.y0(150);
```

[示例](https://bl.ocks.org/d3indepth/1b232d99622717cc02794ffb3ff66ee8)

也可以传入一个函数给`.y0()`访问器，`.y1()`访问器也是：
<!-- We can also feed a function into the .y0() accessor, likewise the .y1() accessor: -->

```js
areaGenerator
  .x(function(d) {
    return d.x;
  })
  .y0(function(d) {
    return yScale(d.low);
  })
  .y1(function(d) {
    return yScale(d.high);
  });

var points = [
  {x: 0, low: 30, high: 80},
  {x: 100, low: 80, high: 100},
  {x: 200, low: 20, high: 30},
  {x: 300, low: 20, high: 50},
  {x: 400, low: 10, high: 40},
  {x: 500, low: 50, high: 80}
];
```

通常`.y0()`定义基线，`.y1()`定义顶部的线。注意我们还是用了`.x()`定义x坐标。
<!-- Typically .y0() defines the baseline and .y1() the top line. Note that we’ve also used the .x() accessor to define the x co-ordinate. -->

[示例](https://bl.ocks.org/d3indepth/f238d652d30f3fa2b8deda39e1a1eee4)

和线段生成器一样，我们可以定义点的插值方式（是用`.curve()`），处理空数据（`.defined()`）以及渲染到canvas（`.context()`）。
<!-- As with the line generator we can specify the way in which the points are interpolated (.curve()), handle missing data (.defined()) and render to canvas (.context()); -->

### 径向区域
> Radial area

径向区域生成器类似于区域生成器，但是点是基于**角度**（angle，基于12点钟的顺时针）和**半径**（radius），而不是`x`和`y`：
<!-- The radial area generator is similar to the area generator but the points are transformed by angle (working clockwise from 12 o’clock) and radius, rather than x and y: -->

```js
var radialAreaGenerator = d3.radialArea()
  .angle(function(d) {
    return d.angle;
  })
  .innerRadius(function(d) {
    return d.r0;
  })
  .outerRadius(function(d) {
    return d.r1;
  });

var points = [
  {angle: 0, r0: 30, r1: 80},
  {angle: Math.PI * 0.25, r0: 30, r1: 70},
  {angle: Math.PI * 0.5, r0: 30, r1: 80},
  {angle: Math.PI * 0.75, r0: 30, r1: 70},
  {angle: Math.PI, r0: 30, r1: 80},
  {angle: Math.PI * 1.25, r0: 30, r1: 70},
  {angle: Math.PI * 1.5, r0: 30, r1: 80},
  {angle: Math.PI * 1.75, r0: 30, r1: 70},
  {angle: Math.PI * 2, r0: 30, r1: 80}
];
```

[示例](https://bl.ocks.org/d3indepth/7bb7f2e389d0bf2ff1a622c4c7833a80)


## 堆叠生成器
> Stack generator

堆叠生成器接受一个**多系列数据**（multi-series data）的数组，并为每个数据系列生成一个数组，这个数组的每个数据点都包含了**低值和高值**（lower and upper values）。因为计算了低值和高值，所以每个系列的数据都堆叠在上个系列数据之上。
<!-- The stack generator takes an array of multi-series data and generates an array for each series where each array contains lower and upper values for each data point. The lower and upper values are computed so that each series is stacked on top of the previous series. -->

```js
var data = [
  {day: 'Mon', apricots: 120, blueberries: 180, cherries: 100},
  {day: 'Tue', apricots: 60,  blueberries: 185, cherries: 105},
  {day: 'Wed', apricots: 100, blueberries: 215, cherries: 110},
  {day: 'Thu', apricots: 80,  blueberries: 230, cherries: 105},
  {day: 'Fri', apricots: 120, blueberries: 240, cherries: 105}
];

var stack = d3.stack()
  .keys(['apricots', 'blueberries', 'cherries']);

var stackedSeries = stack(data);

// stackedSeries = [
//   [ [0, 120],   [0, 60],   [0, 100],    [0, 80],    [0, 120] ],   // Apricots
//   [ [120, 300], [60, 245], [100, 315],  [80, 310],  [120, 360] ], // Blueberries
//   [ [300, 400], [245, 350], [315, 425], [310, 415], [360, 465] ]  // Cherries
// ]
```

`.keys()`决定了哪些数据在生成堆叠数据时要被包含。
<!-- The .keys() configuration function specifies which series are included in the stack generation. -->

堆叠生成器生成的数据你怎么用都可以，不过经常被用来创建堆叠柱状图（stacked bar charts）：
<!-- The data output by the stack generator can be used however you like, but typically it’ll be used to produce stacked bar charts: -->

[示例](https://bl.ocks.org/d3indepth/30a7091e97b03eeba2a6a3ca1067ca92)

或者和区域生成器结合使用，创建堆叠面积图（stacked line charts）：
<!-- or when used in conjunction with the area generator, stacked line charts: -->

[示例](https://bl.ocks.org/d3indepth/e4efd402b4d9fdb2088ccdf3135745c3)


### .order()

堆叠系列的顺序可以用`.order()`来配置：
<!-- The order of the stacked series can be configured using .order(): -->

```js
stack.order(d3.stackOrderInsideOut);
```

每个系列数据被求总后根据给定的排序方式进行排序，可能的排序方式有：
<!-- Each series is summed and then sorted according to the chosen order. The possible orders are: -->

| | |
| :--- | :--- |
| stackOrderNone	| （默认）和`.keys()`中的顺序一样 | 
| stackOrderAscending	| 总和最小的系列在最下面 |
| stackOrderDescending	| 总和最大的系列在最下面 | 
| stackOrderInsideOut	| 总和最大的系列在中间 | 
| stackOrderReverse	| stackOrderNone的反序 |
| 
<!-- stackOrderNone	(Default) Series in same order as specified in .keys()
stackOrderAscending	Smallest series at the bottom
stackOrderDescending	Largest series at the bottom
stackOrderInsideOut	Largest series in the middle
stackOrderReverse	Reverse of stackOrderNone -->


### .offset()

默认情况下堆叠生成器的基线是0（a baseline of zero）。但是我们可以配置堆叠生成器的偏移（offset）来实现不同的效果。比如我们可以标准化（normalise）堆叠的数据系列以使它们填充相同的高度：
<!-- By default the stacked series have a baseline of zero. However we can configure the offset of the stack generator to achieve different effects. For example we can normalise the stacked series so that they fill the same height: -->

```js
stack.offset(d3.stackOffsetExpand);
```

[示例](https://bl.ocks.org/d3indepth/aef57694ac8f711ab2e8a5c96a349ea1)

有如下偏移方式：
<!-- The available offsets are: -->

| | |
| :--- | :--- |
| stackOffsetNone	| （默认）无偏移 |
| stackOffsetExpand	| 系列的和被统一（为1） |
| stackOffsetSilhouette	| 堆叠的中心线在y=0 |
| stackOffsetWiggle	| 层的摆动最小（Wiggle of layers is minimised）（常用于河流图streamgraphs） |
|
<!-- stackOffsetNone	(Default) No offset
stackOffsetExpand	Sum of series is normalised (to a value of 1)
stackOffsetSilhouette	Center of stacks is at y=0
stackOffsetWiggle	Wiggle of layers is minimised (typically used for streamgraphs) -->

如下是一个使用`stackOffsetWiggle`的河流图示例：
<!-- Here’s a streamgraph example using stackOffsetWiggle: -->

[示例](https://bl.ocks.org/d3indepth/3c7cb147aab8cf0cdbfb83b4ee7a847c)


## 弧线生成器
> Arc generator

弧线生成器根据值为角度和半径的数据生成路径数据。通过如下方式创建弧线生成器：
<!-- Arc generators produce path data from angle and radius values. An arc generator is created using: -->

```js
var arcGenerator = d3.arc();
```

然后传入一个包含`startAngle`、`endAngle`、`innerRadius`和``outerRadius`属性的对象作为参数，就可以生成路径数据：
<!-- It can then be passed an object containing startAngle, endAngle, innerRadius and outerRadius properties to produce the path data: -->

```js
var pathData = arcGenerator({
  startAngle: 0,
  endAngle: 0.25 * Math.PI,
  innerRadius: 50,
  outerRadius: 100
});

// pathData is "M6.123233995736766e-15,-100A100,100,0,0,1,70.71067811865476,-70.710678
// 11865474L35.35533905932738,-35.35533905932737A50,50,0,0,0,3.061616997868383e-15,-50Z"
```

（`startAngle`和`endAngle`使用12小时钟表的顺时针方式，并且是基于弧度制。）
<!-- (startAngle and endAngle are measured clockwise from the 12 o’clock in radians.) -->

[示例](https://bl.ocks.org/d3indepth/3bb2dc908c090e8d2405257caadb20fa)


### 配置
> Configuration

可以配置`innerRadius`、`outerRadius`、`startAngle`和`endAngle`，这样就不用每次都传入：
<!-- We can configure innerRadius, outerRadius, startAngle, endAngle so that we don’t have to pass them in each time: -->

```js
arcGenerator
  .innerRadius(20)
  .outerRadius(100);

pathData = arcGenerator({
  startAngle: 0,
  endAngle: 0.25 * Math.PI
});

// pathData is "M6.123233995736766e-15,-100A100,100,0,0,1,70.71067811865476,-70.71067811
// 865474L14.142135623730951,-14.14213562373095A20,20,0,0,0,1.2246467991473533e-15,-20Z"
```

[示例](https://bl.ocks.org/d3indepth/b52f9ab1dde3a1953367395d10483be4)

还可以配置圆角半径（`cornerRadius`）和扇形之间的间距（`padAngle`和`padRadius`）：
<!-- We can also configure corner radius (cornerRadius) and the padding between arc segments (padAngle and padRadius): -->

```js
arcGenerator
  .padAngle(.02)
  .padRadius(100)
  .cornerRadius(4);
```

[示例](https://bl.ocks.org/d3indepth/ef3c33c21668db4217bf538cff522d5b)

弧形边距接受`padAngle`和`padRadius`两个参数，以它们的乘积来决定相邻扇形之间的距离。因此上述例子中，边距为`0.02 * 100 = 2`。注意计算边距时会（尽可能）保持相邻扇形之间的边界平行。
<!-- Arc padding takes two parameters padAngle and padRadius which when multiplied together define the distance between adjacent segments. Thus in the example above, the padding distance is 0.02 * 100 = 2. Note that the padding is calculated to maintain (where possible) parallel segment boundaries. -->

你可能会疑惑为什么不只用一个参数 padDistance来定义边距——拆分成两个参数的好处在于这样一来饼图生成器（pie generator，后面会讲）就不用关心半径。
<!-- You might ask why there isn't a single parameter padDistance for defining the padding distance. It's split into two parameters so that the pie generator (see later) doesn't need to concern itself with radius. -->

### 访问器函数
> Accessor functions

我们也可以定义`startAngle`、`endAngle`、`innerRadius`和`outerRadius`等访问器，如：
<!-- We also define accessor functions for startAngle, endAngle, innerRadius and outerRadius e.g. -->

```js
arcGenerator
  .startAngle(function(d) {
    return d.startAngleOfMyArc;
  })
  .endAngle(function(d) {
    return d.endAngleOfMyArc;
  });

arcGenerator({
  startAngleOfMyArc: 0,
  endAngleOfMyArc: 0.25 * Math.PI
});
```

[示例](https://bl.ocks.org/d3indepth/3d912bbaaebcf01a05b75d088a1c9976)

### 中心点
> Centroid

有时候需要计算弧形的中心点，比如定位标签文本，D3提供了一个`.centroid()`方法来做计算：
<!-- It’s sometimes useful to calculate the centroid of an arc, such as when positioning labels, and D3 has a function .centroid() for doing this: -->

```js
arcGenerator.centroid({
  startAngle: 0,
  endAngle: 0.25 * Math.PI
});
// returns [22.96100594190539, -55.43277195067721]
```

以下是一个使用`.centroid()`计算标签文本位置的例子：
<!-- Here’s an example where .centroid() is used to compute the label positions: -->

[示例](https://bl.ocks.org/d3indepth/c9fd848b9410cc543a437b34c266ac64)


## 饼图生成器
> Pie generator

饼图生成器和弧形生成器总是一起使用。给定一个数组数据，饼图生成器会生成一个对象数组，每个对象元素包含原始数据以及添加了**起始**和**结束**角度：
<!-- The pie generator goes hand in hand with the arc generator. Given an array of data, the pie generator will output an array of objects containing the original data augmented by start and end angles: -->

```js
var pieGenerator = d3.pie();
var data = [10, 40, 30, 20, 60, 80];
var arcData = pieGenerator(data);

// arcData is an array of objects: [
//   {
//     data: 10,
//     endAngle: 6.28...,
//     index: 5,
//     padAngle: 0,
//     startAngle: 6.02...,
//     value: 10
//   },
//   ...
// ]
```

使用弧形生成器来创建路径字符串：
<!-- We can then use an arc generator to create the path strings: -->

```js
var arcGenerator = d3.arc()
  .innerRadius(20)
  .outerRadius(100);

d3.select('g')
  .selectAll('path')
  .data(arcData)
  .enter()
  .append('path')
  .attr('d', arcGenerator);
```

注意`pieGenerator`的输出结果包含了`startAngle`和`endAngle`属性，这和`arcGenerator`需要的属性一样。
<!-- Notice that the output of pieGenerator contains the properties startAngle and endAngle. These are the same properties required by arcGenerator. -->

[示例](https://bl.ocks.org/d3indepth/25efacedfc463eead5e77fb336a90caa)

饼图生产器包含许多配置项，包括`.padAngle`、`.startAngle()`、`.endAngle()`和`.sort()`。`.padAngle()`声明了相邻扇形之间的角度边距（基于弧度）。
<!-- The pie generator has a number of configuration functions including .padAngle(), .startAngle(), .endAngle() and .sort(). .padAngle() specifies an angular padding (in radians) between neighbouring segments. -->

`.startAngle()`和`.endAngle()`定义了饼图的起始和结束角度。这使得可以创建类似如下半圆饼图示例的饼图：
<!-- .startAngle() and .endAngle() configure the start and end angle of the pie chart. This allows, for example, the creation of semi-circular pie charts: -->

```js
var pieGenerator = d3.pie()
  .startAngle(-0.5 * Math.PI)
  .endAngle(0.5 * Math.PI);
```

[示例](https://bl.ocks.org/d3indepth/5cc68ffe573562772bed1e394b50f7dc)

默认情况下扇形会按角度大小降序排序，但是可以使用`.sort`改变排序方式：
<!-- By default the segment start and end angles are specified such that the segments are in descending order. However we can change the sort order using .sort: -->

```js
var pieGenerator = d3.pie()
  .value(function(d) {return d.quantity;})
  .sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

var fruits = [
  {name: 'Apples', quantity: 20},
  {name: 'Bananas', quantity: 40},
  {name: 'Cherries', quantity: 50},
  {name: 'Damsons', quantity: 10},
  {name: 'Elderberries', quantity: 30},
];
```

[示例](https://bl.ocks.org/d3indepth/62b1c3bbe89a48f986e334a971e4825f)


## Symbols

符号生成器生成在数据可视化中常用符号的路径数据。
<!-- The symbol generator produces path data for symbols commonly used in data visualisation: -->

```js
var symbolGenerator = d3.symbol()
  .type(d3.symbolStar)
  .size(80);

var pathData = symbolGenerator();
```

然后可以将`pathData`设为`path`元素的`d`属性的值：
<!-- We can then use pathData to define the d attribute of a path element: -->

```js
d3.select('path')
  .attr('d', pathData);
```

如下是一个使用符号生成器的简单图表：
<!-- Here’s a simple chart using the symbol generator: -->

[示例](https://bl.ocks.org/d3indepth/a1fea300b04eaee5abbf58236fe01705)

D3内置了很多符号类型：
<!-- D3 provides a number of symbol types: -->

[示例](https://bl.ocks.org/d3indepth/bae221df69af953fb06351e1391e89a0)

