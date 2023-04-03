import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const Events = () => {
  const [startDate, setStartDate] = useState(new Date())
  
//   const MyContainer = ({ className, children }) => {
//     return (
//       <div style={{ padding: "16px", background: "#216ba5", color: "#fff" }}>
//         <CalendarContainer className={className}>
//           <div style={{ background: "#f0f0f0" }}>
//             What is your favorite day?
//           </div>
//           <div style={{ position: "relative" }}>{children}</div>
//         </CalendarContainer>
//       </div>
//     );
//   };

useEffect(() => {
    console.log(startDate)
}, [startDate])

  return (
    <div className="w-full bg-gray-100 flex flex-col items-center">
        <div className='w-ful fixed z-10 bg-gray-100 py-2 drop-shadow-md rounded-lg'>
            <div className='w-screen h-auto px-4 flex justify-between lg:justify-end md:px-7'>
                <Link to="/">
                    <svg className="w-9" data-name="Livello 1" id="home-icon" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                    <path d="M127.12,60.22,115.46,48.56h0L69,2.05a7,7,0,0,0-9.9,0L12.57,48.53h0L.88,60.22a3,3,0,0,0,4.24,4.24l6.57-6.57V121a7,7,0,0,0,7,7H46a7,7,0,0,0,7-7V81a1,1,0,0,1,1-1H74a1,1,0,0,1,1,1v40a7,7,0,0,0,7,7h27.34a7,7,0,0,0,7-7V57.92l6.54,6.54a3,3,0,0,0,4.24-4.24ZM110.34,121a1,1,0,0,1-1,1H82a1,1,0,0,1-1-1V81a7,7,0,0,0-7-7H54a7,7,0,0,0-7,7v40a1,1,0,0,1-1,1H18.69a1,1,0,0,1-1-1V51.9L63.29,6.29a1,1,0,0,1,1.41,0l45.63,45.63Z"/></svg>
                    </Link>
                {/* <div className='h-full w-full flex justify-between md:justify-end ml-10'>
                <button 
                className="w-auto lg:w-40 h-12  bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={ () => addNewCategory() }>Add category</button>
                <button 
                className={ updatedCategories.length >0 || updatedItems.length >0 ? 
                "bg-yellow-400 hover:bg-yellow-500 w-auto h-12 lg:w-40 rounded-lg text-black font-bold lg:ml-8 " : 
                "rounded-lg w-auto h-12 lg:ml-8 lg:w-40 cursor-not-allowed  bg-gray-300  text-white font-bold py-2 px-4"}   
                onClick={() => handleSubmit()}
                >Save changes</button>
                </div> */}
            </div>
        </div>
        <div className='w-full px-5 mt-14'>
        <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            // calendarContainer={MyContainer}
            />
        </div>
        
    </div>
  )
}
