import { Navigate, Route, redirect } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function PrivateRoute({ children }) {
    const { currentUser } = useAuth()

    if (!currentUser)
        return <Navigate to={'/auth'} />

    return children

    // return (
    //     <Route
    //         {...rest}
    //         render={props => {
    //             return currentUser ? <Component {...props} /> : <Navigate to={'/auth'} />
    //         }}
    //     ></Route>
    // )
}
