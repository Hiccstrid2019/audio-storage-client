import {useLayoutEffect, useState} from "react";

const queries = [
    '(max-width: 767px)',
    '(min-width: 768px) and (max-width: 1023px)',
    '(min-width: 1024px)'
]

interface Devices {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

export const useMatchMedia = () : Devices => {
    const mediaQueryLists = queries.map(query => matchMedia(query));
    const getValues = () => mediaQueryLists.map(mql => mql.matches);
    const [values, setValues] = useState(getValues);

    useLayoutEffect(() => {
        const handler = () => setValues(getValues);

        mediaQueryLists.forEach(mql => mql.addEventListener("change", handler));

        return () => mediaQueryLists.forEach(mql => mql.removeEventListener("change", handler));
    })

    return ['isMobile', 'isTablet', 'isDesktop'].reduce((acc, screen, index) => ({
        ...acc,
        [screen]: values[index]
    }), {isMobile: false, isTablet: false, isDesktop: false});
}
