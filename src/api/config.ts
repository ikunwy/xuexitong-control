import request from '@/utils/request'

export const getConfigApi = () => {
    return request.get('/config')
}