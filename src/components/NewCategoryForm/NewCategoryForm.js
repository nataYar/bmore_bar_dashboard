import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from '../../firebaseConfig';

const NewCategoryForm = () => {
  const [categoryNew, setCategoryNew] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);

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
        items: [],
      });
      console.log("New category added with ID: ", docRef.id);
      // reset form values
      setCategoryNew("");
      setPrice("");
      setNote("");
      setError(null);
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      <label htmlFor="categoryNew">Category Name:</label>
      <input
        type="text"
        id="categoryNew"
        value={categoryNew}
        onChange={(e) => setCategoryNew(e.target.value)}
        required
      />
      <label htmlFor="price">Price:</label>
      <input
        type="number"
        id="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <label htmlFor="note">Note:</label>
      <input
        type="text"
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit">Add Category</button>
    </form>
  );
};

export default NewCategoryForm;
