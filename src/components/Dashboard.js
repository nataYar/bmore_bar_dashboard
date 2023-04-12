import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import UserContext from './UserContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
  
    useEffect(() => {
      if ( !user ) {
        navigate('/');
      }
    }, [])

  return (
    <div className="w-full h-screen bg-gray-100 py-60 flex flex-col justify-evenly items-center">
        <Link to="/menu">
            <button className='uppercase text-lg'>Menu
            <svg aria-hidden="true" className="mr-auto ml-auto block w-6 h-6" fill="#9333ea" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </Link>
        <Link to="/events">
            <button className='uppercase text-lg'>Events 
            <svg aria-hidden="true" className="w-6 h-6 mr-auto ml-auto block " fill="#9333ea" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </Link>
        <Link to="/hours">
            <div className='flex flex-col items-center content-center justify-center'>
                <button className='uppercase text-lg'>Hours
                <svg aria-hidden="true" className="w-6 h-6 mr-auto ml-auto block " fill="#9333ea" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>
        </Link>
        <Link to="/gallery">
            <div className='flex flex-col items-center content-center justify-center'>
                <button className='uppercase text-lg'>Gallery
                <svg aria-hidden="true" className="w-6 h-6 mr-auto ml-auto block " fill="#9333ea" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>
        </Link>
    </div>
  )
}
