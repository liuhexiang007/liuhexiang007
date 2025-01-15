const fs = require('fs')
const json2xls = require('json2xls')
// const local_zh_hk = require("./config/zh-hk");

fs.readFile('src/language/en.json', 'utf8', (err, data) => {
  if (err) throw err
  const local_zh = [require('./config/zh')]
  const local_zh_hk = require('./config/zh-hk')
  const local_en = require('./config/en')
  const jsonArray = []
  local_zh.forEach(function(item) {
    let temp = {}
    for (const tempKey in item) {
      const map_zh = item[tempKey]
      const map_hk = local_zh_hk[tempKey]
      const map_en = local_en[tempKey]
      temp = {
        'key': tempKey,
        '中文翻译': '',
        '繁体中文翻译': '',
        '英文翻译': ''
      }
      jsonArray.push(temp)
      for (const mapKey in map_zh) {
        temp = {
          'key': mapKey,
          '中文翻译': map_zh[mapKey],
          '繁体中文翻译': map_hk[mapKey],
          '英文翻译': map_en[mapKey]
        }
        jsonArray.push(temp)
      }
    }
  })

  const xls = json2xls(jsonArray)
  fs.writeFileSync('香港项目翻译文件.xlsx', xls, 'binary')
})
