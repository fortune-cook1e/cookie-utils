export const enum ErrorCode {
	/** 未携带签名 */
	LOST_SIGN = '401001',
	/** 未携带时间戳 */
	LOST_TIMESTAMP = '401002',
	/** 超时，无效请求 */
	TIMEOUT = '401003',
	/** 客户端与服务端签名不一致 */
	DIFFERENT_RESULT = '401004',
	// 统一签名失败
	SIGN_ERROR = '401000'
}

export const ERROR_MAP = {
	[ErrorCode.LOST_SIGN]: '未携带签名',
	[ErrorCode.LOST_TIMESTAMP]: '未携带时间戳',
	[ErrorCode.TIMEOUT]: '已超时，无效请求',
	[ErrorCode.DIFFERENT_RESULT]: '客户端与服务端签名不一致',
	[ErrorCode.SIGN_ERROR]: '端签名失败'
}
