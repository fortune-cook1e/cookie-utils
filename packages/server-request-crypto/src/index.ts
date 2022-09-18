import { AnyOptions } from './../../client-request-crypto/src/types/index'
import { Context, Next } from 'koa'
import { ServerRequestCryptpOptions, ErrorResponseParams } from './types'
import { ERROR_MAP, ErrorCode } from './error'
import sortKeys from 'sort-keys'

const crypto = require('crypto')

function errorResponse({ ctx, errCode }: ErrorResponseParams) {
	if (!ctx) return
	const errorCode: string = errCode || ErrorCode.SIGN_ERROR
	const errorText = ERROR_MAP[errorCode as ErrorCode] || '接口签名校验失败'
	ctx.body = {
		code: errorCode,
		msg: errorText,
		message: errorText,
		error: [errorText]
	}

	throw new Error(errorText)
}

/**
 * 比对md5值
 * @param {string} paramStr
 * @param {string} md5
 * @returns {{ checkSign: string; result:boolean}}
 */
function md5Compare(
	paramStr: string,
	md5: string
): {
	imd5: string
	isSafe: boolean
} {
	const hash = crypto.createHash('md5')
	const imd5 = hash.update(paramStr).digest('hex')
	return {
		isSafe: imd5 === md5,
		imd5
	}
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
 * 对象排序
 * @param {*} [param={}]
 * @param {string[]} [filterParams]
 * @returns {Object}
 */
function sortParams(params: AnyOptions = {}): AnyOptions {
	return sortKeys(params, { deep: true })
}

function paramsCheck(
	ctx: Context,
	options: ServerRequestCryptpOptions
): { next: boolean; requestParams?: AnyOptions; sign?: string } {
	const { authoPass, expireCheck, timeout } = options

	// 特殊头过滤 (可用于测试环境)
	// 特殊头过滤
	const headerAuthoPass = ctx.headers['autho-pass'] || ctx.headers['x-autho-pass'] || ''
	if (headerAuthoPass === authoPass) {
		return { next: false }
	}

	const method = ctx.req.method
	const requestParams = method === 'POST' ? (ctx.request as any).body : (ctx.request as any).query

	// 时间检测
	const timestamp = requestParams._ || requestParams.t || ctx.headers['x-timestamp'] || ''

	// 是否携带时间戳
	if (expireCheck && !timestamp) {
		errorResponse({ ctx, errCode: ErrorCode.LOST_TIMESTAMP })
	}

	// 时间戳是否过期
	if (expireCheck && Date.now() - timestamp > (timeout as number)) {
		errorResponse({ ctx, errCode: ErrorCode.TIMEOUT })
	}

	if (!requestParams._) {
		requestParams._ = timestamp
	}

	// 加密头校验
	const sign =
		ctx.headers['autho-token'] ||
		ctx.headers['x-autho-token'] ||
		ctx.headers['external-token'] ||
		''
	if (!sign) {
		errorResponse({ ctx, errCode: ErrorCode.LOST_SIGN })
	}
	return {
		next: true,
		requestParams,
		sign: sign as string
	}
}

export const AuthoMiddleware = async (
	ctx: Context,
	next: Next,
	options: ServerRequestCryptpOptions
) => {
	const { enable, salt } = options
	if (!enable) return await next()
	const { next: goNext, requestParams, sign } = paramsCheck(ctx, options)
	if (!goNext || !requestParams) return await next()

	const formatRequestParamsStr = formatParams({ params: requestParams, salt })
	const { isSafe } = md5Compare(formatRequestParamsStr, sign as string)
	if (!isSafe) {
		errorResponse({
			ctx,
			errCode: ErrorCode.DIFFERENT_RESULT
		})
	}

	await next()
}
