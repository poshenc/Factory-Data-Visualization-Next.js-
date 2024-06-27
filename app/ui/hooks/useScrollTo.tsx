import { MutableRefObject, useEffect } from "react";

export function useScrollTo(ref: MutableRefObject<any>, dependency: any) {
    useEffect(() => {
        if (ref && dependency) {
            ref.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [dependency, ref])
}