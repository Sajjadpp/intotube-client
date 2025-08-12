import { useEffect, useState } from "react";


function useOnlineStatus(){

    const [isOnline, setIsOnline] = useState(false);

    useEffect(()=>{
        const handleOffline =()=> setIsOnline(false);
        const handleOnline =()=> setIsOnline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return ()=>{
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    },[]);

    return isOnline;
}

export default useOnlineStatus;