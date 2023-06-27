import React, { useEffect, useState, useContext  } from 'react'
import { Link } from 'react-router-dom';
import UserContext from './UserContext';
import { useNavigate } from 'react-router-dom';

import { ref, deleteObject, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import {
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

export const Gallery = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [newImage, setNewImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imagesData, setImagesData] = useState([]);

  useEffect(() => {
    if ( !user ) {
      navigate('/');
    }
  }, [])
  
  useEffect(() => {
    const eventsRef = collection(db, 'gallery');
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImagesData(data);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log(imagesData)
  }, [imagesData])

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
      const storageRef = ref(storage, `gallery/${newImage.name}`);
      try {
          uploadBytes(storageRef, newImage)
          .then(() => {
            getDownloadURL(storageRef)
            .then(async (url) => {
                const eventsRef = collection(db, 'gallery');
                const docRef = await addDoc(eventsRef, { 
                    url: url,
                    name: newImage.name
                });
                setNewImage(null);
                setIsSuccess(true); // set isSuccess state to true
            })
            .catch((error) => {
                console.log(error);
            });
        });
      } 
      catch (error) {
          console.log(error);
      }
  };

  const handleDeleteClick = async (id, index) => {
    try {
        const eventRef = doc(db, 'gallery', id);
        await deleteDoc(eventRef);
        setImagesData((prevState) => prevState.filter((event) => event.id !== id));

        const imagesRef = ref(storage, "gallery/");
        const imageToDeleteRef = await listAll(imagesRef)
        .then((res) => res.items[index]);
        await deleteObject(imageToDeleteRef);
        
      } catch (error) {
        console.log(error);
      } 
  };

  return (
     <div className="w-full flex flex-col items-center">
        <div className='w-ful fixed z-10 bg-gray-100 py-2 drop-shadow-md rounded-lg'>
            <div className='w-screen h-auto px-4 flex justify-between lg:justify-start md:px-7'>
                <Link to="/">
                    <svg className="w-9" data-name="Livello 1" id="home-icon" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                    <path d="M127.12,60.22,115.46,48.56h0L69,2.05a7,7,0,0,0-9.9,0L12.57,48.53h0L.88,60.22a3,3,0,0,0,4.24,4.24l6.57-6.57V121a7,7,0,0,0,7,7H46a7,7,0,0,0,7-7V81a1,1,0,0,1,1-1H74a1,1,0,0,1,1,1v40a7,7,0,0,0,7,7h27.34a7,7,0,0,0,7-7V57.92l6.54,6.54a3,3,0,0,0,4.24-4.24ZM110.34,121a1,1,0,0,1-1,1H82a1,1,0,0,1-1-1V81a7,7,0,0,0-7-7H54a7,7,0,0,0-7,7v40a1,1,0,0,1-1,1H18.69a1,1,0,0,1-1-1V51.9L63.29,6.29a1,1,0,0,1,1.41,0l45.63,45.63Z"/></svg>
                </Link>
            </div>
        </div>
        <div className='w-full px-5 mt-20 flex flex-col bg-white'>
          <label 
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white rounded-lg " forhtml="file_input">Upload file</label>
          <input 
          className="block w-full mx-2 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none " id="file_input" 
          type="file"
          onChange={ handleImageChange}  />
        {
            newImage ? 
            <button  
            className="w-20 bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-1 rounded-lg mx-auto mt-4 mb-8"
            onClick={(e) => handleImageUpload(e)} 
            >Add </button> 
            : null
        }
        </div>
        {isSuccess ? <p className='my-4'>Successfully uploaded</p> : null}
        
        <div className="flex flex-row flex-wrap justify-evenly w-full gap-2 p-5 bg-white" >
          {
            imagesData.map((image, ind) => (
            <div className='w-2/5 md:w-1/3 lg:w-1/4'
            key={ind}>
                <img className='w-full' src={image.url}  />
                <p>{image.name}</p>
                <button 
                className="w-20 h-9 border-2 border-purple-400 bg-white hover:border-purple-600 
                hover:text-purple-600 text-purple-400 py-1 px-1 rounded-lg font-bold"
                onClick={() => handleDeleteClick(image.id, ind)} 
                >
                Delete
                </button>
            </div>
            ))
          }
        </div>
    </div>
  )
}
