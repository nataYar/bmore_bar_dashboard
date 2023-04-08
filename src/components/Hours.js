import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';



export const Hours = () => {
  const [hoursData, setHoursData] = useState([])
  const [newHoursData, setNewHoursData] = useState([])

  // const addTimetableToFirestore = async (timetable) => {
  //   try {
  //     // Add timetable to "timetables" collection
  //     const docRef = await addDoc(collection(db, "timetables"), timetable);
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // }
  // useEffect(() => {
  //   addTimetableToFirestore(timetable)
  // }, [])

  const docRef = doc(db, "timetables", "962LKFZGLVmskojBZPAh");

  useEffect(() => {
    const hours = onSnapshot((docRef), (doc) => {
      const arr = Object.values(doc.data()); //turn timetable obj into an array to iterate
      // const arr = doc.data();
      setHoursData(arr)
    })
  }, []);

  const handleDeleteLine = async (dayIndex, hourIndex) => {
    // create a new array without the deleted hour
    const newHours = [...hoursData[dayIndex].hours];
    newHours.splice(hourIndex, 1); //(start, deleteCount)

    // update the hours field in the corresponding document in db
    await updateDoc(docRef, {
      [`${dayIndex}.hours`]: newHours
    });
  };

  const handleAddLine = async (item, index, hourIndex) => {
  const newHours = hoursData[index].hours
  newHours.push('')
  console.log(newHours)
  // update the `hours` field in the corresponding document in Firestore
  await updateDoc(docRef, {
    [`${index}.hours`]: newHours,
  });
};

const handleHoursSubmit = async () => {
  try {
    // create a new object with the updated hours data
    const updatedHours = {};
    hoursData.forEach((item, index) => {
      updatedHours[index] = {
        day: item.day,
        hours: newHoursData[index].hours,
      };
    });

    // update the entire document with the new hours data
    await setDoc(docRef, updatedHours);

    console.log("Hours data updated successfully!");
  } catch (error) {
    console.error("Error updating hours data: ", error);
  }
};

const handleHourChange = (e, dayIndex, hourIndex) => {
  const updatedHoursData = [...hoursData];
  updatedHoursData[dayIndex].hours[hourIndex] = e.target.value;
  setNewHoursData(updatedHoursData);
};

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      <div className='w-ful fixed z-10 bg-gray-100 py-2 drop-shadow-md rounded-lg'>
        <div className='w-screen h-auto px-4 flex justify-between md:px-7'>
            <Link to="/">
                <svg className="w-9" data-name="Livello 1" id="home-icon" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <path d="M127.12,60.22,115.46,48.56h0L69,2.05a7,7,0,0,0-9.9,0L12.57,48.53h0L.88,60.22a3,3,0,0,0,4.24,4.24l6.57-6.57V121a7,7,0,0,0,7,7H46a7,7,0,0,0,7-7V81a1,1,0,0,1,1-1H74a1,1,0,0,1,1,1v40a7,7,0,0,0,7,7h27.34a7,7,0,0,0,7-7V57.92l6.54,6.54a3,3,0,0,0,4.24-4.24ZM110.34,121a1,1,0,0,1-1,1H82a1,1,0,0,1-1-1V81a7,7,0,0,0-7-7H54a7,7,0,0,0-7,7v40a1,1,0,0,1-1,1H18.69a1,1,0,0,1-1-1V51.9L63.29,6.29a1,1,0,0,1,1.41,0l45.63,45.63Z"/></svg>
            </Link>
            <button 
              className={ newHoursData.length > 0? 
              "rounded-lg w-auto h-12 lg:ml-8 lg:w-40 cursor-pointer bg-yellow-400  text-black font-bold py-2 px-4": 
              "rounded-lg w-auto h-12 lg:ml-8 lg:w-40 cursor-not-allowed  bg-gray-300  text-white font-bold py-2 px-4"}   
              onClick={() => handleHoursSubmit()}
              >Save changes</button>
        </div>
      </div>
      <div className='w-full md:w-1/2 lg:w-2/5 px-5 mt-20 mb-5 pt-5 bg-white rounded-lg mx-4'>
        <h2 className='mb-10 text-lg uppercase text-purple-500 font-bold text-center'>Opening Hours</h2>
        <div className="flex flex-col" id="hours">
           {
            hoursData.map((item, index) => (
              <div 
              className='flex flex-row mb-4'
              key={index}>
                <p className='w-1/4 font-bold'>{item.day}</p>
                <div className='flex flex-col items-start w-3/4 '>
                  {
                    item.hours.map((hour, hourIndex) => (
                    <div 
                      key={hourIndex}
                      className='flex flex-col align-center justify-between mb-4  w-full' >
                        <input
                        type='text'
                        className='self-center p-1 w-full border-gray-200 rounded-lg focus:border-gray-400'
                        value = {hour}
                        onChange = {(e) => handleHourChange(e, index, hourIndex)}
                        />
                              <div className='flex flex-row align-center justify-end mt-4'>
                                  {
                                    item.hours.length > 1 ?
                                  <button
                                  className="w-20 h-9 border-2 border-purple-400 bg-white hover:border-purple-600 
                                  hover:text-purple-600 text-purple-400 py-1 px-1 rounded-lg font-bold"
                                  onClick={ () => handleDeleteLine(index, hourIndex) }
                                  >Delete</button>
                                  : null }
                                  <button 
                                  className="w-20 bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-1 rounded-lg ml-4"
                                  onClick={ () => handleAddLine(item, index, hourIndex) }
                                  >Add line</button>
                              </div>
                                
                                  
                             
                      </div>
                      ))
                    }

                </div>
              </div>
            ))
           }

        </div>
      </div>  
    </div>
  )
}