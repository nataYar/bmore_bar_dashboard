import React from 'react'

const Items = ({ 
    category, 
    items,
    updatedItems,
    handleDeleteFn,
    handleUpdateFn }) => {

    
    // console.log(updatedItems)
    // console.log(items)

    const handleDeleteCallback = (categoryId, itemName) => { handleDeleteFn(categoryId, itemName) }

    const handleUpdateCallback  = (categoryId, itemId, field, value) => {
        handleUpdateFn(categoryId, itemId, field, value) 
      };

      const getItemNameById = (categoryId, itemId, type, item) => {
        const updatedItem = updatedItems.find(item => categoryId === categoryId && item.id === itemId);
        return updatedItem ? updatedItem[type] : undefined ;
      };

    return (
        <>
        { items.map((item, index) => 
                <div key={index}> 
                    <input
                        type="text"
                        value={
                            getItemNameById(category.id, item.id, "name") ?? item.name
                        }
                        onChange={(e) =>
                            handleUpdateCallback (category.id, item.id, "name", e.target.value)
                        }
                    />
                    <input
                        type="text"
                        value={
                           getItemNameById(category.id, item.id, "description") ?? item.description
                        }
                        onChange={(e) =>
                          handleUpdateCallback (category.id, item.id, "description", e.target.value)
                        }
                    />
                    <button onClick={ () => handleDeleteCallback(category.id, item.name) }>Delete</button>
                </div>
            )}
        </>
    )
    }

export default Items
