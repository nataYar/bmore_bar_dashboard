import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './Dashboard.css';
import NewCategoryForm from '../NewCategoryForm/NewCategoryForm';
import Items from '../Items/Items';
import { db } from '../../firebaseConfig';
import {
  writeBatch,
  collection,
  onSnapshot,
  addDoc,
  doc,
  query,
  where,
  getDoc,

  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";

export const Drafts = {
  category: 'drinks', 
  name: 'Drafts',
  price: '8.75',
  items: [
      {
          name: 'Peroni',
      description: 'The uplifting taste of an Italian Tradition that Roots back to 1963. Created with the Sharp Sophisticated Beer Drinker in Mind.'
      },
      {
      name: 'Modelo',
      description: 'Brewed as a model of what good beer should be, this rich, full-flavored Pilsner-style Lager delivers a crisp, refreshing taste.  Brewed with Fighting Spirit since 1925!'
      },
      {
      name: 'Hazy IPA',
      description: 'Bright tropical fruit flavors carry over from the aroma onto the palate, with fresh tangerine, Meyer lemon, pineapple-flavored Lifesavers candy, and cantaloupe preceding mildly dank hop notes. A beer that incorporates a smooth and medium-bodied on the tongue with soft, fine carbonation. '
      },
      {
      name: 'Blue Moon',
      description: 'A True Belgian - Style Wheat  Ale Brewed with Valencia Orange Peel for a Subtle Sweetness and Bright, Citrus Aroma & Bouquet.'
      }
  ]
}


const Dashboard = () => {
  const [newCategoryForm, setNewCategoryForm] = useState(false)
  const [categories, setCategories] = useState([]);

  const [updatedItems, setUpdatedItems] = useState([]);

  const addCategoryToFirestore = async (category) => {
    try {
      const categoriesRef = collection(db, 'categories');
      const items = category.items.map((item) => {
        return {
          id: uuidv4(),
          ...item
        };
      });
      const docRef = await addDoc(categoriesRef, {
        ...category,
        items: items
      }, {merge: true});
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  }
  // useEffect(() => { addCategoryToFirestore(Drafts)}, [] )

  useEffect(() => {
    onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            note: doc.data().note,
            category: doc.data().category,
            items: doc.data().items
          };
        })
      );
    });
  }, []);

  const addNewCategory = () => { setNewCategoryForm(!newCategoryForm)}

  const handleItemDelete = async (categoryId, itemName) => {
    const categoryDocRef = doc(db, 'categories', categoryId);
    const categoryDocSnapshot = await getDoc(categoryDocRef);
    const categoryData = categoryDocSnapshot.data();
  
    const updatedItems = categoryData.items.filter((i) => i.name !== itemName);

    await updateDoc(categoryDocRef, { items: updatedItems })
    
    //update categories to exclude removed item from array of Items
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: updatedItems
        }
        
      } else {
        return category;
      }
    }));
  };
useEffect(() => {
  // categories.map(el => console.log(el.items))
  console.log(updatedItems)
}, [updatedItems])

  const handleItemUpdate = (categoryId, itemId, field, value) => {
    setUpdatedItems((prevItems) => {
      const updatedCategoryIndex = categories.findIndex((cat) => cat.id === categoryId);
      const updatedItemIndex = categories[updatedCategoryIndex].items.findIndex((item) => item.id === itemId);
      const updatedItem = {
        ...categories[updatedCategoryIndex].items[updatedItemIndex],
        categoryIndex: updatedCategoryIndex,
        [field]: value
      };
      //check if an item is already in updated array
      const existingItemIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingItemIndex >= 0) {
        const existingItem = prevItems[existingItemIndex];
        const updatedExistingItem = {
          ...existingItem,
          [field]: value
        };
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = updatedExistingItem;
        return updatedItems;
      }
      return [...prevItems, updatedItem];
    });
    
  };

  const handleSubmitItemUpdate = async () => {
    const batch = writeBatch(db); //batch can write to multiple documents - instead of multiple update()/set()
    categories.forEach((category, categoryIndex) => {
      //  find all the items that must be updated in DB
      // if an item is in the Updated array, return it with changes,
      // if an item is not found in Updqted array => it goes to DB unchanged 
      // then it all goes to the batch commited to DB
      const updatedItemsArray = categories[categoryIndex].items.map((item) => {
        const existingItem = updatedItems.find(
          (updatedItem) =>
            updatedItem.categoryIndex === categoryIndex && updatedItem.id === item.id
        );
         
        if (existingItem) {
          return {
            ...item,
            name: existingItem.name,
            description: existingItem.description,
          };
        }
        console.log(item)
        return item;
      });
      const categoryRef = doc(db, "categories", category.id);
      batch.update(categoryRef, { items: updatedItemsArray });
    });
    await batch.commit();
  };
  
  
  

  return (
    <div className='dashboard-container'>
      <button onClick={ () => addNewCategory() }>Add category (e.g. paninis)</button>
      { newCategoryForm ? <NewCategoryForm /> : null }
      <h2>Categories</h2>
      <button onClick={() => handleSubmitItemUpdate()}>Save changes</button>
      { categories.map((category) => (
        <div key={category.id}>
          {/* <input
              type="text"
              value={
                  getItemNameById(category.id, item.id, "name") ?? item.name
              }
              onChange={(e) =>
                  handleUpdateCallback(category.id, item.id, "name", e.target.value)
              }
          /> */}
          <h3>{category.name}</h3>
          <p>{category.category}</p>
          <p>Price: {category.price}</p>
          <p>Note: {category.note}</p>

          <Items 
            items={category.items}
            updatedItems={updatedItems} 
            category={category} 
            handleItemDeleteFn={ handleItemDelete }
            handleItemUpdateFn={ handleItemUpdate } 
          />
          

        </div>
      ))}
    </div>
  )
}

export default Dashboard;