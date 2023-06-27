import React, { useState, useEffect, useContext } from "react";
import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "./ScrollToTopButton";

import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import NewCategoryForm from "./NewCategoryForm";
import Items from "./Items";
import { AddItem } from "./AddItem";
import { db } from "../firebaseConfig";
import {
  writeBatch,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const Menu = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  const [newCategoryForm, setNewCategoryForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [updatedCategories, setUpdatedCategories] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);
  const [newItemForm, setNewItemForm] = useState(false);

  const addCategoryToFirestore = async (category) => {
    try {
      const categoriesRef = collection(db, "categories");
      const items = category.items.map((item) => {
        return {
          id: uuidv4(),
          ...item,
        };
      });
      const docRef = await addDoc(
        categoriesRef,
        {
          ...category,
          items: items,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "categories"), (snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            note: doc.data().note,
            category: doc.data().category,
            items: doc.data().items,
          };
        })
      );
    });
  }, []);

  const addNewCategory = () => {
    setNewCategoryForm(!newCategoryForm);
  };

  const handleItemDelete = async (categoryId, itemName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${itemName}?`
    );

    if (confirmed) {
      const categoryDocRef = doc(db, "categories", categoryId);
      const categoryDocSnapshot = await getDoc(categoryDocRef);
      const categoryData = categoryDocSnapshot.data();

      const updatedItems = categoryData.items.filter(
        (i) => i.name !== itemName
      );

      await updateDoc(categoryDocRef, { items: updatedItems });

      //update categories to exclude removed item from array of Items
      setCategories(
        categories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              items: updatedItems,
            };
          } else {
            return category;
          }
        })
      );
    }
  };

  const handleItemUpdate = (categoryId, itemId, field, value) => {
    setUpdatedItems((prevItems) => {
      // prevItems = current state value of an array of items that is been updated
      const updatedCategoryIndex = categories.findIndex(
        (cat) => cat.id === categoryId
      );
      const updatedItemIndex = categories[updatedCategoryIndex].items.findIndex(
        (item) => item.id === itemId
      );
      const updatedItem = {
        ...categories[updatedCategoryIndex].items[updatedItemIndex],
        categoryIndex: updatedCategoryIndex,
        [field]: value.trim(),
      };
      //check if an item is already in updated array
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === itemId
      );
      if (existingItemIndex >= 0) {
        const existingItem = prevItems[existingItemIndex];
        const updatedExistingItem = {
          ...existingItem,
          [field]: value.trim(),
        };
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = updatedExistingItem;
        return updatedItems;
      }
      return [...prevItems, updatedItem];
    });
  };

  const handleSubmit = () => {
    if (updatedCategories.length > 0) {
      handleCategorySubmit();
    } else if (updatedItems.length > 0) {
      handleSubmitItemUpdate();
    } else if (updatedItems.length > 0 && updatedCategories.length > 0);
    handleCategorySubmit();
    handleSubmitItemUpdate();
  };

  const handleSubmitItemUpdate = async () => {
    const batch = writeBatch(db); //batch can write to multiple documents - instead of multiple update()/set()
    categories.forEach((category, categoryIndex) => {
      // find all the items that must be updated in DB
      // if an item is in the Updated array, return it with changes,
      // if an item is not found in Updqted array => it goes to DB unchanged
      // then it all goes to the batch commited to DB
      const updatedItemsArray = categories[categoryIndex].items.map((item) => {
        const existingItem = updatedItems.find(
          (updatedItem) =>
            updatedItem.categoryIndex === categoryIndex &&
            updatedItem.id === item.id
        );

        if (existingItem) {
          return {
            ...item,
            name: existingItem.name.trim(),
            description: existingItem.description.trim(),
          };
        }
        console.log(item);
        return item;
      });
      const categoryRef = doc(db, "categories", category.id);
      batch.update(categoryRef, { items: updatedItemsArray });
    });
    await batch.commit();
  };

  // function to submit changes in Categories to db
  const handleCategorySubmit = async () => {
    const batch = writeBatch(db);
    updatedCategories.forEach((updatedCategory) => {
      const categoryRef = doc(db, "categories", updatedCategory.id);
      batch.update(categoryRef, updatedCategory);
    });
    await batch.commit();
    setUpdatedCategories([]);
  };

  // function to make name, price, and note editable
  const handleCategoryUpdate = (categoryId, field, value) => {
    setUpdatedCategories((prevCategories) => {
      const existingCategoryIndex = prevCategories.findIndex(
        (cat) => cat.id === categoryId
      );
      if (existingCategoryIndex >= 0) {
        const existingCategory = prevCategories[existingCategoryIndex];
        const updatedExistingCategory = {
          ...existingCategory,
          [field]: value.trim(),
        };
        const updatedCategories = [...prevCategories];
        updatedCategories[existingCategoryIndex] = updatedExistingCategory;
        return updatedCategories;
      } else {
        const newCategory = {
          id: categoryId,
          [field]: value.trim(),
        };
        return [...prevCategories, newCategory];
      }
    });
  };

  const getCategoryById = (categoryId, type) => {
    const updatedCategory = updatedCategories.find(
      (cat) => cat.id === categoryId
    );
    return updatedCategory ? updatedCategory[type] : undefined;
  };

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${category.name}?`
    );

    if (confirmed) {
      const categoryDocRef = doc(db, "categories", category.id);
      await deleteDoc(categoryDocRef);
      // Remove deleted category from categories array in state
      setCategories((prevCategories) =>
        prevCategories.filter((el) => el.id !== category.id)
      );
    }
  };

  const toggleNewCategoryForm = () => {
    setNewCategoryForm(!newCategoryForm);
  };

  return (
    <div className="ml-auto mr-auto flex w-full  flex-col items-center lg:w-2/3">
      <div className="w-ful fixed z-10 rounded-lg bg-gray-100 py-2 drop-shadow-md">
        <div className="flex h-auto w-screen justify-between px-4 md:px-7">
          <Link to="/">
            <svg
              className="h-full w-9"
              data-name="Livello 1"
              id="home-icon"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M127.12,60.22,115.46,48.56h0L69,2.05a7,7,0,0,0-9.9,0L12.57,48.53h0L.88,60.22a3,3,0,0,0,4.24,4.24l6.57-6.57V121a7,7,0,0,0,7,7H46a7,7,0,0,0,7-7V81a1,1,0,0,1,1-1H74a1,1,0,0,1,1,1v40a7,7,0,0,0,7,7h27.34a7,7,0,0,0,7-7V57.92l6.54,6.54a3,3,0,0,0,4.24-4.24ZM110.34,121a1,1,0,0,1-1,1H82a1,1,0,0,1-1-1V81a7,7,0,0,0-7-7H54a7,7,0,0,0-7,7v40a1,1,0,0,1-1,1H18.69a1,1,0,0,1-1-1V51.9L63.29,6.29a1,1,0,0,1,1.41,0l45.63,45.63Z" />
            </svg>
          </Link>

          <div className="ml-10 flex h-full justify-between md:justify-end">
            <button
              className="h-auto w-auto rounded-lg  bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700 lg:w-40"
              onClick={() => addNewCategory()}
            >
              {newCategoryForm ? "Hide new category" : "Add category"}
            </button>
            <button
              className={
                updatedCategories.length > 0 || updatedItems.length > 0
                  ? "ml-5 h-auto w-auto cursor-pointer rounded-lg bg-yellow-400 px-4 py-2  font-bold text-black lg:ml-8 lg:w-40"
                  : "ml-5 h-auto w-auto cursor-not-allowed rounded-lg bg-gray-300 px-4  py-2  font-bold text-white lg:ml-8 lg:w-40"
              }
              onClick={() => handleSubmit()}
            >
              Save changes
            </button>
          </div>
        </div>
        {newCategoryForm ? (
          <NewCategoryForm toggleNewCategoryForm={toggleNewCategoryForm} />
        ) : null}
      </div>

      <div className="mt-20 w-full px-5">
        <div>
          {categories
            .sort((a, b) => {
              if (a.category === "drinks" && b.category !== "drinks") {
                return -1; // "drinks" comes before other categories
              } else if (a.category !== "drinks" && b.category === "drinks") {
                return 1; // other categories come before "drinks"
              } else {
                // sort alphabetically if both categories are the same or different from "drinks"
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              }
            })
            .map((category) => (
              <div key={category.id} className="my-4 w-full">
                <a
                  href={`#${category.id}`}
                  className="inline-flex items-center font-medium hover:underline hover:decoration-purple-600"
                >
                  <p className="text-gray-900">{category.name} </p>
                  <p className="ml-3 text-purple-400"> {category.category}</p>
                  <svg
                    aria-hidden="true"
                    className="ml-1 h-5 w-5"
                    fill="#9333ea"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            ))}
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            id={category.id}
            className="my-10 w-full rounded-lg bg-white px-2.5 py-4"
          >
            <div className="box-border flex w-full justify-between pb-4">
              <button
                className="h-12 rounded-lg border-2 border-purple-400 bg-white 
              px-4 py-2 font-bold text-purple-400 hover:border-purple-600 hover:text-purple-600"
                onClick={() => handleDeleteCategory(category)}
              >
                Delete Category
              </button>
              <button
                className="h-12  rounded-lg bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700"
                onClick={() => setNewItemForm(!newItemForm)}
              >
                {newItemForm ? "Hide New Item" : "Add New Item"}
              </button>
            </div>

            {newItemForm ? <AddItem category={category} /> : null}

            <input
              className="mb-4 block w-full rounded-lg border-none bg-gray-50 p-2.5 text-3xl font-bold text-gray-900 focus:border-gray-500 focus:ring-gray-500"
              type="text"
              value={getCategoryById(category.id, "name") ?? category.name}
              onChange={(e) =>
                handleCategoryUpdate(category.id, "name", e.target.value)
              }
            />

            <p className="mb-4 pl-2.5 text-zinc-500">/{category.category}/</p>

            <label
              className="mb-4 pl-2.5 text-gray-900"
              htmlFor="category-price"
            >
              Price:{" "}
            </label>
            <input
              id="category-price"
              className="mb-4 block w-auto rounded-lg border-none bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500"
              type="text"
              value={getCategoryById(category.id, "price") ?? category.price}
              onChange={(e) =>
                handleCategoryUpdate(category.id, "price", e.target.value)
              }
            />

            <label
              className="mb-4 pl-2.5 text-gray-900"
              htmlFor="category-note"
            >
              Notes:{" "}
            </label>
            <input
              id="category-note"
              className="mb-4 block w-full rounded-lg border-none bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500"
              type="text"
              value={getCategoryById(category.id, "note") ?? category.note}
              onChange={(e) =>
                handleCategoryUpdate(category.id, "note", e.target.value)
              }
            />
            <Items
              items={category.items}
              updatedItems={updatedItems}
              category={category}
              handleItemDeleteFn={handleItemDelete}
              handleItemUpdateFn={handleItemUpdate}
            />
            <ScrollToTopButton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
