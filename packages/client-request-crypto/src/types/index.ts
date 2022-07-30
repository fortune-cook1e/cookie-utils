export interface AnyOptions {
	[prop: string]: any
}

export interface CryptoOptions {
	enable?: boolean // 是否启用
	options: AnyOptions
	salt: string
	// old?: boolean
	filterParams?: string[] // 需要过滤的参数
}
