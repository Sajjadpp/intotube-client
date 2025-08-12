import { currentBaseUrl } from '../../axios/AxiosInstance'
import userProfile from '../images/user-3296.png'



export const profileImageUrl = (url) =>{
    return `http://10.150.120.181:4000/profile/${url?.split('/').splice(3).join()}`
}


export const convertUrl = (url) =>{
    return `${currentBaseUrl}${url}`
}

export const userProfileImg = () => userProfile     