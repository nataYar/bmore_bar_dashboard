import React, { useEffect, useState } from 'react'
// import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

export const Gallery = () => {
    const [image, setImage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [picUrls, setPicUrls] = useState([])

    useEffect(() => {
        const imagesRef = ref(storage, "gallery/");
        listAll(imagesRef)
          .then((res) => {
            console.log(res.items);
            const promises = res.items.map((itemRef) => getDownloadURL(itemRef));
            //wait for all the download URL promises to resolve
            Promise.all(promises).then((urls) => {
              setPicUrls(urls);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
      };

    const handleImageUpload = (event) => {
        event.preventDefault()
        if (!image) {
            return;
        }
        const storageRef = ref(storage, `gallery/${image.name}`);
        try {
            uploadBytes(storageRef, image)
            .then(() => {
                setIsSuccess(true); // set isSuccess state to true
            });
        } catch (error) {
            console.log(error);
        }
    };

  return (
     <div className="w-full bg-gray-100 flex flex-col items-center">
        <div className='w-ful fixed z-10 bg-gray-100 py-2 drop-shadow-md rounded-lg'>
            <div className='w-screen h-auto px-4 flex justify-between lg:justify-start md:px-7'>
                <Link to="/">
                    <svg className="w-9" data-name="Livello 1" id="home-icon" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                    <path d="M127.12,60.22,115.46,48.56h0L69,2.05a7,7,0,0,0-9.9,0L12.57,48.53h0L.88,60.22a3,3,0,0,0,4.24,4.24l6.57-6.57V121a7,7,0,0,0,7,7H46a7,7,0,0,0,7-7V81a1,1,0,0,1,1-1H74a1,1,0,0,1,1,1v40a7,7,0,0,0,7,7h27.34a7,7,0,0,0,7-7V57.92l6.54,6.54a3,3,0,0,0,4.24-4.24ZM110.34,121a1,1,0,0,1-1,1H82a1,1,0,0,1-1-1V81a7,7,0,0,0-7-7H54a7,7,0,0,0-7,7v40a1,1,0,0,1-1,1H18.69a1,1,0,0,1-1-1V51.9L63.29,6.29a1,1,0,0,1,1.41,0l45.63,45.63Z"/></svg>
                </Link>
            </div>
        </div>
        <div className='w-full px-5 mt-20 flex flex-col'>
        <input className='text-purple-500' type="file" onChange={handleImageChange} />
        </div>
        <div className="flex flex-wrap justify-evenly w-full h-auto gap-2 flex-row p-5" >
        {
            picUrls.map((image, ind) => (
              
            <img className='md:w-5/12 lg:w-64' src={image}  />
            ))
            }
        </div>
    </div>
  )
}
