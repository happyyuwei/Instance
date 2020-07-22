# 接口请求文档

## **登录服务**

+ **请求 URL:**  `/rest/user/login`

+ **请求类型:** `POST`

+ **请求示例（`JSON格式`）：**
```JSON
{
	"userName":"your user name",
	"password":"your password"
}
```
+ **请求参数**

|参数名|参数含义|类型|备注|
|-----|--------|----|----|
|userName| 登录用户名| String | 必填|
|password| 登录密码|String| 必填|

+ **返回 `HTTP` 状态码**

|状态码|含义|
|-----|--------|
|200| 登录成功|
|其他| 登陆失败|

+ 其他

登入成功请回返回 `Token`，所以需要权限验证的请求均需要把 `token` 放入 `cookie` 中。

```Javascript
token=your token id
```

***
## 查询用户信息服务（构建中）

+ **请求 URL:**  `/rest/user/detail`

+ **请求类型:** `GET`

+ **返回 `HTTP` 状态码**

|状态码|含义|
|-----|--------|
|200| 登录成功|
|其他| 登陆失败|





