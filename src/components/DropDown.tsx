import { useEffect, useState } from "react"

interface Props {
    element: React.ReactNode
    children: React.ReactNode
}

export const DropDown = (props: Props) => {
    const [showDropDown, setShowDropDown] = useState(false)

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (event.target instanceof Element && !(event.target as Element).closest('.dropdown'))
                setShowDropDown(false)
        }

        document.addEventListener('click', listener)

        return () => document.removeEventListener('click', listener)
    }, [])

    return <div className="dropdown" onClick={() => setShowDropDown(!showDropDown)}>
        {props.element}
        {showDropDown && <div className="dropdown-content">
            {props.children}
        </div>}
    </div>
}