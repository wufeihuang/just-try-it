import DemoBar from './bar';
import {DemoLine, DemoLineCurve} from './lines'
import {DemoAxis1, DemoAxis2} from './axes'
import DemoTree from './tree'
import DemoPack from './pack'
import DemoTreemap from './treemap'
import DemoVoronoi from './voronoi'
import DemoTransition from './transition'

# D3介绍
> Introduction to D3
>
> 原文：https://www.d3indepth.com/introduction/
>
> 作者：Peter Cook

D3是一个用来在web上开发定制化、可交互图表和地图的JavaScript库。

大多数图表库（比如Chart.js和Highcharts）提供的是现成的图表，而D3则是由大量的组件（积木）组成，因此可以开发自定义图表或地图。

D3的实现机制比其他图表库更底层。用Chart.js创建一个柱图只要几行，而用D3创建一个相同的图表，你得做更多工作：

- 添加SVG的rect元素并将数据绑定到元素
- 设置rect元素的位置
- 根据数据设置rect元素的大小
- 添加坐标轴

可能你还想做些别的：

- 图表首次加载时为柱子添加动画
- 调整图表以适应容器的尺寸
- 添加提示框

用D3要多花一些额外的功夫，但是这让你可以完全控制图表的样式和行为。

如果标准的柱图、折线图或饼图等就能满足你的需求，那么你应该考虑使用Chart.js这样的库。如果你想实现特定需求的定制化图表，那就值得使用D3。

D3的功能包括：

- 基于数据驱动更新HTML/SVG元素
- 加载和转换数据（比如CSV格式数据）
- 复杂图表的生成器，比如矩形树图（treemaps）、打包图（packed circles）和网络关系图（networks）
- 强大的过渡动画系统
- 强力的用户交互支持，包括平移、缩放和拖拽


## 基于数据驱动更新HTML/SVG元素

> Data-driven modification of HTML/SVG elements

给定一个如下的对象数组：
```json
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

使用D3我们可以：

- 根据数组长度添加/移除 `div` 元素
- 给每个`div`元素添加标签文本和矩形柱子
- 根据分数（score）更新柱子的长度

<DemoBar />

> [源码](https://bl.ocks.org/d3indepth/e890d5ad36af3d949f275e35b41a99d6)

<br/>

## 数据转换
> Data Transformation

D3提供了很多转换数据的函数，比如提供了请求CSV（逗号分隔值）数据并转换成一个对象数组的函数。

假设你的服务器上有这样一份叫做films.csv的CSV文件：
```csv
Film,Genre,Lead Studio,Audience score %,Worldwide Gross,Year
27 Dresses,Comedy,Fox,71,160.308654,2008
(500) Days of Summer,Comedy,Fox,81,60.72,2009
A Dangerous Method,Drama,Independent,89,8.972895,2011
A Serious Man,Drama,Universal,64,30.68,2009
Across the Universe,Romance,Independent,84,29.367143,2007
Beginners,Comedy,Independent,80,14.31,2011
```

你可以这样请求该文件：
```js
d3.csv('films.csv', d => {
  // 可选的遍历函数，遍历每一个元素
  // 可以做格式化、筛选、重新赋值、增减属性等操作
  // 最后要返回一个对象
  return d
}).then(data => {
  // Data是完整的数据
}).catch(e => {
  // 如果报错
})
```

D3会将这个CSV数据转换成一个对象数组：
```js
[
  {
    "Film": "27 Dresses",
    "Genre": "Comedy",
    "Lead Studio": "Fox",
    "Audience score %": "71",
    "Worldwide Gross": "160.308654",
    "Year": "2008"
  },
  {
    "Film": "(500) Days of Summer",
    "Genre": "Comedy",
    "Lead Studio": "Fox",
    "Audience score %": "81",
    "Worldwide Gross": "60.72",
    "Year": "2009"
  },
  {
    "Film": "A Dangerous Method",
    "Genre": "Drama",
    "Lead Studio": "Independent",
    "Audience score %": "89",
    "Worldwide Gross": "8.972895",
    "Year": "2011"
  },
  {
    "Film": "A Serious Man",
    "Genre": "Drama",
    "Lead Studio": "Universal",
    "Audience score %": "64",
    "Worldwide Gross": "30.68",
    "Year": "2009"
  },
  {
    "Film": "Across the Universe",
    "Genre": "Romance",
    "Lead Studio": "Independent",
    "Audience score %": "84",
    "Worldwide Gross": "29.367143",
    "Year": "2007"
  },
  {
    "Film": "Beginners",
    "Genre": "Comedy",
    "Lead Studio": "Independent",
    "Audience score %": "80",
    "Worldwide Gross": "14.31",
    "Year": "2011"
  }
]
```

要注意的是D3使用了CSV的列名（Film, Genre, Lead Studio等）作为每个对象的属性名。

## 形状生成
> Shape generation

D3最出名的功能大概是生成可交互的数据可视化作品了。这些通常是使用SVG（Scalable Vector Graphic，可缩放矢量图形）元素做的，比如`line`、`circle`、`path`、`text`。

假设你有这么一组坐标：
```js
var data = [[0, 50], [100, 80], [200, 40], [300, 60], [400, 30]];
```

将它们用线连起来，通过D3可以生成如下SVG：

<DemoLine />

> [源码](https://bl.ocks.org/d3indepth/e312c205b6b07757551bffafb265589b)

<br/>

你可以选择使用曲线插值的能力：

<DemoLineCurve />

> [源码](https://bl.ocks.org/d3indepth/2bfe90c7603a062644fc14a866c13f79)

<br/>

D3还可以创建坐标轴：

<DemoAxis1 />

> [源码](https://bl.ocks.org/d3indepth/91a677b1246d2bfe28a6d27adf522d70)

<br/>

和大多数D3元素一样，你可以进行很多配置。比如改变坐标轴朝向、刻度的值和格式。

<DemoAxis2 />

> [源码](https://bl.ocks.org/d3indepth/65fec76009499a2cd17d902021528e23)

<br/>

## 布局

> Layouts

D3提供了许多帮助你将数据转换成视觉布局的函数，这些函数叫做布局函数（layouts）。例如：如果我们有层级数据（或树状数据 tree shaped），我们可以利用布局函数来创建树图（tree view）：

<DemoTree />

> [源码](https://bl.ocks.org/d3indepth/2815bd8c7d0f00580a64bdea6c8513f6)

<br/>

打包图（packed circle view）（包括根据收入决定尺寸的叶子节点）：

<DemoPack />

> [源码](https://bl.ocks.org/d3indepth/e3b16f8ca441adfe4ffcd2f6d7b0bba5)

<br/>

矩形树图（treemap）:

<DemoTreemap />

> [源码](https://bl.ocks.org/d3indepth/502c024a398dc772fe947905f217dab3)

<br/>

在这背后，布局函数layout向每个元素上添加属性（比如位置、半径、宽度和高度）。当更新DOM元素时，这些属性就会被使用到。


## 过渡
> Transitions

D3使得在DOM状态之间进行过渡效果变得很简单。不仅位置和尺寸（比如宽度、高度、半径）可以平滑过渡，颜色也可以：

<DemoTransition />

> [源码](https://bl.ocks.org/d3indepth/16c3036242d93526f3e18c60266b154e)

<br/>

除了实现令人愉快的视觉效果，过渡transitions还帮助用户捕捉元素在不同状态之间的变化轨迹。

## 用户交互
> User interaction

D3有一些帮助优化用户交互的工具，比如voronoi网格（优化hover/click/touch区域）、刷子（brushing）、缩放（zooming）和拖拽（dragging）。

举个🌰，假设我们有很多有悬浮效果的小点，这很难恰好将鼠标放在某个圆的位置上：

<DemoVoronoi />

> [源码](https://bl.ocks.org/d3indepth/ee5a4b110b9841cc55dbba0716343143)

<br/>

然而如果开启了voronoi网格（点击上面的*'Enable Voronoi'*），就可以通过多边形来判断距离用户hover/click/touch位置最近的点。这样定位一个点就容易多了。
