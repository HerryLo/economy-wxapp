# 看懂经济词

用人话解释日常经济术语的微信小程序：搜得到、看得懂、中英对照、配小例子。

## 功能

- **术语搜索**：支持中文名、英文、别名、一句话定义、说人话解释和小例子搜索，不区分大小写
- **分类筛选**：宏观经济、货币政策、金融投资、贸易、民生、政府报告
- **词条详情**：一句话定义 + 说人话解释 + 小例子 + 中英文对照
- **小岛故事**：用一座小岛的连续故事串起 40 多个经济概念，详情页可互相跳转
- **复制**：英文名称与别名点按即可复制
- **分享**：支持转发好友和分享到朋友圈

已收录 125 个高频词，涵盖日常新闻与政府工作报告常见术语，纯本地数据，无后端、无登录、无网络请求。

## 技术栈

- uni-app 3（Vue 3）+ Vite 5
- 微信小程序（mp-weixin）
- Vitest（搜索逻辑单元测试）

## 目录结构

```
src/
  data/terms.js          词条数据（增删词条改这里）
  data/islandExamples.js 小岛故事示例（按词条 id 覆盖，原创内容）
  utils/search.js        搜索与分类过滤
  pages/index/           首页：搜索、分类、词条列表
  pages/detail/          详情页：解释与例子
  pages/story/           小岛故事专题页
  pages.json             页面配置
  manifest.json          小程序 AppID 与基础配置
tests/
  search.test.js         搜索逻辑测试
  island.test.js         小岛示例数据校验
```

## 内容来源

小岛故事的灵感来自《小岛经济学》（彼得·希夫、安德鲁·希夫著）。本项目中的小岛人物、村庄、情节与示例文字均为原创改写，仅借鉴“用岛屿讲经济”的思路，不包含原书文字与情节。词条内容为通俗整理，仅供参考，不构成任何投资建议。

## 开发

```bash
npm install

# 微信小程序热更新（产物在 dist/dev/mp-weixin）
npm run dev:mp-weixin

# 单元测试
npm test

# 生产构建（产物在 dist/build/mp-weixin）
npm run build:mp-weixin
```

微信开发者工具导入 `dist/dev/mp-weixin`（开发）或 `dist/build/mp-weixin`（构建）即可预览。AppID 已写入 `src/manifest.json`：`wxafd7191b6cef5cec`。

## 维护词条

在 `src/data/terms.js` 中新增一条：

```js
{
  id: 'unique-id',
  term: '中文名',
  en: 'English Name',
  aliases: ['常见别名'],
  category: '宏观经济',
  summary: '一句话定义',
  plain: '说人话的解释',
  example: '一个小例子',
}
```

改完运行 `npm test`，确认分类与搜索没有回归。

## 上线前需要做的事

1. 微信公众平台补充小程序基本信息、服务类目（建议「工具-信息查询」或教育类，以当前类目表为准）
2. 确认个人/企业主体可选的类目与资质要求
3. 内容自查：词条为通俗整理，避免出现投资建议、荐股、理财推荐等表述
4. 上传体验版 → 真机体验 → 提交审核

## 免责声明

词条内容为通俗整理，仅供参考，不构成任何投资建议。
