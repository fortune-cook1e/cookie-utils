import { CryptoOptions, AnyOptions, CryptoReturns } from './types/index'
import sortKeys from 'sort-keys'
import md5 from 'md5'

/**
 * @description 将参数进行排序
 * @param {AnyOptions} params 需要排序的字段对象集合
 * @param {string} filterParams 不需要排序的字段
 * @date 2022-07-29 23:26:24
 * @return {*}
 */
function sortParams(params: AnyOptions): AnyOptions {
	return sortKeys(params, { deep: true })
}

/**
 * @description 将 Get Or Post请求参数进行格式化处理
 * @date 2022-07-30 22:12:06
 * @return {string}
 */
function formatParams({ params = {}, salt }: { params: AnyOptions; salt: string }): string {
	const newParams: AnyOptions = sortParams(params)
	const paramStr = (Object as any).entries(newParams).reduce((prev: string, next: any[]) => {
		// eslint-disable-next-line prefer-const
		let [key = '', val = ''] = next || []
		if (!key) return prev

		if (Array.isArray(val) || val === null) {
			val = JSON.stringify(val)
		} else if (Object.prototype.toString.call(val) === '[object Object]') {
			val = JSON.stringify(val)
		}

		return `${prev}${key}=${val}&`
	}, '')

	return `${paramStr}${salt}`
}

/**
 * @description 加密方法
 * @param {CryptoOptions} opt
 * @date 2022-07-30 22:12:34
 * @return {*}
 */
export const clientCrypto = (opt: CryptoOptions): CryptoReturns => {
	const { enable = true, params, salt } = opt || {}
	if (!enable) {
		return {
			params
		}
	}

	const newOptions = JSON.parse(JSON.stringify(params))
	if (!newOptions._ || typeof newOptions._ !== 'number') {
		newOptions._ = Date.now()
	}

	const sign = formatParams({ params: newOptions, salt })
	const md5Sign = md5(sign)
	return {
		params: newOptions,
		sign: md5Sign
	}
}
