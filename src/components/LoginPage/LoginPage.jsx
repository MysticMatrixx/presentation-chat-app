import './LoginPage.css'

import { signInWithGoogle } from '../../firebase'


export function LoginPage() {
    return (
        <>
            <div className='login-container'>
                <div className='btn-container'>
                    <fieldset className='login-btns'>
                        <legend className='heading'>Log In</legend>

                        <button onClick={signInWithGoogle}>Google</button>
                        {/* <button>Anonymous</button> */}

                    </fieldset>
                </div>
            </div>
        </>
    )
}
