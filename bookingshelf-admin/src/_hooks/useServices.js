import { useSelector } from 'react-redux'

const useServices = () => {
    const data = useSelector((state) => state.services);
    console.log(data);
    return data;
}

export default useServices;
