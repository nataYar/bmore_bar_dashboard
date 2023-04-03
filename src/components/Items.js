import React, {useRef, useEffect} from 'react'

const Items = ({ 
    category, 
    items,
    updatedItems,
    handleItemDeleteFn,
    handleItemUpdateFn }) => {

    const handleDeleteCallback = (categoryId, itemName) => { handleItemDeleteFn(categoryId, itemName) }

    const handleUpdateCallback  = (categoryId, itemId, field, value) => {
        handleItemUpdateFn(categoryId, itemId, field, value) 
      };

      const getItemById = (categoryId, itemId, type, item) => {
        const updatedItem = updatedItems.find(item => categoryId === categoryId && item.id === itemId);
        return updatedItem ? updatedItem[type] : undefined ;
      };

    return (
        <>
        { items.map((item, index) => 
                <div className="w-full my-6 flex flex-col items-start" key={index}> 
                    <input
                    className='mb-4 bg-gray-50 border-none text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5'
                        type="text"
                        value={  getItemById(category.id, item.id, "name") ?? item.name
                        }
                        onChange={(e) =>
                            handleUpdateCallback(category.id, item.id, "name", e.target.value)
                        }
                    />
                    <textarea
                       className='h-24 mb-4 bg-gray-50 border-none text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5'
                        type="text"
                        value={
                           getItemById(category.id, item.id, "description") ?? item.description
                        }
                        onChange={(e) =>
                          handleUpdateCallback(category.id, item.id, "description", e.target.value)
                        }
                    />
                    <button 
                    className="border-2 border-purple-400 bg-white hover:border-purple-600 
                    hover:text-purple-600 text-purple-400 py-2 px-4 rounded-lg font-bold"
                    onClick={ () => handleDeleteCallback(category.id, item.name) }>Delete item</button>
                </div>
            )}
        </>
    )
    }

export default Items
