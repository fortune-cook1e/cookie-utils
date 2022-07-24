import { AnyOptions } from './types/index'
/**
 * 将 querystring 解析成 object
 *
 * @export
 * @param {string} string
 * @returns {object}
 */
export function parse(string: string): object {
	const obj: any = {}
	if (string) string.replace(/\+/g, ' ').split(/[&;]/).forEach(it)
	return obj

	function it(pair: string) {
		const len = pair.length
		if (!len) return
		let pos = pair.indexOf('=')
		if (pos < 0) pos = len
		const key = decodeURIComponent(pair.substr(0, pos))
		const val = decodeURIComponent(pair.substr(pos + 1))
		obj[key] = val
	}
}

/**
 * @description 对象转字符串
 * @param {*} obj
 * @example
 *  var string = qs.stringify({foo: "bar", hoge: "pomu"}); // => "foo=bar&hoge=pomu"
 */
export function stringify(obj: any) {
	const list: string[] = []
	if (typeof obj === 'object' && obj !== null) Object.keys(obj).map(it)
	return list.join('&')

	function it(key: string) {
		const val = obj[key]
		if (val == null) return
		// if (val === "") return;
		if (val instanceof Function) return
		const pair = encodeURIComponent(key) + '=' + encodeURIComponent(val)
		console.log({ pair })
		list.push(pair)
	}
}

/**
 * @description 对象进行JSON序列化
 * @param {AnyOptions} obj
 * @date 2022-07-24 21:51:09
 */
export function transformObjectToJson(obj: AnyOptions) {
	return Object.entries(obj)
		.map(([key, val]) => [key, typeof val === 'object' && val !== null ? JSON.stringify(val) : val])
		.reduce((result: any, [key, val]) => {
			result[key] = val
			return result
		}, {})
}

const a = {
	name: 'gaga',
	names: [],
	hobby: '{}'
}

const result = stringify(a)
console.log(result)
