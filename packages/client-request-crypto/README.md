# client-request-check

## 客户端接口加密设计

### 加密规则

> 1. `全局拦截`API 请求的参数[GET/POST]，并转换为 JSON 格式。
> 2. 请求体中附加时间戳参数，参数字段为`_`,值为时间戳。
> 3. 对转换后的请求体 JSON 进行排序，
> 4. 对排序好的 JSON 进行字符串拼接，
> 5. 拼接好的字符串（通过`key=val&`）最后再附加上固定盐值得到最后需要加密的字符串（即`...&key=val&salt`）。
> 6. 使用`MD5`的方式加密最后拼接的字符串，得到加密密钥。

### 排序规则

> 1. 只对对象的 key 进行排序。
> 2. 进行深度遍历排序。
> 3. 当遇到数组时，检测数组的每项值，若为`对象(Object/Array)`则遍历对象进行递归排序，其他类型不做处理。

### 拼接规则

> 1. 遍历 JSON 对象(只遍历第一层)，通过`key=val&` 的方式进行拼接 （使用`&`符合进行字段间的拼接）。
> 2. 当某个 key 对应的值为`Object类型`时候（即：JSON/Array）时，通过`JSON.stringify` `转换为字符串`再进行拼接。

### Started

```javascript
import { clientCrypto } from '@fe-cookie/client-request-crypto'

// mock api params
// GET OR POST 请求

const getParams = {
	name: 'gaga',
	age: 20
}

const { sign } = clientCrypto({ params, salt: 'xxx' })

axios({
	url: 'xxx',
	method: 'GET',
	headers: {
		'X-AUTHO-TOKEN': sign
	}
})
```
