import React,  { useState , useEffect, useRef, useContext }  from 'react';
import '../styles.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
            <form className='flex flex-col h-auto w-1/2' onSubmit={(e) => loginFn(e)} >
                <input 
                className='mb-8 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                type='text' placeholder='Username'
                onChange={(e) => setEmail(e.target.value)}
                value={email} />

                <input 
                  ref={passwordInputRef} 
                  className='mb-8 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
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
                  className="form-checkbox h-5 w-5 text-purple-600"/>
                </div>
                
                <button 
                className="mt-12 h-12 w-auto bg-purple-500 text-black font-bold py-2 px-4 rounded-lg "
                id="submit" 
                type="submit">Login</button>
            </form>
        </div> 
    )
}


  // Hook
  // function useLocalStorage(key, initialValue) {
  //   // State to store our value
  //   // Pass initial state function to useState so logic is only executed once
  //   const [storedValue, setStoredValue] = useState(() => {
  //     if (typeof window === "undefined") {
  //       return initialValue;
  //     }
  //     try {
  //       // Get from local storage by key
  //       const item = window.localStorage.getItem(key);
  //       // Parse stored json or if none return initialValue
  //       return item ? JSON.parse(item) : initialValue;
  //     } catch (error) {
  //       // If error also return initialValue
  //       console.log(error);
  //       return initialValue;
  //     }
  //   });
  //   // Return a wrapped version of useState's setter function that ...
  //   // ... persists the new value to localStorage.
  //   const setValue = (value) => {
  //     try {
  //       // Allow value to be a function so we have same API as useState
  //       const valueToStore =
  //         value instanceof Function ? value(storedValue) : value;
  //       // Save state
  //       setStoredValue(valueToStore);
  //       // Save to local storage
  //       if (typeof window !== "undefined") {
  //         window.localStorage.setItem(key, JSON.stringify(valueToStore));
  //       }
  //     } catch (error) {
  //       // A more advanced implementation would handle the error case
  //       console.log(error);
  //     }
  //   };
  //   return [storedValue, setValue];
  // }