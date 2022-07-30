import { CryptoOptions, AnyOptions } from './types/index'
import sortKeys from 'sort-keys'

/**
 * @description 将参数进行排序
 * @param {AnyOptions} params 需要排序的字段对象集合
 * @param {string} filterParams 不需要排序的字段
 * @date 2022-07-29 23:26:24
 * @return {*}
 */
export function sortParams(params: AnyOptions, filterParams?: string[]): AnyOptions {
	if (filterParams && filterParams.length) {
		params = params.filter((p: string) => !filterParams.includes(p))
	}
	return sortKeys(params, { deep: true })
}

export const clientCrypto = (opt: CryptoOptions) => {
	const { enable = true, options } = opt || {}
	if (!enable) {
		return {
			options
		}
	}

	const newOptions = JSON.parse(JSON.stringify(options))
	if (!newOptions._ || typeof newOptions._ !== 'number') {
		newOptions._ = Date.now()
	}
}
