import { useSelector } from 'react-redux'

const useClients = () => {
    const data = useSelector((state) => state);
    return data;
}

export default useClients
