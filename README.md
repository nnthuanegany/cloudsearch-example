## CloudSearch

### Hướng dẫn bắt đầu

Bước 1: Cài đặt packages

```bash
npm install
```

Bước 2: Cấu hình

Tạo file config.js tại thư mục root

```bash
touch config.js
```

Nội dung

```js
module.exports = {
  region: 'REGION',
  credentials: {
    accessKeyId: 'ACCESS_KEY_ID',
    secretAccessKey: 'SECRET_ACCESS_KEY'
  }
}
```

### Tài liệu tham khảo

| Link                                                                                                                                           | Mô tả |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| [AWSJavaScriptSDK v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)                                                       |       |
| [CloudSearch Client - AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudsearch/index.html) |       |
| [Developer Guide](https://docs.aws.amazon.com/cloudsearch/latest/developerguide/what-is-cloudsearch.html)                                      |       |
| [IndexField](https://docs.aws.amazon.com/cloudsearch/latest/developerguide/API_IndexField.html)                                                |       |

