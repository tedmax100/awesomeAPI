export enum APIStatus {
    FAIL = 0, // (沒有分類到的錯誤)
    SUCCESS = 1,
    NO_SUCH_USER = 2,
    NOT_LOGIN = 4,
    DATA_LOCK = 21,
    TIME_ERROR = 22,
    NO_TOPIC = 23,
    DUPLICATE_TASK = 24,
    NO_DATA = 25,
    DUPLICATE_USER_NAME = 31,
    NO_CHAT_ROOM = 51,
    DEVICE_CLEAR = 61,
    PARAMS_ERROR = 701
}