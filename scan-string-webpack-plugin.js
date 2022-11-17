class ScanStringWebpackPlugin {
  constructor({ from = './src', to = './scanFile.json', stringMatchArr, extnames }) {
    this.from = from,
    this.to = to,
    this.stringMatchArr = stringMatchArr,
    this.extnames = extnames
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'ScanStringWebpackPlugin',
      (compilation, callback) => {
        const fsInput = compiler.inputFileSystem
        const fsOutput = compiler.outputFileSystem
        // 存储输出结果数组
        const contentData = []
        this.searchFile(fsInput, this.from, this.extnames, this.stringMatchArr, contentData)
        // contentData不为空
        if (contentData.length > 0) {
          // 将最终扫描结果写入指定目录下文件
          fsOutput.writeFileSync(`${this.to}`, JSON.stringify(contentData, null, '\t'))
        }
        callback()
      }
    )
  }
  // 递归遍历所有文件， 找到满足以extnames数组中内容结尾的文件
  searchFile(fs, path, extnames, stringMatchArr,contentData) {
    const files = fs.readdirSync(path)
    for (const file of files) {
      const fullPath = `${path}/${file}`
      const fileStat = fs.statSync(fullPath)
      if (fileStat.isDirectory()) {
        // 文件夹 递归遍历
        this.searchFile(fs, fullPath, extnames, stringMatchArr, contentData)
      } else {
        // 文件
        const splited = file.split('.')
        // 得到该文件后缀名
        const extname = splited[splited.length - 1]
        if (extnames.includes(extname)) {
          // 满足文件匹配规则
          this.scanFile(fs, fullPath, stringMatchArr, contentData)
        }
      }
    }
  }
  // 对文件进行扫描查找埋点
  scanFile(fs, fullPath, stringMatchArr, contentData) {
    // 获取当前文件内容
    const content = fs.readFileSync(fullPath, 'utf-8')
    // 将文件内容通过换行符分割为数组
    const contentArr = content.split(/\r?\n/)
    // 初始行数置为0
    let count = 0
    // 循环每一行，通过字符数组stringMatchArr匹配查找埋点
    for (const inline of contentArr) {
      count++
      stringMatchArr.forEach((str) => {
        // 判断str是字符串还是正则
        const statStr = str instanceof RegExp
        if (statStr) {
          // 正则
          if (str.test(inline)) {
            const data = {
              filepath: fullPath,
              line: count,
              match: str.exec(inline)
            }
            contentData.push(data)
          }
        } else {
          // 字符串
          if (inline.includes(str)) {
            const data = {
              filepath: fullPath,
              line: count,
              match: str,
            }
            contentData.push(data)
          }
        }
        
      })
    }
  }
}

module.exports = ScanStringWebpackPlugin
