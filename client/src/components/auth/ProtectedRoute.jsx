import {useRecoilValue} from "recoil"
import {isAuthenticatedSelector} from "../../state/selectors/authSelector.js"
import {useNavigate} from "react-router-dom"

const ProtectedRoute = ({children})=>{
    const isAuthenticated = useRecoilValue(isAuthenticatedSelector)
    const navigate = useNavigate();

    if(!isAuthenticated){
        return navigate("/authPage")
    }
    
    return children;
}

export default ProtectedRoute;