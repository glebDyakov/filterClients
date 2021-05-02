import { useSelector } from 'react-redux'

const useServices = () => {
    const data = useSelector((state) => state.services);
    return data;
}

export default useServices;
