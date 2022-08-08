import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {createPortal} from 'react-dom'

const Portal: React.FC = ({ children }) => {

    const [mounted, setMounted] = useState(false)
    const ref: any = useRef<HTMLDivElement>(null)

    useEffect(() => {
        ref.current = document.createElement('div');
        ref.current.setAttribute("id", 'popup');
        document.body.appendChild(ref.current);
        setMounted(true);
        return () => {
            document.body.removeChild(ref.current)
        };
    }, [])

    return mounted ? createPortal(children, ref.current) : null
};

export default Portal;


