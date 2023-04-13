import React,  { useState , useEffect, useRef, useContext }  from 'react';
import '../styles.css';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import UserContext from './UserContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user, setUser } = useContext(UserContext);

  const [checked, setChecked] = useState(false);

  const passwordInputRef = useRef(null);

  useEffect(() => {
    const passwordInput = passwordInputRef.current;
    if (checked) {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }, [checked]);

  const handlePasswordReset = () => {
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert('Password reset email sent!');
        })
        .catch((error) => {
          console.log(error);
          alert('Error resetting password.');
        });
    } else {
      alert('Please enter your email address.');
    }
  };
    
    const loginFn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const usr = userCredential.user;
        setUser(usr.uid); //save user in context
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage)
        alert('no user found')
        });
    }

    useEffect(() => {
      if (user) {
        navigate('/dashboard');
      }
    }, [user, navigate])

    return (
        <div className='h-screen w-screen flex flex-row  justify-center items-center'>
            <form className='flex flex-col h-auto w-1/2 md:w-80' onSubmit={(e) => loginFn(e)} >
                <input 
                className='mb-8 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                type='text' placeholder='Username'
                onChange={(e) => setEmail(e.target.value)}
                value={email} />

                <input 
                  ref={passwordInputRef} 
                  className='mb-8 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300  rounded-md'
                  type='password' placeholder='Password'
                  id="password-input"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password} />
                
                <div className="w-full flex flex-row justify-between" >
                  <label 
                  htmlFor="password-toggle" 
                  className="text-gray-700">Show password</label>
                  <input 
                  id="password-toggle" 
                  type="checkbox" 
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  className="form-checkbox h-5 w-5 text-purple-600 border-gray-300  rounded-md"/>
                </div>
                
                <button 
                className="mt-12 h-12 w-auto bg-purple-500 text-white font-bold py-2 px-4 rounded-lg md:w-20 mx-auto"
                id="submit" 
                type="submit">Login</button>

                <button className="absolute -translate-x-1/2 left-1/2 bottom-8 h-12 w-auto bg-white text-gray-700 font-bold py-2 px-4 rounded-lg mx-auto" onClick={handlePasswordReset}>Reset password</button>
                
            </form>
        </div> 
    )
}