export interface ApiResponse<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

export type ServiceResult<T> = ApiResponse<T>;
