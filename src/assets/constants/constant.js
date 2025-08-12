import { currentBaseUrl } from '../../axios/AxiosInstance'
import userProfile from '../images/user-3296.png'



export const profileImageUrl = (url) =>{
    return `${currentBaseUrl}/profile/${url?.split('/').splice(3).join()}`
}


export const convertUrl = (url) =>{
    return `${currentBaseUrl}${url}`
}

export const userProfileImg = () => userProfile     