import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW'
import ElementLocale from 'element-ui/lib/locale'

Vue.use(VueI18n)

// 添加element-ui国际化
const local_zh = require('./config/zh')
const el_zh = zhLocale
const zh = Object.assign(local_zh, el_zh)

const local_zh_hk = require('./config/zh-hk')
const el_zh_hk = zhTWLocale
const zh_hk = Object.assign(local_zh_hk, el_zh_hk)

const local_en = require('./config/en')
const el_en = enLocale
const en = Object.assign(local_en, el_en)

// 存储在本地,刷新后不会丢失
// const language = Cookies.get('language') || 'zh'
const language = 'en' // 锁死中文
Cookies.set('language', language)
const i18n = new VueI18n({
  locale: language, // 语言标识
  messages: {
    'zh': zh, // 中文
    'zh-hk': zh_hk, // 中文繁体-香港
    'en': en // 英文
  }
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
