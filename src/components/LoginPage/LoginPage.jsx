import { useState } from 'react'

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css'

export function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');

    const navigate = useNavigate()
    const { signInWithGoogle, createUserDoc } = useAuth();

    async function logIn() {
        try {
            setError('')
            setLoading(true)
            const logged = await signInWithGoogle()
            createUserDoc(logged)
            navigate('/')
        } catch (err) {
            if (err.code == "auth/popup-closed-by-user")
                setError("Please select a Google account to Login")
            else
                setError(() => "Failed to SignUp/LogIn, Try Again later")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='login-container'>
                <div className='btn-container'>
                    {error != '' && <p className='error'>{error}</p>}
                    <fieldset className='login-btns'>
                        <legend className='heading'>Log In</legend>

                        <button onClick={logIn} disabled={loading}>Google</button>
                        {/* <button>Anonymous</button> */}
                    </fieldset>
                </div>
            </div>
        </>
    )
}
