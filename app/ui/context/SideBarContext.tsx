"use client"

import { PropsWithChildren, createContext, useState } from 'react'
interface Store {
    isOpen: boolean,
    toggle(): void
}

const SideBarContext = createContext<Store>({} as Store)

const SideBarProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen)

    const sideBarContext = {
        isOpen,
        toggle
    }

    return <SideBarContext.Provider value={sideBarContext}>
        {children}
    </SideBarContext.Provider>
}

export { SideBarContext, SideBarProvider }

