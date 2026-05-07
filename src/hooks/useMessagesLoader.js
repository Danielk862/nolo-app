import { useEffect } from 'react';
import { useLoader } from '../context/LoadingContext';

export default function UseMessagesLoader(messages) {
    const { showLoader, hideLoader } = useLoader();
    useEffect(() => {
    showLoader(messages.length > 0 ? messages : 'Cargando...');

    const timer = setTimeout(() => {
        hideLoader();
    }, 1000);

    return () => {
        clearTimeout(timer);
        hideLoader();
    };
    }, []);
}
