import { GoogleAuth } from "../assets/signupButton/SignupButton";

export const handleError = (error) =>{

    if(error.status === 401 || error.status === 403){

        console.log('no user error');
        GoogleAuth()
    }
}