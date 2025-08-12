import { createContext, useState }from 'react'

const SidebarContext = createContext()

const SidebarContextProvider = ({children})=>{

    const [isOpen, setIsOpen] = useState('HALF')

    const updateIsOpen=(MENU)=>{
        console.log('working', MENU)
        setIsOpen(MENU)
    }

    return(
        <SidebarContext.Provider value={{updateIsOpen, isOpen}}>
            {children}
        </SidebarContext.Provider>
    )
}

export {SidebarContext, SidebarContextProvider}