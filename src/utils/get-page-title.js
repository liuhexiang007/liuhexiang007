// import defaultSettings from '@/settings'

const title = window._CONFIG.webTitle

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
