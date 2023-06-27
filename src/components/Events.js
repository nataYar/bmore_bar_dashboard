import React, { useEffect, useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import { Link } from 'react-router-dom';
import { ref, deleteObject, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp
} from "firebase/firestore";


export const Events = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

  useEffect(() => {
    if ( !user ) {
      navigate('/');
    }
  }, [])

    const [selectedDate, setSelectedDate] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imagesData, setImagesData] = useState([]);
    const [pastEvents, setPastEvents] = useState([])
    const [futureEvents, setFutureEvents] = useState([])

    const now = new Date();

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
      };

    useEffect(() => {
        setPastEvents(imagesData.filter((event) => {
            const eventDate = event.timestamp.toDate();
            return eventDate < now;
            }))
        setFutureEvents(imagesData.filter((event) => {
            const eventDate = event.timestamp.toDate();
            return eventDate >= now;
            }))
    }, [imagesData])

    useEffect(() => {
        // Fetch the images data from Firestore
        const fetchImagesData = async () => {
          const eventsRef = collection(db, 'events');
          const eventsSnapshot = await getDocs(eventsRef);
          const eventsData = eventsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setImagesData(eventsData);
        };
    
        fetchImagesData();
      }, [imageUrl]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
      };

    const handleImageUpload = (event) => {
        event.preventDefault()
        if (!image) {
            return;
        }
    
        const storageRef = ref(storage, `images/${image.name}`);
        try {
            uploadBytes(storageRef, image)
            .then(() => {
                getDownloadURL(storageRef)
                .then(async (url) => {
                    setImageUrl(url);
                    const timestamp = Timestamp.fromDate(new Date(selectedDate));
                    const eventsRef = collection(db, 'events');
                    const docRef = await addDoc(eventsRef, { 
                        timestamp: timestamp,
                        imageUrl: url,
                        name: image.name
                    });
                    setImage(null);
                    setImageUrl(null);
                    setIsSuccess(true); // set isSuccess state to true
                })
                .catch((error) => {
                    console.log(error);
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteImage = async (id, index) => {
        const eventRef = doc(db, 'events', id);
        await deleteDoc(eventRef);
      
        setImagesData((prevState) => prevState.filter((event) => event.id !== id));
        setPastEvents((prevState) => prevState.filter((eventId) => eventId !== id));
        setFutureEvents((prevState) => prevState.filter((eventId) => eventId !== id));

        const imagesRef = ref(storage, "events/");
        const imageToDeleteRef = await listAll(imagesRef)
        .then((res) => res.items[index]);
        await deleteObject(imageToDeleteRef);
    };

  return (
    <div className="w-full flex flex-col items-center">
       <div className='w-ful fixed z-10 bg-gray-100 py-2 drop-shadow-md rounded-lg'>
        <div className='w-screen h-auto px-4 flex justify-between md:px-7'>
                <Link to="/">
                    <svg className="w-9" data-name="Livello 1" id="home-icon" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                    <path d="M127.12,60.22,115.46,48.56h0L69,2.05a7,7,0,0,0-9.9,0L12.57,48.53h0L.88,60.22a3,3,0,0,0,4.24,4.24l6.57-6.57V121a7,7,0,0,0,7,7H46a7,7,0,0,0,7-7V81a1,1,0,0,1,1-1H74a1,1,0,0,1,1,1v40a7,7,0,0,0,7,7h27.34a7,7,0,0,0,7-7V57.92l6.54,6.54a3,3,0,0,0,4.24-4.24ZM110.34,121a1,1,0,0,1-1,1H82a1,1,0,0,1-1-1V81a7,7,0,0,0-7-7H54a7,7,0,0,0-7,7v40a1,1,0,0,1-1,1H18.69a1,1,0,0,1-1-1V51.9L63.29,6.29a1,1,0,0,1,1.41,0l45.63,45.63Z"/></svg>
                </Link>
            </div>
        </div>
        {/* UPLOAD NEW EVENT */}
        <div className='w-full px-5 mt-20 flex flex-col'>
            <div className="w-full flex flex-col md:flex-row md:justify-between">
                 {/* upload a picture */}
                 <div className='w-full md:w-2/5 h-auto '>
                    <input className="w-full bg-white border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base text-black font-normal transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-black file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none rounded-lg"  type="file" onChange={handleImageChange} />
                 </div>
               
                {/*set a date*/}
                <div className='md:w-2/5 flex flex-col  md:flex-row my-4 md:my-0 md:mb-4'>
                    <label className="leading-10 mr-4" htmlFor="date-input">Date:</label>
                    <input 
                    className="w-full border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none rounded-lg" 
                    type="date" id="date-input" value={selectedDate} onChange={handleDateChange} />
                </div>
            </div>
           
            {/* button to submit to db */}
            <button className=" h-12 w-fit bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg self-center mt-12" onClick={handleImageUpload}>Add an event</button>
            
            {isSuccess && <p className='text-purple-500 mt-5 text-center'>Image uploaded!</p>} {/* display the message if isSuccess is true */}
        </div>
        
        <div className='mt-10 flex flex-col items-center w-full my-10 bg-white px-2.5 py-4 rounded-lg'>
            <h2 className='mb-10 text-lg uppercase text-purple-500 font-bold'>Future events</h2>
            <div className='flex flex-col md:flex-row gap-10'>
                {
                futureEvents.map((image, index) => (
                <div key={image.id}
                className="mb-10" >
                    <img className='md:max-h-96' src={image.imageUrl} alt={`Event ${image.id}`} />
                    <p className='my-2'>{image.name}</p>
                    <p>{image.timestamp.toDate().toLocaleString()}</p>
                    <button 
                        className="border-2 border-purple-400 bg-white hover:border-purple-600 
                        hover:text-purple-600 text-purple-400 py-2 px-4 rounded-lg font-bold my-5"
                        onClick={ () => handleDeleteImage(image.id, index) }>Delete</button>
                </div>
                ))
                }
            </div>
           
        </div>
        
        <div className='mt-10 flex flex-col items-center w-full my-10 bg-white px-2.5 py-4 rounded-lg'>
            <h2 className='mb-10 text-lg uppercase text-purple-500 font-bold'>Past events</h2>
            <div className='flex flex-col md:flex-row gap-10'>
            {
                pastEvents.map((image) => (
                <div key={image.id}
                className="mb-10">
                    <img className='md:max-h-96' src={image.imageUrl} alt={`Event ${image.id}`} />
                    <p className='my-2'>{image.name}</p>
                    <p>{image.timestamp.toDate().toLocaleString()}</p>
                    <button 
                        className="border-2 border-purple-400 bg-white hover:border-purple-600 
                        hover:text-purple-600 text-purple-400 py-2 px-4 rounded-lg font-bold my-5"
                        onClick={ () => handleDeleteImage(image.id) }>Delete</button>
                </div>
                ))
                }
            </div>
        </div>
    </div>
  )
}
