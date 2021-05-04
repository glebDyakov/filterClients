import { useSelector } from 'react-redux'

const useStaffs = () => {
    const data = useSelector((state) => state.staff);
    return data;
}

export default useStaffs
