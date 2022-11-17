### ScanStringWebpackPlugin 插件

#### 作用

扫描指定目录下指定文件内容，找到匹配指定字符串内容，得到如下输出

```js
 {
    "filepath": '/src/pages/App.vue', // 匹配到的文件路径
    "line": 77, // 匹配到的行号
    "match": "<div data-eciskey='xxx'>xxx</div>" // 匹配到的字符串
}
```

#### 启动

#### vue 框架 （vue-cli 创建项目）

- 将此 plugin 文件夹导入至 vue 项目根目录下

- 在 vue.config.js 中，进行如下配置：

  ```js
  // 1.导入插件
  const ScanStringWebpackPlugin = require("./plugin/scan-string-webpack-plugin")
  // 2.使用插件
  configureWebpack: {
    plugins: [
      new ScanStringWebpackPlugin({
        from: "",
        to: "",
        stringMatchArr: [],
        extnames: [],
      }),
    ]
  }
  ```

  > 属性说明

  - `from` ： 对哪个目录下的所有文件进行扫描，例：`from: './src'` 对 src 目录下的文件进行扫描 ；可选属性，默认指定扫描`./src` 目录下文件
  - `to` ：扫描结果存入哪个指定目录下文件，例：`to: './dist/scanFile.json'` 扫描结果存入 dist 目录下 scanFile.json 文件中；可选属性，默认将结果存入`./scanFile.json` 文件中
  - `stringMatchArr` : 存放要匹配的字符串、正则，例： `stringMatchArr: ['data-eciskey', 'ctr.emit']` 、`stringMatchArr: [/data-eciskey/, /ctr.emit/]`
  - `extnames` : 文件后缀名数组，来指定要扫描的文件类型， 例： `extnames: ['vue', 'jsx', 'tsx']`

  > 注意：为最终扫描结果的可读性，属性`to ` 中指定文件名应以.json 或.js 结尾

- vue.config.js 示例

  ```js
  const { defineConfig } = require("@vue/cli-service")
  // ScanStringWebpackPlugin插件
  const ScanStringWebpackPlugin = require("./plugin/scan-string-webpack-plugin")
  module.exports = defineConfig({
    configureWebpack: {
      plugins: [
        new ScanStringWebpackPlugin({
          to: "./src/assets/scanFile.json",
          stringMatchArr: ["data-eciskey", "</div>", "ctr.emit"],
          extnames: ["vue", "jsx", "tsx"],
        }),
      ],
    },
  })
  ```

- 启动命令

  ```js
  npm run build
  ```

#### react 框架 (create-react-app 创建)

- 将此 plugin 文件夹导入至 react 项目根目录下

- 修改 vue 默认配置需配合`react-app-rewired` 和`customize-cra` 使用

  ```js
  // 下载react-app-rewired和customize-cra
  npm install customize-cra react-app-rewired -D
  ```

- 更换 package.json 中的 script 命令

  ```js
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  }
  ```

- 在 package.json 同级目录下新建 config-overrides.js 文件

  ```js
  const { override, addWebpackPlugin } = require("customize-cra")
  const ScanStringWebpackPlugin = require("./plugin/scan-string-webpack-plugin")

  module.exports = override(
    addWebpackPlugin(
      new ScanStringWebpackPlugin({
        from: "",
        to: "",
        stringMatchArr: [],
        extnames: [],
      })
    )
  )
  ```

  > 实例化插件中的属性信息同上 vue 框架的属性信息

- 启动命令

  ```js
  npm run build
  ```

  ​

  ​
