# FX2md

FX2md 是一个本地网页内容保存工具，可以把 X/Twitter、LINUX DO、飞书文档、微信公众号等网页内容保存为 Markdown，并支持图片、视频和常见文章结构的处理。

这个版本重点优化了飞书文档的虚拟渲染表格：采集时会放慢滚动等待，并保留更完整的表格快照，减少导出 Markdown 时漏行、漏单元格的问题。

## 功能

- 保存网页正文为 Markdown
- 支持飞书文档、微信公众号、LINUX DO、X/Twitter
- 支持飞书普通表格导出为 Markdown 表格
- 支持自定义 Markdown 与视频保存目录
- 支持本地托盘服务和浏览器扩展配合使用
- 支持 Windows / macOS 打包

## 从源码运行

```bash
git clone https://github.com/JackJoven/FX2md.git
cd FX2md
pip install -r requirements.txt
python tray_app.py
```

本地服务默认监听：`http://127.0.0.1:9527`。

## 安装浏览器扩展

1. 打开 Edge 或 Chrome 的扩展管理页面。
2. 开启“开发人员模式”。
3. 选择“加载解压缩的扩展”。
4. 选择本项目里的 `extension` 目录。
5. 启动 `python tray_app.py` 后，在网页里使用扩展保存内容。

## 打包 Windows exe

```bash
pip install -r requirements.txt
pip install pyinstaller
pyinstaller fx2md.spec --clean --noconfirm
```

Windows 产物会生成在：`dist/FX2md/FX2md.exe`。

也可以直接运行：

```bat
build_windows.bat
```

## 飞书表格优化说明

飞书文档会对长文档和表格做虚拟渲染，页面刚滚动到表格时，DOM 里可能只有前几行内容。FX2md 的处理方式是：

- 滚动采集时增加等待时间，让飞书有更多时间补全 DOM。
- 对同一个飞书 block 允许用“内容更多”的表格快照替换旧快照。
- 解析表格时优先使用完整的表格 DOM，避免只导出表头或前几行。

## 开发检查

```bash
node --check extension/content.js
node --test extension/tests/*.test.js
python -m unittest
```

## 来源说明

FX2md 基于公开项目 `izscc/x2md` 修改维护，当前版本增加了飞书虚拟表格采集优化，并重新整理了项目品牌、构建说明和发布方式。若继续分发或商用，请先确认原项目授权状态。

