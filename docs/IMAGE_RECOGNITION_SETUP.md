# 图像识别接口启用文档

本文档说明如何将发布页的“照片识别物品”从演示兜底逻辑升级为真实图像识别接口。

## 一、当前状态

当前小程序发布页已提供：

```text
使用智能识别 -> 相机识别物品
使用智能识别 -> 上传图片识别
```

前端会调用后端接口：

```text
POST /api/ai/image-assist
```

当前后端为演示兜底逻辑，主要根据图片路径或文件名中的关键词生成分类、标题、标签和描述建议。该方式适合离线演示，不适合真实识别。

## 二、正式启用目标

正式启用后，推荐流程为：

```text
小程序选择图片
-> 上传图片到后端或对象存储
-> 获得可访问图片 URL
-> 后端调用图像识别 / 视觉大模型接口
-> 解析物品类别、关键词和描述
-> 返回统一结构
-> 小程序自动填充标题、分类、标签和描述
-> 用户手动确认或修改后发布
```

## 三、推荐接口方案

可选方案：

| 方案 | 适用场景 | 说明 |
|---|---|---|
| 腾讯云图像识别 | 国内部署、微信生态 | 适合校园小程序项目，网络稳定性较好 |
| 百度智能云图像识别 | 通用物体识别 | 支持常见物体和标签识别 |
| 阿里云视觉智能开放平台 | 已有阿里云账号 | 可与对象存储 OSS 配合 |
| 视觉大模型 API | 需要生成自然语言描述 | 可直接根据图片生成标题、标签和描述 |

如果只是比赛演示，建议先使用“视觉大模型 API + 规则兜底”。如果要长期上线，建议使用“对象存储 + 云厂商图像识别 + AI 文案生成”组合。

## 四、环境变量配置

在项目根目录 `.env` 和 `backend/.env` 中增加：

```env
IMAGE_RECOGNITION_PROVIDER=mock
IMAGE_RECOGNITION_API_KEY=
IMAGE_RECOGNITION_ENDPOINT=
IMAGE_UPLOAD_BASE_URL=
```

字段说明：

| 字段 | 说明 |
|---|---|
| IMAGE_RECOGNITION_PROVIDER | 图像识别服务商，如 mock/tencent/baidu/aliyun/vision_model |
| IMAGE_RECOGNITION_API_KEY | 图像识别接口密钥 |
| IMAGE_RECOGNITION_ENDPOINT | 图像识别接口地址 |
| IMAGE_UPLOAD_BASE_URL | 图片上传后可访问的基础地址 |

`mock` 表示继续使用当前演示兜底逻辑。

## 五、后端改造建议

建议新增服务文件：

```text
backend/src/services/imageRecognitionService.js
```

服务统一返回：

```js
{
  title: "闲置台灯转赠",
  category: "闲置物资",
  tags: ["台灯", "小家电", "闲置物资"],
  description: "图片中疑似为台灯，请补充功能是否正常、新旧程度和交接地点。",
  confidence: 0.86,
  provider: "vision_model"
}
```

然后在：

```text
backend/src/routes/aiRoutes.js
```

中的：

```text
POST /api/ai/image-assist
```

改为：

```text
优先调用真实图像识别服务
失败时回退 aiService.assistByImage
```

## 六、接口请求结构

推荐请求：

```json
{
  "imageUrl": "https://example.com/uploads/item-001.jpg",
  "hint": "用户可选补充说明"
}
```

如果仍处于开发者工具演示阶段，也可以临时传：

```json
{
  "imageUrl": "wxfile://tmp_xxx.jpg",
  "fileName": "book-cover.jpg"
}
```

但真实云识别通常无法直接访问 `wxfile://` 临时路径，所以正式启用前必须先上传图片。

## 七、接口返回结构

后端应统一返回：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskType": "image_assist",
    "success": true,
    "title": "闲置台灯转赠",
    "category": "闲置物资",
    "tags": ["台灯", "小家电", "闲置物资"],
    "description": "图片中疑似为台灯，请补充功能是否正常、新旧程度和交接地点。",
    "suggestion": "识别结果仅供参考，发布前请手动确认。"
  }
}
```

小程序发布页已经会自动读取这些字段并填入表单。

## 八、前端上传流程

当前前端位于：

```text
miniprogram/pages/publish/publish.js
```

当前流程：

```text
wx.chooseMedia -> 得到临时路径 -> 调用 /api/ai/image-assist
```

正式流程建议改为：

```text
wx.chooseMedia
-> wx.uploadFile 上传到 /api/upload/image
-> 后端返回 imageUrl
-> 调用 /api/ai/image-assist
-> 自动填充表单
```

建议新增上传接口：

```text
POST /api/upload/image
```

返回：

```json
{
  "url": "https://example.com/uploads/item-001.jpg"
}
```

## 九、测试方法

### 1. 后端接口测试

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:3000/api/ai/image-assist" `
  -Method POST `
  -Headers @{ Authorization = "Bearer demo-token-1" } `
  -ContentType "application/json" `
  -Body '{"imageUrl":"book-cover.jpg","hint":"教材封面"}'
```

预期返回分类、标题、标签和描述。

### 2. 小程序测试

1. 进入“发布”页
2. 展开“使用智能识别”
3. 点击“相机识别物品”或“上传图片识别”
4. 查看标题、分类、描述、标签是否自动填充
5. 手动删除或新增标签
6. 提交发布

## 十、注意事项

1. 图像识别结果必须允许用户手动修改。
2. 不要直接信任识别结果，应继续走管理员审核。
3. 正式上线时不要把 API Key 写入前端。
4. 图片临时路径不能作为云识别的长期输入，必须先上传。
5. 识别接口失败时应回退到手动填写，不应阻塞发布。
6. 涉及人脸、证件、隐私图片时，应避免存储敏感信息。
