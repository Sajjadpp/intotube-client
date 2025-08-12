/* global google*/
import AxiosInstance from '../../axios/AxiosInstance'
import {toast} from 'react-toastify'

  
export const GoogleAuth = (dispatch) => {

    const OnSignedIn = async(response) => {
        console.log('working')
        try{
            let responses = await AxiosInstance.post(
                "/auth/google",
                {idToken :response.credential}
            );
            
            if(responses.status === 200){
                
                console.log(responses.data)
                toast('user logined')
                location.reload()
            }
            else{

                toast("try again");
            }
        }
        catch(error){
            console.log(error,"error")
            toast("try agiain")
        }
    
    
    };

    try{
      google.accounts.id.initialize({
        client_id: '512549908605-37u5qhvdfas4k8hcl9u0ikflpjljrmt4.apps.googleusercontent.com',
        callback: OnSignedIn,
      });
    
      google.accounts.id.prompt((notification) => {
        console.log("Prompt notification: ", notification);
    
        if (notification.isNotDisplayed()) {
          console.log("Not displayed reason: ", notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log("Skipped reason: ", notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.log("Dismissed reason: ", notification.getDismissedReason());
        } else {
          console.log("One Tap displayed successfully!");
        }
      });
    }
    catch(error){
      console.log(error)
    }
};
