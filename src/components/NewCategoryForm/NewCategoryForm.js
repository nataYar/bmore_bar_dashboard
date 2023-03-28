import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, doc, setDoc,  addDoc, onSnapshot } from "firebase/firestore";

const NewCategoryForm = () => {
  const [collectionName, setCollectionName] = useState('food');
  const [categoryName, setCategoryName] = useState('');
  const [categoryAddition, setCategoryAddition] = useState('');
  const [mainText, setMainText] = useState('');
  const [price, setPrice] = useState("");
  const [existingCategories, setExistingCategories] = useState([]);
  const [items, setItems] = useState([]);

  // Load existing categories on component mount
  useEffect(() => {
    // const q = query(collection(db, collectionName));
    const q = collection(db, 'food');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categories = querySnapshot.docs.map((doc) => doc.id);
      setExistingCategories(categories);
    });
    return () => unsubscribe();
  }, [collectionName]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting normally

    // Check if category with the same name already exists in the selected collection
    if (existingCategories.includes(categoryName)) {
      alert(`Category with name ${categoryName} already exists in ${collectionName} collection!`);
      return;
    }

    const newCatRef = doc(db, `${collectionName}/${categoryName}`);
    await setDoc(newCatRef, {
      price: price,
      addition: categoryAddition,
    }, {merge: true})

    const itemsCollectionRef = collection(db, `${collectionName}/${categoryName}/items`);

    const itemDocRef = await addDoc(itemsCollectionRef, {
      mainText: mainText,
      createdAt: new Date().toString()
    }, { merge: true });

    // Reset the form input values
    setCategoryName('');
    setCategoryAddition('');
    setMainText('');
    setPrice('');
  };

  // Function to handle category name input changes
  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleCategoryAdditionChange = (e) => {
    setCategoryAddition(e.target.value);
  };



  // Function to handle main text input changes
  const handleMainTextChange = (e) => {
    setMainText(e.target.value);
  };

   // Function to handle price input changes
   const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  // Function to handle collection name dropdown changes
  const handleCollectionNameChange = (e) => {
    setCollectionName(e.target.value);
  };


  return (
    <>
     <form onSubmit={handleSubmit}>
      <label>
        Collection Name:
        <select value={collectionName} onChange={handleCollectionNameChange}>
          <option value="food">Food</option>
          <option value="drinks">Drinks</option>
        </select>
      </label>
      <label>
        Existing Category Name:
        <select value={categoryName} onChange={handleCategoryNameChange}>
          <option value="">Select an existing category...</option>
          {existingCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label>
        New Category Name:
        <input type="text" value={categoryName} onChange={handleCategoryNameChange} />
      </label>
      <label>
        Any extra text:
        <input type="text" value={categoryAddition} onChange={handleCategoryAdditionChange} />
      </label>
      <label>
        Price:
        <input type="number" value={price} onChange={handlePriceChange} />
      </label>
      <label>
        Main Text:
        <input type="text" value={mainText} onChange={handleMainTextChange} />
      </label>
      <button type="submit">Add to Menu</button>
    </form>
  

        {/* <input className="form-control" type="text" placeholder="Name the category" 
        name="phoneNumber" 
        onChange={(e) => setCatName(e.target.value)}
        value={catName} 
        required /> */}
    </>
  )
}

export default NewCategoryForm;
