/**
 * Response Codes
 * @category API
 * @description Response codes for API
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
declare enum ResponseCode {
    SUCCESS = 200,
    FAILURE = 300,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
    UNKNOWN = 520
}
export { ResponseCode };
