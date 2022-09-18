import { Context } from 'koa'

export interface ServerRequestCryptpOptions {
	enable: boolean // 是否启用
	salt: string // 加密盐
	authoPass?: string // 用于绕过检测 需要与服务端保持一致
	expireCheck?: boolean // 是否对过期时间进行检查
	timeout?: number // 超时检测
	unless?: string[] // 需要绕过检查的api
	errCode?: string // 检测错误时报错的错误码
}

export interface AnyOptions {
	[prop: string]: any
}

export interface ErrorResponseParams {
	ctx: Context
	errCode: string
}
