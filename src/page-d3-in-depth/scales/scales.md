# 比例尺函数
> Scale functions
>
> 原文：https://www.d3indepth.com/scales/
>
> 作者：Peter Cook

比例尺函数是这样的JavaScript函数：
<!-- Scale functions are JavaScript functions that: -->

- 接受一个输入值（通常是数值、日期或分类）
- 返回一个结果值（比如坐标、颜色、长度或半径）
take an input (usually a number, date or category) and
<!-- return a value (such as a coordinate, a colour, a length or a radius) -->

它们通常被用于将数据值转换（或“映射”）成视觉元素（比如位置、长度和颜色）。
<!-- They’re typically used to transform (or ‘map’) data values into visual variables (such as position, length and colour). -->

举个例子，假设我们有如下数据：
<!-- For example, suppose we have some data: -->

```js
[ 0, 2, 3, 5, 7.5, 9, 10 ]
```

我们可以这样创建一个比例尺函数：
<!-- we can create a scale function using: -->

```js
var myScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, 600]);
```

D3创建了一个`myScale`函数，它接受范围在0~1（**domain**，定义域）之间的输入值，并将这个值映射到在0~600（**range**，值域/输出范围）之前的对应输出值。
<!-- D3 creates a function myScale which accepts input between 0 and 10 (the domain) and maps it to output between 0 and 600 (the range). -->

基于这个数据，我们可以使用`myScale`函数来计算数据对应的位置：
<!-- We can use myScale to calculate positions based on the data: -->

```js
myScale(0);   // returns 0
myScale(2);   // returns 120
myScale(3);   // returns 180
...
myScale(10);  // returns 600
```

[示例](https://bl.ocks.org/d3indepth/2d51279bdad4a553b2005af680108257)

比例尺主要用于将数据转换成视觉元素，如位置、长度和颜色：
<!-- Scales are mainly used for transforming data values to visual variables such as position, length and colour. -->

比如比例尺可以做这些转换：
<!-- For example they can transform: -->

- 对于柱图，将数据值转换成0~500之间的长度
<!-- data values into lengths between 0 and 500 for a bar chart -->
- 对于折线图，将数据值转换成0~200之间的位置
<!-- data values into positions between 0 and 200 for line charts -->
- 将百分比数据（如+4%、+10%、-5%等）转换成连续区间的颜色（用红色表示负值、绿色表示正值）
<!-- % change data (+4%, +10%, -5% etc.) into a continuous range of colours (with red for negative and green for positive) -->
- 将日期转换成用于x轴的位置
<!-- dates into positions along an x-axis. -->

## 创建比例尺
> Constructing scales

（这一节只关注线性比例尺，因为线性比例尺是最常用的。其他类型还在后面讲解。）
<!-- (In this section we’ll just focus on linear scales as these are the most commonly used scale type. We’ll cover other types later on.) -->

我们这样创建线性比例尺：
<!-- To create a linear scale we use: -->

```js
var myScale = d3.scaleLinear();
```

上面的函数还没什么用，我们还要配置输范围（**domain**，定义域）和输出范围（**range**，值域）：
<!-- As it stands the above function isn’t very useful so we can configure the input bounds (the domain) as well as the output bounds (the range): -->

```js
myScale
  .domain([0, 100])
  .range([0, 800]);
```

现在这个`myScale`函数可以接收0~100之间的输入值，并线性映射到0~100的输出范围：
<!-- Now myScale is a function that accepts input between 0 and 100 and linearly maps it to between 0 and 800. -->

```js
myScale(0);    // returns 0
myScale(50);   // returns 400
myScale(100);  // returns 800
```

可以复制代码片段并复制到控制台或者类似 JS Bin 的在线编辑器里测试比例尺函数。
<!-- Try experimenting with scale functions by copying code fragments and pasting them into the console or using a web-based editor such as JS Bin. -->


## D3的比例尺类别
> D3 scale types

D3有大约12种不同的比例尺类别（scaleLinear，scalePow，scaleQuantise，scaleOrdinal等），并且大体上可以分为3大类：
<!-- D3 has around 12 different scale types (scaleLinear, scalePow, scaleQuantise, scaleOrdinal etc.) and broadly speaking they can be classified into 3 groups: -->

- 连续输入、连续输出的比例尺
<!-- scales with continuous input and continuous output -->
- 连续输入、离散输出的比例尺
<!-- scales with continuous input and discrete output -->
- 离散输入、离散输出的比例尺
<!-- scales with discrete input and discrete output -->

我们一个一个来看这3中类型。
<!-- We’ll now look at these 3 categories one by one. -->

## 连续输入、连续输出的比例尺
> Scales with continuous input and continuous output

这一节我们讲将**连续的定义域**映射到**连续的值域**的比例尺函数。
<!-- In this section we cover scale functions that map from a continuous input domain to a continuous output range. -->

### scaleLinear

线性比例尺（linear scales）或许是最常用的比例尺类型，因为它们最适合将数据值住转换成位置和长度。如果只学一种比例尺，那就学这个。
<!-- Linear scales are probably the most commonly used scale type as they are the most suitable scale for transforming data values into positions and lengths. If there’s one scale type to learn about this is the one. -->

线性比例尺使用线性函数（y = m * x + b）来在定义域和值域之间进行插值。
<!-- They use a linear function (y = m * x + b) to interpolate across the domain and range. -->

```js
var linearScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, 600]);

linearScale(0);   // returns 0
linearScale(5);   // returns 300
linearScale(10);  // returns 600
```

常见的用法是将数据值转转成位置和长度，所以适用于创建柱图、折线图（以及很多其他图表类型）。
<!-- Typical uses are to transform data values into positions and lengths, so when creating bar charts, line charts (as well as many other chart types) they are the scale to use. -->

值域也可以是颜色：
<!-- The output range can also be specified as colours: -->

```js
var linearScale = d3.scaleLinear()
  .domain([0, 10])
  .range(['yellow', 'red']);

linearScale(0);   // returns "rgb(255, 255, 0)"
linearScale(5);   // returns "rgb(255, 128, 0)"
linearScale(10);  // returns "rgb(255, 0, 0)"
```

这在类似区域分布地图的图表中很有用，不过也可以考虑`scaleQuantize`、`scaleQuatile`和`scaleThreshold`。
<!-- This can be useful for visualisations such as choropleth maps, but also consider scaleQuantize, scaleQuantile and scaleThreshold. -->

### scalePow

乘方比例尺（power scale）被包含进来更多的是为了比例尺类型完整性，而不是它的实用性，它使用乘方函数（y = m * x^k + b）来进行插值。指数`k`使用`.exponent()`来设置：
<!-- More included for completeness, rather than practical usefulness, the power scale interpolates using a power (y = m * x^k + b) function. The exponent k is set using .exponent(): -->

```js
var powerScale = d3.scalePow()
  .exponent(0.5)
  .domain([0, 100])
  .range([0, 30]);

powerScale(0);   // returns 0
powerScale(50);  // returns 21.21...
powerScale(100); // returns 30
```


### scaleSqrt

开方比例尺是乘方比例尺的一个特例（k=0.5），在用于根据面积（而不是半径）设置圆的大小时很有用。（当使用圆大小来展示数据时，使用面积比例而不是半径比例来展示数据被认为是更好的实践。）
<!-- The scaleSqrt scale is a special case of the power scale (where k = 0.5) and is useful for sizing circles by area (rather than radius). (When using circle size to represent data, it’s considered better practice to set the area, rather than the radius proportionally to the data.) -->

```js
var sqrtScale = d3.scaleSqrt()
  .domain([0, 100])
  .range([0, 30]);

sqrtScale(0);   // returns 0
sqrtScale(50);  // returns 21.21...
sqrtScale(100); // returns 30
```

[示例](https://bl.ocks.org/d3indepth/775cf431e64b6718481c06fc45dc34f9)

### scaleLog

对数比例尺（log scales）使用对数函数（y = m * log(x) + b）来插值，当数据有指数特点（has an exponential nature）时很有用。
<!-- Log scales interpolate using a log function (y = m * log(x) + b) and can be useful when the data has an exponential nature to it. -->

```js
var logScale = d3.scaleLog()
  .domain([10, 100000])
  .range([0, 600]);

logScale(10);     // returns 0
logScale(100);    // returns 150
logScale(1000);   // returns 300
logScale(100000); // returns 600
```

[示例](https://bl.ocks.org/d3indepth/30d31098b607b669a7874bf4ab3c9595)

### scaleTime

时间比例尺和线性比例尺很类似，不过定义域被限制为日期（dates）数组。（处理时间序列数据时**非常**有用。）
<!-- scaleTime is similar to scaleLinear except the domain is expressed as an array of dates. (It’s very useful when dealing with time series data.) -->

```js
timeScale = d3.scaleTime()
  .domain([new Date(2016, 0, 1), new Date(2017, 0, 1)])
  .range([0, 700]);

timeScale(new Date(2016, 0, 1));   // returns 0
timeScale(new Date(2016, 6, 1));   // returns 348.00...
timeScale(new Date(2017, 0, 1));   // returns 700
```

[示例](https://bl.ocks.org/d3indepth/8948c9936c71e63ef2647bc4cc2ebf78)

### scaleSequential

`scaleSequential`被用于根据预设的（或自定义的）**插值器（interpolator）**来映射连续值到一个输出值域。（插值器是指接受0~1之间的输入，并在两个数值、颜色、字符串等之间输出插值的函数。）
<!-- scaleSequential is used for mapping continuous values to an output range determined by a preset (or custom) interpolator. (An interpolator is a function that accepts input between 0 and 1 and outputs an interpolated value between two numbers, colours, strings etc.) -->

D3提供了许多内置插值器，包括许多颜色插值器。比如使用`d3.interpolateRainbow`可以创建著名的🌈插值器：
<!-- D3 provides a number of preset interpolators including many colour ones. For example we can use d3.interpolateRainbow to create the well known rainbow colour scale: -->

```js
var sequentialScale = d3.scaleSequential()
  .domain([0, 100])
  .interpolator(d3.interpolateRainbow);

sequentialScale(0);   // returns 'rgb(110, 64, 170)'
sequentialScale(50);  // returns 'rgb(175, 240, 91)'
sequentialScale(100); // returns 'rgb(110, 64, 170)'
```

[示例](https://bl.ocks.org/d3indepth/de07fcf34538cd6f8459e17038563ed3)

注意，插值器已经决定了值域，所以不需要再声明值域。
<!-- Note that the interpolator determines the output range so you don’t need to specify the range yourself. -->

下面的例子展示了D3提供的其他插值器：
<!-- The example below shows some of the other colour interpolators provided by D3: -->

[示例](https://bl.ocks.org/d3indepth/89ced137bece23b908cf51580d5e082d)

同样还有一个[d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic)插件，它提供了著名的[ColorBrewer](http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3)颜色方案。
<!-- There’s also a plug-in d3-scale-chromatic which provides the well known ColorBrewer colour schemes. -->

### Clamping

默认情况下，`scaleLinear`、`scalePow`、`scaleSqrt`、`scaleLog`、`scaleTime`、`scaleSequential`允许输入值在定义域外，比如：
<!-- By default scaleLinear, scalePow, scaleSqrt, scaleLog, scaleTime and scaleSequential allow input outside the domain. For example: -->

```js
var linearScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, 100]);

linearScale(20);  // returns 200
linearScale(-10); // returns -100
```

在这个例子中，比例尺函数对于定义域外的值进行了外插值（extrapolation）。
<!-- In this instance the scale function uses extrapolation for values outside the domain. -->

如果想要限制输入值在定义域内，我们可以使用`.clamp()`来“夹紧（clamp）”比例尺：
<!-- If we’d like the scale function to be restricted to input values inside the domain we can ‘clamp’ the scale function using .clamp(): -->

```js
linearScale.clamp(true);

linearScale(20);  // returns 100
linearScale(-10); // returns 0
```

也可以使用`.clamp(false)`来关闭clamping。
<!-- We can switch off clamping using .clamp(false). -->

### Nice

如果定义域是根据真实数据自动计算得来的（比如使用`d3.extent`），起始值和结束值可能不是规则数字（round figures）。这不是什么问题，不过当使用这样的比例尺来定义坐标轴时，这回看起来不太好看：
<!-- If the domain has been computed automatically from real data (e.g. by using d3.extent) the start and end values might not be round figures. This isn’t necessarily a problem, but if using the scale to define an axis, it can look a bit untidy: -->

```js
var data = [0.243, 0.584, 0.987, 0.153, 0.433];
var extent = d3.extent(data);

var linearScale = d3.scaleLinear()
  .domain(extent)
  .range([0, 100]);
```

[示例](https://bl.ocks.org/d3indepth/21354e1a7c753624e0a76b7984ae65c1)

所以D3给比例尺函数提供了一个`.nice()`方法，它会将定义域处理成“好看的（nice）”数值范围：
<!-- Therefore D3 provides a function .nice() on the scales in this section which will round the domain to ‘nice’ round values: -->

```js
linearScale.nice();
```

[示例](https://bl.ocks.org/d3indepth/31a6253a01d29e99fa2daf0364b59019)

注意每次定义域更新时都需要重新调用`.nice()`。
<!-- Note that .nice() must be called each time the domain is updated. -->

### 多个分段
> Multiple segments

`scaleLinear`、`scalePow`、`scaleSqrt`、`scaleLog`和`scaleTime`的定义域和值域通常是两个值，但是如果给定3个或更多值，比例尺函数会被细分成多个分段：
<!-- The domain and range of scaleLinear, scalePow, scaleSqrt, scaleLog and scaleTime usually consists of two values, but if we provide 3 or more values the scale function is subdivided into multiple segments: -->

```js
var linearScale = d3.scaleLinear()
  .domain([-10, 0, 10])
  .range(['red', '#ddd', 'blue']);

linearScale(-10);  // returns "rgb(255, 0, 0)"
linearScale(0);    // returns "rgb(221, 221, 221)"
linearScale(5);    // returns "rgb(111, 111, 238)"
```

[示例](https://bl.ocks.org/d3indepth/55f3253d6232f682708a3db0da207e65)

多段用法常被用于区分负值和正值，不过只要定义域和值域长度一致，想用多少分段都可以。
<!-- Typically multiple segments are used for distinguishing between negative and positive values (such as in the example above). We can use as many segments as we like as long as the domain and range are of the same length. -->

### 反向计算
> Inversion

通过`.invert()`方法，我们可以根据给定的**输出（output）**值来得出比例尺的**输入（input）**值（假设比例尺函数是数值定义域）：
<!-- The .invert() method allows us to determine a scale function’s input value given an output value (provided the scale function has a numeric domain): -->

```js
var linearScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, 100]);

linearScale.invert(50);   // returns 5
linearScale.invert(100);  // returns 10
```

一种典型用法是根据用户在坐标轴上的点击位置来计算一个定义域的值。
<!-- A common use case is when we want to convert a user’s click along an axis into a domain value: -->

[示例](https://bl.ocks.org/d3indepth/12af91c5f58bc9eedf96f7c0a9f5622f)


## 连续输入、离散输出的比例尺
> Scales with continuous input and discrete output

### scaleQuantize

`scaleQuantize`接受连续的输入，输出由值域定义的多个离散值。
<!-- scaleQuantize accepts continuous input and outputs a number of discrete quantities defined by the range. -->

```js
var quantizeScale = d3.scaleQuantize()
  .domain([0, 100])
  .range(['lightblue', 'orange', 'lightgreen', 'pink']);

quantizeScale(10);   // returns 'lightblue'
quantizeScale(30);  // returns 'orange'
quantizeScale(90);  // returns 'pink'
```

值域的每个值都被对应到定义域中一个相同大小的块，所以在上面的例子中：
<!-- Each range value is mapped to an equal sized chunk in the domain so in the example above: -->

- 0 <= u < 25 区间对应’lightblue‘
- 25 <= u < 50 区间对应’orange‘
- 50 <= u < 75 区间对应’lightgreen‘
- 75 <= u < 100 区间对应’pink‘
<!-- 0 ≤ u < 25 is mapped to ‘lightblue’
25 ≤ u < 50 is mapped to ‘orange’
50 ≤ u < 75 is mapped to ‘lightgreen’
75 ≤ u < 100 is mapped to ‘pink’ -->

其中`u`表示输入值。
<!-- where u is the input value. -->

[示例](https://bl.ocks.org/d3indepth/d22a326dc44b2d47d9f18815fbccf178)

注意，定义域外的值被收紧（clamped）了，所以在例子中`quantizeScale(-10)`返回’lightblue‘，`quantizeScale(110)`返回’pink‘。
<!-- Note also that input values outside the domain are clamped so in our example quantizeScale(-10) returns ‘lightblue’ and quantizeScale(110) returns ‘pink’. -->

### scaleQuantile

`scaleQuantile`将连续的数字类型的输入值映射为离散值。定义域被定义为**数值数组（an array of numbers）**。
<!-- scaleQuantile maps continuous numeric input to discrete values. The domain is defined by an array of numbers: -->

```js
var myData = [0, 5, 7, 10, 20, 30, 35, 40, 60, 62, 65, 70, 80, 90, 100];

var quantileScale = d3.scaleQuantile()
  .domain(myData)
  .range(['lightblue', 'orange', 'lightgreen']);

quantileScale(0);   // returns 'lightblue'
quantileScale(20);  // returns 'lightblue'
quantileScale(30);  // returns 'orange'
quantileScale(65);  // returns 'lightgreen'
```

[示例](https://bl.ocks.org/d3indepth/28a4d5956b1318b4a007b10c3820f544)


（排序后的）定义域数组被等分成`n`组，其中`n`是值域的值的个数。
<!-- The (sorted) domain array is divided into n equal sized groups where n is the number of range values. -->

因此上面例子的定义域数组被分成如下3组：
<!-- Therefore in the above example the domain array is split into 3 groups where: -->

- 前5个对应’lightblue‘
- 接下来5个对应’orange‘
- 最后5个对应’lightgreen‘

<!-- the first 5 values are mapped to ‘lightblue’
the next 5 values to ‘orange’ and
the last 5 values to ‘lightgreen’. -->

定义域的分隔点可以通过`.quantiles()`来获取：
<!-- The split points of the domain can be accessed using .quantiles(): -->

```js
quantileScale.quantiles();  // returns [26.66..., 63]
```

如果值域包含4个值，`quantileScale`会计算数据的**分割数（quantiles）**。也就是说，数据最小的25%对应`range[0]`，接下来25%对应`range[1]`等。
<!-- If the range contains 4 values quantileScale computes the quartiles of the data. In other words, the lowest 25% of the data is mapped to range[0], the next 25% of the data is mapped to range[1] etc. -->

### scaleThreshold

`scaleThreshold`将连续的数字类型的输入映射到由值域定义的离散值。值域值数量为`n`时，会产生`n-1`个定义域分割点。
<!-- scaleThreshold maps continuous numeric input to discrete values defined by the range. n-1 domain split points are specified where n is the number of range values. -->

在下面例子中我们将定义域在`0`、`50`和`100`这三个点进行划分：
<!-- In the following example we split the domain at 0, 50 and 100 -->

- u < 0 对应‘#ccc’
- 0 <= u <50 对应‘lightblue’
- 50 <= u < 100 对应‘orange’
- u > 100 对应‘#ccc’

<!-- u < 0 is mapped to ‘#ccc’
0 ≤ u < 50 to ‘lightblue’
50 ≤ u < 100 to ‘orange’
u ≥ 100 to ‘#ccc’ -->

其中`u`表示输入值。
<!-- where u is the input value. -->

```js
var thresholdScale = d3.scaleThreshold()
  .domain([0, 50, 100])
  .range(['#ccc', 'lightblue', 'orange', '#ccc']);

thresholdScale(-10);  // returns '#ccc'
thresholdScale(20);   // returns 'lightblue'
thresholdScale(70);   // returns 'orange'
thresholdScale(110);  // returns '#ccc'
```

[示例](https://bl.ocks.org/d3indepth/40fea6694f84dfda46b00ea6ce2cf919)

## 离散输入、离散输出的比例尺
> Scales with discrete input and discrete output

### scaleOrdinal

`scaleOrdinal`将离散的值（通过数组声明）映射到离散的值（也是通过数组声明）。定义域数组声明了可能的输入值，值域数组则是声明输出值。如果值域数组长度比定义域数组短，那么值域数组的值会重复。
<!-- scaleOrdinal maps discrete values (specified by an array) to discrete values (also specified by an array). The domain array specifies the possible input values and the range array the output values. The range array will repeat if it’s shorter than the domain array. -->

```js
var myData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

var ordinalScale = d3.scaleOrdinal()
  .domain(myData)
  .range(['black', '#ccc', '#ccc']);

ordinalScale('Jan');  // returns 'black';
ordinalScale('Feb');  // returns '#ccc';
ordinalScale('Mar');  // returns '#ccc';
ordinalScale('Apr');  // returns 'black';
```

[示例](https://bl.ocks.org/d3indepth/fabe4d1adbf658c0b73c74d3ea36d465)


默认情况下，如果输入的值不在定义域内，这个比例尺会隐式地将这个值添加到定义域。                                                  
<!-- By default if a value that’s not in the domain is used as input, the scale will implicitly add the value to the domain: -->

```js
ordinalScale('Monday');  // returns 'black';
```

如果这不是想要的效果，那么可以使用`.unknown()`为未知的值声明一个输出值。
<!-- If this isn’t the desired behvaiour we can specify an output value for unknown values using .unknown(): -->

```js
ordinalScale.unknown('Not a month');
ordinalScale('Tuesday'); // returns 'Not a month'
```

D3也可以提供内置的颜色方案（来自[ColorBrewer](http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3)）:
<!-- D3 can also provide preset colour schemes (from ColorBrewer): -->

```js
var ordinalScale = d3.scaleOrdinal()
  .domain(myData)
  .range(d3.schemePaired);
```

[示例](https://bl.ocks.org/d3indepth/ab3336867f7469e0f4608b59b8aa125c)

（注意，Brewer颜色方案是通过独立文件`d3-scale-chromatic.js`定义的。）
<!-- (Note that the Brewer colour schemes are defined within a separate file d3-scale-chromatic.js.) -->

### scaleBand

创建柱状图时，`scaleBand`有助于确定柱子的集合属性，它能将每个柱子之间的间距纳入计算范围。定义域需要声明为数据值（每个值对应一个区块(band)）的数组，值域为所有区块的最小和最大值范围（比如柱图的总宽度）。
<!-- When creating bar charts scaleBand helps to determine the geometry of the bars, taking into account padding between each bar. The domain is specified as an array of values (one value for each band) and the range as the minimum and maximum extents of the bands (e.g. the total width of the bar chart). -->

`scaleBand`会将值域划分成`n`块（`n`是定义域数组的元素个数），并计算出每一块的位置和宽度，计算时会考虑所声明的边距。
<!-- In effect scaleBand will split the range into n bands (where n is the number of values in the domain array) and compute the positions and widths of the bands taking into account any specified padding. -->

```js
var bandScale = d3.scaleBand()
  .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
  .range([0, 200]);

bandScale('Mon'); // returns 0
bandScale('Tue'); // returns 40
bandScale('Fri'); // returns 160
```

可以使用`.bandwidth()`获取每一块的宽度：
<!-- The width of each band can be accessed using .bandwidth(): -->

```js
bandScale.bandwidth();  // returns 40
```

可以配置两种类型的边距：
<!-- Two types of padding may be configured: -->

- `paddingInner` 内边距，指每一块（band）之间的间距（值是相对bandwidth的占比）
- `paddingOuter` 外边距，指第一块之前和最后一块之后的边距（值是相对bandwidth的占比）
<!-- paddingInner which specifies (as a percentage of the band width) the amount of padding between each band
paddingOuter which specifies (as a percentage of the band width) the amount of padding before the first band and after the last band -->

给上面的例子加点内边距：
<!-- Let’s add some inner padding to the example above: -->

```js
bandScale.paddingInner(0.05);

bandScale.bandWidth();  // returns 38.38...
bandScale('Mon');       // returns 0
bandScale('Tue');       // returns 40.40...
```

将这些一起使用就可以创建一个柱状图：
<!-- Putting this all together we can create this bar chart: -->

[示例](https://bl.ocks.org/d3indepth/1aef77d17863e603ff4e84226db5b227)


### scalePoint

`scalePoint`将一些列离散值映射成给定值域范围内的等间距点（equally spaced points）：
<!-- scalePoint creates scale functions that map from a discrete set of values to equally spaced points along the specified range: -->

```js
var pointScale = d3.scalePoint()
  .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
  .range([0, 500]);

pointScale('Mon');  // returns 0
pointScale('Tue');  // returns 125
pointScale('Fri');  // returns 500
```

[示例](https://bl.ocks.org/d3indepth/4ed842af47f23eeb5cf1755d4bb67073)

使用`.step()`可以获取点之间的距离：
<!-- The distance between the points can be accessed using .step(): -->

```js
pointScale.step();  // returns 125
```

外边距可以被设置为相对于点间距的占比值。比如将外边距的值设为点间距的1/4，可以将值设为0.25：
<!-- Outside padding can be specified as the ratio of the padding to point spacing. For example, for the outside padding to be a quarter of the point spacing use a value of 0.25: -->

```js
pointScale.padding(0.25);

pointScale('Mon');  // returns 27.77...
pointScale.step();  // returns 111.11...
```

### 深入阅读
> Further reading
[ColorBrewer schemes for D3](https://github.com/d3/d3-scale-chromatic)

[Mike Bostock on d3-scale](https://medium.com/@mbostock/introducing-d3-scale-61980c51545f#.lk2cs7x7k)