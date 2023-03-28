import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import NewCategoryForm from '../NewCategoryForm/NewCategoryForm';
import { db } from '../../firebaseConfig';
import { collection, doc, setDoc, query, where, addDoc, onSnapshot, getDocs, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const [newCategoryForm, setNewCategoryForm] = useState(false)
  const [blogVisible, setBlogVisible] = useState(false)
  const [foodItems, setFoodItems] = useState([]);
  const [drinkItems, setDrinkItems] = useState([]);

  const addNewCategory = () => { setNewCategoryForm(!newCategoryForm) }

  // Load items for selected category
  useEffect(() => {
    const foodCollectionRef = collection(db, 'food');
    const foodItemsQuery = query(foodCollectionRef);
    const unsubscribeFood = onSnapshot(foodItemsQuery, (querySnapshot) => {
      const foodItemsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          mainText: data.mainText,
          createdAt: data.createdAt,
          price: data.price
        };
      });
      setFoodItems(foodItemsData);
    });

  // Retrieve all drink items
  const drinkCollectionRef = collection(db, 'drink');
  const drinkItemsQuery = query(drinkCollectionRef);
  const unsubscribeDrink = onSnapshot(drinkItemsQuery, (querySnapshot) => {
    const drinkItemsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        mainText: data.mainText,
        createdAt: data.createdAt,
        price: data.price
      };
    });
    setDrinkItems(drinkItemsData);
  });

  return () => {
    unsubscribeFood();
    unsubscribeDrink();
  };
  }, []);

  return (
    <div className='dashboard-container'>
      <button onClick={ () => addNewCategory() }>Add category (e.g. paninis)</button>
      {
        newCategoryForm ? <NewCategoryForm /> : null
      }
      <h2>Manage Menu</h2>
      <h3>FOOD</h3>
      {
        foodItems.length > 0 ? 
        foodItems.map((item) => (
          <div className='subcategory' key={item.id} >
            <p>Main Text: {item.mainText}</p>
            <p>Created At: {item.createdAt}</p>
            <p>Price: {item.price}</p>
          </div>
        ))
        : null
      }
      <h3>DRINKS</h3>
      {
        drinkItems.length > 0 ? 
        drinkItems.map((item) => {
          return  (
            <div className='subcategory' key={item.id} >
             <p>Main Text: {item.mainText}</p>
              <p>Created At: {item.createdAt}</p>
              <p>Price: {item.price}</p>
            </div>
          )
        })
        : null
      }
    </div>
  )
}

export default Dashboard;
