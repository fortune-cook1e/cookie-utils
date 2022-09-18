export interface AnyOptions {
	[prop: string]: any
}

export interface CryptoOptions {
	enable?: boolean // 是否启用
	params: AnyOptions
	salt: string
}

export interface CryptoReturns {
	params: AnyOptions
	sign?: string
}
