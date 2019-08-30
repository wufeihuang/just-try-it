import DemoBar from './bar';
import {DemoLine, DemoLineCurve} from './lines'

# Introduction to D3

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
<br/>

你可以选择使用曲线插值的能力：

<DemoLineCurve />
<br/>