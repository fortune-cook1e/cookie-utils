export interface AnyOptions {
	[prop: string]: any
}

export interface CryptoOptions {
	enable?: boolean // 是否启用
	params: AnyOptions
	salt: string
	filterParams?: string[] // 需要过滤的参数
}

export interface CryptoReturns {
	params: AnyOptions
	sign?: string
}
