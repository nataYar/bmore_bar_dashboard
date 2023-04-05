import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { doc, addDoc, collection, arrayRemove, FieldValue, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const Hours = () => {
  const [hoursData, setHoursData] = useState([])
  const [newHoursData, setNewHoursData] = useState([])

  const docRef = doc(db, "timetables", "Ch66k2FI8s1I0w2DsJxI");

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

  useEffect(() => {
    const hours = onSnapshot((docRef), (doc) => {
      const arr = Object.values(doc.data()); //turn timetable obj into an array to iterate
      // const arr = doc.data();
      setHoursData(arr)
    })
  }, []);

  useEffect(() => {
    console.log(newHoursData)
  }, [newHoursData])

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

// const handleHourChange = (e, dayIndex, hourIndex) => {
//   const { value } = e.target;
//   setNewHoursData(prevData => {
//     const newData = [...prevData];
//     newData[dayIndex][hourIndex] = value;
//     return newData;
//   });
// };
const findInUpdated = (dayIndex, hourIndex) => {
  return newHoursData.some(item => item.dayIndex === dayIndex && item.hourIndex === hourIndex);
};


const handleHourChange = (e, dayIndex, hourIndex) => {
  const updatedHoursData = [...hoursData];
  updatedHoursData[dayIndex].hours[hourIndex] = e.target.value;
  setNewHoursData(updatedHoursData);
};

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      <div className='w-ful fixed z-10 bg-gray-100 py-2 drop-shadow-md rounded-lg'>
        <div className='w-screen h-auto px-4 flex justify-between lg:justify-end md:px-5'>
            <Link to="/">
                <svg className="w-9" data-name="Livello 1" id="home-icon" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <path d="M127.12,60.22,115.46,48.56h0L69,2.05a7,7,0,0,0-9.9,0L12.57,48.53h0L.88,60.22a3,3,0,0,0,4.24,4.24l6.57-6.57V121a7,7,0,0,0,7,7H46a7,7,0,0,0,7-7V81a1,1,0,0,1,1-1H74a1,1,0,0,1,1,1v40a7,7,0,0,0,7,7h27.34a7,7,0,0,0,7-7V57.92l6.54,6.54a3,3,0,0,0,4.24-4.24ZM110.34,121a1,1,0,0,1-1,1H82a1,1,0,0,1-1-1V81a7,7,0,0,0-7-7H54a7,7,0,0,0-7,7v40a1,1,0,0,1-1,1H18.69a1,1,0,0,1-1-1V51.9L63.29,6.29a1,1,0,0,1,1.41,0l45.63,45.63Z"/></svg>
            </Link>
            {/* <button 
              className={ newHoursData.length > 0? 
              "rounded-lg w-auto h-12 lg:ml-8 lg:w-40 cursor-pointer bg-yellow-400  text-black font-bold py-2 px-4": 
              "rounded-lg w-auto h-12 lg:ml-8 lg:w-40 cursor-not-allowed  bg-gray-300  text-white font-bold py-2 px-4"}   
              onClick={() => handleHoursSubmit()}
              >Save changes</button> */}
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
                      className='flex flex-row align-center justify-between mb-4  w-full' >
                        <input
                        type='text'
                        className='self-center p-1 w-40 border-gray-200 rounded-lg focus:border-gray-400'
                        value = {hour}
                        onChange = {(e) => handleHourChange(e, index, hourIndex)}
                        />
                              
                                <button 
                                  className="w-20 bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-1 rounded-lg"
                                  onClick={ () => handleAddLine(item, index, hourIndex) }
                                  >Add line</button>
                                  {
                                    item.hours.length > 1 ?
                                  <button
                                  className="w-20 h-9 border-2 border-purple-400 bg-white hover:border-purple-600 
                                  hover:text-purple-600 text-purple-400 py-1 px-1 rounded-lg font-bold"
                                  onClick={ () => handleDeleteLine(index, hourIndex) }
                                  >Delete</button>
                                  : null }
                                  
                             
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

// const findInUpdated = (item, index, hourIndex) => {
  //   const updatedItem = newHoursData.find(el => hoursData.indexOf(item) === index && item[hourIndex] === hoursData[index][hourIndex]);
  //       return updatedItem ? newHoursData[index][hourIndex] : undefined ;
  // }

  // const handleHoursSubmit = async() => {
  //   setNewHoursData([...hoursData])
  //     // Call update function to update data in the database
  //     await updateDoc(docRef, {
  //       hours: newHoursData,
  //     });
  //   }