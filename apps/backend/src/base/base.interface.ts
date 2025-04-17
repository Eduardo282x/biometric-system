export class BaseResponse {
    message: string;
    success: boolean;
}

export class BaseResponseLogin extends BaseResponse {
    userData: any;
}

export const baseResponse: BaseResponse = {
    message: '',
    success: true,
}

export const badResponse: BaseResponse = {
    message: '',
    success: false,
}