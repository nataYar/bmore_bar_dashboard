import React , { useState }from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebaseConfig';
import {
    doc,
    updateDoc,
    
  } from "firebase/firestore";

export const AddItem = ({ category }) => {
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
  
    const handleAddItem = async () => {
      const itemToAdd = { 
        name: itemName, 
        description: itemDescription, 
        id: uuidv4() };
      const categoryDocRef = doc(db, "categories", category.id);
      await updateDoc(categoryDocRef, {
        items: [...category.items, itemToAdd],
      });
      setItemName("");
      setItemDescription("");
    };

  return ( 
    <div className=' w-full pb-5 flex flex-col items-start mt-6 mb-10 shadow-md rounded-lg'>
      <input
          className='mb-4 bg-gray-50  border-gray-500 focus:border-gray-500  text-gray-900 focus:ring-gray-500  block w-full p-2.5 rounded-lg'
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="New Item Name"
      />
      <input
          className='mb-4 bg-gray-50  border-gray-500 focus:border-gray-500  text-gray-900 focus:ring-gray-500  block w-full p-2.5 rounded-lg'
          type="text"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          placeholder="New Item Description"
      />
      <button 
      className="bg-yellow-400 hover:bg-yellow-500 w-5/12 h-12 rounded-lg text-black font-bold lg:w-auto lg:py-2 lg:px-4 " 
      onClick={handleAddItem}>Add Item</button>
    </div>
  )
}

