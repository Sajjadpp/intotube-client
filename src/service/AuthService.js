

let accessToken = null;

export const setAccessToken = (token) =>{

    accessToken = token;
}

export const getAccessToken = () => accessToken;

export const getRefreshToken = async() =>{
    try{
        let response = await fetch('localhost:4000/api/auth/refresh',{
            credentials: 'include'
        });
        let data = response.json();

        if(data.accessToken){

            setAccessToken(data.accessToken);
            return true;
        }
        return false;
    }
    catch(error){

        console.log(error);
        return false
    }
}

