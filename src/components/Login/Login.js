import React,  { useState }  from 'react';
import './Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Dashboard from '../Dashboard/Dashboard';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useLocalStorage( "id", "")

    // Hook
  function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.log(error);
        return initialValue;
      }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    };
    return [storedValue, setValue];
  }

    const loginFn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setName(user.uid)
        console.log('successful log in')
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage)
        alert('no user found')
        });
    }

    return (
        <div>
            { name ?  
                <Dashboard /> 
            : 
            <div className='login-container'>
                <form className='login' onSubmit={(e) => loginFn(e)} >
                    <input type='text' placeholder='Username'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email} />

                    <input type='password' placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password} />
                    <button id="submit" type="submit">Login</button>
                </form>
            </div> 
            }
        </div>
        
    )
}
