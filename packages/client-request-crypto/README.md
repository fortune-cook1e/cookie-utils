# client-request-check

## 客户端接口加密设计

**加密方式：**
1、客户端对所有请求参数（上传文件参数除外），并附加盐值、当前时间戳、拼接进行 MD5 加密

**一：客户端**

**MD5 加密规则：**
1、所有请求参数（上传文件参数排除）参与加密
2、附加固定盐值、当前时间戳，参与排序并生成 MD5 加密值
3、加密后的 MD5 值通过 header 传输，header key: Autho-Token

**GET 请求参数说明**

若客户端发起的是 GET 请求，请在发起 xhr 请求之前自己拼接 query 参数
**案例（这里以小程序为例）**
**1.GET 请求**

```javascript
// 由于无法保证小程序的query处理后的排序与算法是一致的，因此我们需要自己做一下query处理。
import {
	querySignWithTimestamp,
	stringify,
	transformObjectPropertyToJSON
} from 'client-request-check'

let data = { a: 1, b: 2, c: {}, d: [] }
// 清除一些空值
data = JSON.parse(JSON.stringify(o.data || {}))

//1. 加密策略中的第一步需要将data中的第一层属性JSON化，包里提供了函数方便处理
// { a: 1, b: 2, c: {}, d: [] } => { a: 1, b: 2, c: '{}', d: '[]' }
data = transformObjectPropertyToJSON(data || {})

// 2. 将对象转换为query string
data = stringify(data)

// 3. 生成加密token及最终参数，第二个参数选填，不传用默认盐值
const SALT = '盐值'
const ret = querySignWithTimestamp(ret, { salt: SALT })

// GET请求将参数直接拼接到url后面
const url = 'https://example.com/api/xxx' + (ret.query ? `?${ret.query}` : '')
const authoToken = ret.signing

// 发送请求
request({
	url,
	method: 'GET',
	header: {
		['Autho-Token']: authoToken
	},
	success: function (res) {}
})

var request = 'http://bff-api.com/example?a=10&b=20'
```

**2.POST 请求**

```js
import { objectSignWithTimestamp } from 'client-request-check'

// 请求体
const body = { a: 1 }

const ret = objectSignWithTimestamp(body, {
	salt: 'xxx'
})
const data = ret.body
const authoToken = ret.signing

request({
	url: 'https://example.com/api/xxx',
	method: 'POST',
	data,
	header: {
		['Autho-Token']: authoToken
	}
})
```
