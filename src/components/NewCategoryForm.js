import React, { useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from '../firebaseConfig';

const NewCategoryForm = ({ toggleNewCategoryForm }) => {
  const [categoryNew, setCategoryNew] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [selectedOption, setSelectedOption] = useState("food");
  const [error, setError] = useState(null);

  // const toggleVisibility = () => {toggleNewCategoryForm()} 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // check if category name already exists
      const categoriesRef = collection(db, "categories");
      const queryRef = query(categoriesRef, where("name", "==", categoryNew));
      const existingCategories = await getDocs(queryRef);
      if (!existingCategories.empty) {
        setError("Category name already exists");
        return;
      }

      // add new category to database
      const docRef = await addDoc(categoriesRef, {
        name: categoryNew,
        price: price,
        note: note,
        category: selectedOption,
        items: [],
      });
      console.log("New category added with ID: ", docRef.id);
      // reset form values
      setCategoryNew("");
      setSelectedOption("")
      setPrice("");
      setNote("");
      setError(null);
      toggleNewCategoryForm()
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  return (
    <form 
    className="rounded-lg w-full bg-gray-100 flex flex-col items-start px-5 py-5"
    onSubmit={handleSubmit}>
      <div className="lg:w-2/3 w-full mr-auto ml-auto">
      {error && <div>{error}</div>}
      <label className="mb-4 text-gray-900" htmlFor="categoryNew">New category name:</label>
      <input
       className='mb-4 bg-gray-50  border-gray-500 focus:border-gray-500  text-gray-900 focus:ring-gray-500  block w-full p-2.5 rounded-lg'
        type="text"
        id="categoryNew"
        value={categoryNew}
        onChange={(e) => setCategoryNew(e.target.value)}
        required
      />
      <label className="mb-4 text-gray-900" htmlFor="price">Price:</label>
      <input
         className='mb-4 bg-gray-50  border-gray-500 focus:border-gray-500  text-gray-900 focus:ring-gray-500  block w-full p-2.5 rounded-lg'
        type="text"
        id="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      
      />
      <label className="mb-4 text-gray-900"  htmlFor="note">Notes (will be displayed under the category name)</label>
      <input
         className='mb-4 bg-gray-50  border-gray-500 focus:border-gray-500  text-gray-900 focus:ring-gray-500  block w-full p-2.5 rounded-lg'
        type="text"
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex flex-col justify-center mb-3 w-full items-baseline ">
        <label 
        className="mb-4 text-gray-900" 
        htmlFor="category">Select a category:</label>
        <select 
         className='mb-4 bg-gray-50 focus:border-gray-500  border-gray-500  text-gray-900 focus:ring-gray-500  block w-full p-2.5 rounded-lg'
        id="category" value={selectedOption} onChange={(e) =>  setSelectedOption(e.target.value)} >
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>
      </div>
      <button 
       className="bg-yellow-400 hover:bg-yellow-500 w-5/12 h-12 rounded-lg text-black font-bold lg:w-auto lg:py-2 lg:px-4" 
      >Add Category</button>
      </div>
    </form>
  );
};

export default NewCategoryForm;
