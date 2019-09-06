const path = require('path')

module.exports = {
  context: path.resolve(__dirname, 'src'), // 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader
  entry: './index.js', // 起点或是应用程序的起点入口。从这个起点开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行。
  output: { // 指示 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」
    auxiliaryComment:  'Test Comment', // 在和 output.library 和 output.libraryTarget 一起使用时，此选项允许用户向导出容器(export wrapper)中插入注释
    chunkFilename: '[id].js', // 决定了非入口(non-entry) chunk 文件的名称
    chunkLoadTimeout: 120000, // chunk 请求到期之前的毫秒数，默认为 120 000
    crossOriginLoading: false, // 只用于 target 是 web，使用了通过 script 标签的 JSONP 来按需加载 chunk
    jsonpScriptType: 'text/javascript', // 允许自定义 script 的类型，webpack 会将 script 标签注入到 DOM 中以下载异步 chunk
    devtoolFallbackModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]', // 当上面的模板字符串或函数产生重复时使用的备用内容
    // devtoolLineToLine: 已废弃
    devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]', // 仅在 「devtool 使用了需要模块名称的选项」时使用。自定义每个 source map 的 sources 数组中使用的名称
    devtoolNamespace: '', // 确定 output.devtoolModuleFilenameTemplate 使用的模块名称空间。未指定时的默认值为：output.library

    filename: '[name].[chunkhash].js', // 决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。对于单个入口起点，filename 会是一个静态名称

    hashDigest: 'hex', // 在生成 hash 时使用的编码方式，默认为 'hex'
    hashDigestLength: 20, // 散列摘要的前缀长度，默认为 20
    hashFunction: 'md4', // 散列算法，默认为 'md4'
    hashSalt: '', // 一个可选的加盐值
    hotUpdateChunkFilename: '[id].[hash].hot-update.js', // 自定义热更新 chunk 的文件名。占位符只能是 [id] 和 [hash]
    hotUpdateFunction: function(){}, // 只在 target 是 web 时使用，用于加载热更新(hot update)的 JSONP 函数
    hotUpdateMainFilename: '[hash].hot-update.json', // 自定义热更新的主文件名(main filename), 占位符只能是 [hash]
    jsonpFunction: '', // 只在 target 是 web 时使用，用于按需加载(load on-demand) chunk 的 JSONP 函数

    library: 'myLib', // 作用，取决于output.libraryTarget 选项的值
    libraryExport: undefined, // Configure which module or modules will be exposed via the libraryTarget. It is undefined by default
    libraryTarget: 'var', // 配置如何暴露 library

    path: path.resolve(__dirname, 'dist/assets'), //output 目录对应一个绝对路径
    pathinfo: true, // 告知 webpack 在 bundle 中引入「所包含模块信息」的相关注释。此选项在 development 模式时的默认值是 true，而在 production 模式时的默认值是 false
    publicPath: '', // https://stackoverflow.com/a/38748466，path是打包结果输出到本地的路径，publicPath是假设把打包后的代码放到服务器上，请求资源时相对于服务器根目录的路径

    sourceMapFilename: '[file].map', // 此选项会向硬盘写入一个输出文件，只在 devtool 启用了 SourceMap 选项时才使用。
    sourcePrefix: '', // 修改输出 bundle 中每行的前缀。
    strictModuleExceptionHandling: false, // 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存(require.cache)中删除这个模块。出于性能原因，默认为 false。当设置为 false 时，该模块不会从缓存中删除，这将造成仅在第一次 require 调用时抛出异常（会导致与 node.js 不兼容）。
    umdNamedDefine: true, // 当使用了 libraryTarget: "umd"，设为true，会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  module: {
    noParse: /jquery|lodash/, // 防止 webpack 解析那些任何与给定正则表达式相匹配的文件。忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。忽略大型的 library 可以提高构建性能。
    rules: [ // 创建模块时，匹配请求的规则数组。
      {
        test: /\.css$/,
        oneOf: [ // 当规则匹配时，只使用第一个匹配规则。
          {
            resourceQuery: /inline/, // foo.css?inline -  This option is used to test against the query section of a request string (i.e. from the question mark onwards)
            use: 'url-loader' // Rule.loader 是 Rule.use: [ { loader } ] 的简写
          },
          {
            resourceQuery: /external/, // foo.css?external
            use: 'file-loader'
          }
        ]
      }
    ]

  }
}