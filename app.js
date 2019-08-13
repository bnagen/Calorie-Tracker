// Storage
const StorageController = (function(){
    
    
    
    //public methods
    return {
        storeItem: function(item) {
            let items;
            // check if items are in storage
            if(localStorage.getItem('items') === null) {
                items = [];
                //push new item
                items.push(item);
                // put in local storage
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem("items"));

                // push
                items.push(item);

                // reset localstorage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        getItemsFromLocalStorage: function() {
            let items;
            if(localStorage.getItem("items") === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }

            return items;
        },

        updateItemInLocalStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach(function(item,index) {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromLocalStorage: function(id) {
            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach(function(item,index) {
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAllItemsFromLocalStorage: function() {
            localStorage.removeItem("items");
        }

    }
})();





// Item
const ItemController = (function() {
    // Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data State
    const state = {
        items: StorageController.getItemsFromLocalStorage(),
        currentItem: null,
        totalCalories: 0
    }


    // Public methods 
    return {
        getItems: function() {
            return state.items;
        },
        
        addItem: function(name, calories) {
            let ID;

            if(state.items.length > 0) {
                ID = state.items[state.items.length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            newItem = new Item(ID, name, calories);

            state.items.push(newItem);

            return newItem;
        },
        getItemByID: function(id) {
            let found  = null;
            // Loop through items
            state.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });

            return found;
        },

        updateItem: function(name, calories) {
            //calories into num
            calories = parseInt(calories);

            let found = null;

            state.items.forEach(function(item) {
                if(item.id === state.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        deleteItem: function(id) {
            //get ids
            ids = state.items.map(function(item) {
                return item.id;
            });

            const index = ids.indexOf(id);

            //remove item from array
            state.items.splice(index, 1);
        },
        
        clearAllItems: function() {
            state.items = [];
        },
        setCurrentItem: function(item) {
            state.currentItem = item;
        },

        getCurrentItem: function() {
            return state.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;

            state.items.forEach(function(item) {
                total += item.calories;

            });
            state.totalCalories = total;

            return state.totalCalories;

        },
        logData: function() {
            return state;
        }
    }
})();





// UI
const UIController = (function() {
    const UISelector = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        itemName: "#item-name",
        itemCalories: "#item-calories",
        totalCalories: ".total-calories",
        listItems: "#item-list li",
        clearBtn: ".clear-btn"
        
    }

    // Public methods 
    return {
        displayItemList: function(items) {
            let html = "";

            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <b>${item.name}: </b> </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`;
            });


            //Insert list items
            document.querySelector(UISelector.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelector.itemName).value,
                calories: document.querySelector(UISelector.itemCalories).value
            }
        },

        addListItem: function(item) {
            // show list
            document.querySelector(UISelector.itemList).style.display = "block";
            // create li element
            const li = document.createElement("li");
            // Add class
            li.className = "collection-item";
            // ADD ID
            li.id = `item-${item.id}`;

            //ADD HTML
            li.innerHTML = `<b>${item.name}: </b> </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>`;

            // insert item
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);
        },

        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // turn list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<b>${item.name}: </b> </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },

        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelector.itemName).value = "";
            document.querySelector(UISelector.itemCalories).value = "";
        },

        hideList: function() {
            document.querySelector(UISelector.itemList).style.display = "none";
        },

        removeItems: function() {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // turn list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item) {
                item.remove();
            });

        },

        showTotalCalories: function(calories) {
            document.querySelector(UISelector.totalCalories).textContent = calories;
        },

        addItemToUI: function() {
            document.querySelector(UISelector.itemName).value = ItemController.getCurrentItem().name;
            document.querySelector(UISelector.itemCalories).value = ItemController.getCurrentItem().calories;
            UIController.showInitialState();

        },

        initialState: function() {
            UIController.clearInput();
            document.querySelector(UISelector.updateBtn).style.display = "none";
            document.querySelector(UISelector.deleteBtn).style.display = "none";
            document.querySelector(UISelector.backBtn).style.display = "none";
            document.querySelector(UISelector.addBtn).style.display = "inline";
        },

        
        showInitialState: function() {
            
            document.querySelector(UISelector.updateBtn).style.display = "inline";
            document.querySelector(UISelector.deleteBtn).style.display = "inline";
            document.querySelector(UISelector.backBtn).style.display = "inline";
            document.querySelector(UISelector.addBtn).style.display = "none";
        },

        
        getSelectors: function() {
            return UISelector;
        }
    }
})();





// APP
const AppController = (function(ItemController, StorageController,  UIController) {
    // Load Events
    const loadEventListeners = function() {
        const UIselector = UIController.getSelectors();

        
        // add item event
        document.querySelector(UIselector.addBtn).addEventListener('click', storeItem);

        //disable enter
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //edit icon
        document.querySelector(UIselector.itemList).addEventListener("click", itemEdit);

        // update items
        document.querySelector(UIselector.updateBtn).addEventListener("click", itemUpdate);

        //delete item
        document.querySelector(UIselector.deleteBtn).addEventListener("click", itemDelete);


        //back button 
        document.querySelector(UIselector.backBtn).addEventListener("click", back);

        //clear all item
        document.querySelector(UIselector.clearBtn).addEventListener("click", clearAll);
    }

    // add item
    const storeItem = function(e) {
        // get form input form UI Controller
        const input = UIController.getItemInput();
        
        if(input.name !== "" && input.calories !== "") {
            const newItem = ItemController.addItem(input.name, input.calories);

            // add item to UI
            UIController.addListItem(newItem);

            //get calories  
            const totalCalories = ItemController.getTotalCalories();

            //display in UI
            UIController.showTotalCalories(totalCalories);

            // Store in local storage
            StorageController.storeItem(newItem);

            // CLEAR TEXT FIELDS
            UIController.clearInput();
        }
        
        
        e.preventDefault();
    }

    const back = function(e) {
        UIController.initialState();
        e.preventDefault();
    }

    const itemEdit = function(e) {
        if(e.target.classList.contains("edit-item")) {
            //Get list item id 
            const listID = e.target.parentNode.parentNode.id;

            const listArray = listID.split("-");

            const id = parseInt(listArray[1]);
            // get item
            const itemEdit = ItemController.getItemByID(id);

            //set current item

            ItemController.setCurrentItem(itemEdit);

            // add item to UI
            UIController.addItemToUI();
        }


        e.preventDefault();
    }

    
    const itemUpdate = function(e) {
        // Get item input
        const input = UIController.getItemInput();

        //update item
        const updatedItem = ItemController.updateItem(input.name, input.calories);

        //update the UI
        UIController.updateListItem(updatedItem);

        //get calories  
        const totalCalories = ItemController.getTotalCalories();

        //display in UI
        UIController.showTotalCalories(totalCalories);

        //update the local storage to current
        StorageController.updateItemInLocalStorage(updatedItem);

        UIController.initialState();


        e.preventDefault();
    }

    // delete button
    const itemDelete = function(e) {
        // get current item
        const currentItem = ItemController.getCurrentItem();
        
        //delete item from data
        ItemController.deleteItem(currentItem.id);

        //delete from ui
        UIController.deleteListItem(currentItem.id);

        //get calories  
        const totalCalories = ItemController.getTotalCalories();

        //display in UI
        UIController.showTotalCalories(totalCalories);

        //delete from storage
        StorageController.deleteItemFromLocalStorage(currentItem.id);
    
        UIController.initialState();
    
        e.preventDefault();

    }
    
    const clearAll = function(e) {
        //delete all items
        ItemController.clearAllItems();

        //get calories  
        const totalCalories = ItemController.getTotalCalories();

        //display in UI
        UIController.showTotalCalories(totalCalories);

        //remove from ui
        UIController.removeItems();

        //Clear from local storage
        StorageController.clearAllItemsFromLocalStorage();

        
        //hide ul
        UIController.hideList();

        
        e.preventDefault();
    }
    // Public methods 
    return {
        init: function() {
            //set initial
            UIController.initialState();


            //fetch items
            const items = ItemController.getItems();

            
            // check if items exist
            if(items.length === 0) {
                UIController.hideList();
            }
            else {
                //display list with items
                UIController.displayItemList(items);
            }
            
            //get calories  
            const totalCalories = ItemController.getTotalCalories();

            //display in UI
            UIController.showTotalCalories(totalCalories);

            // load event listener
            loadEventListeners();
        }
    }
})(ItemController, StorageController,  UIController);


// Intialize app
AppController.init();