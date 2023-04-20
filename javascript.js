//imports non-native functions required for firebase interactions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//Constant values for easier reference later in the project
const appSettings = {
    databaseURL: "https://fir-intro-ae1f9-default-rtdb.europe-west1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const groceriesInDB = ref(database, "groceries")
const atcButton = document.getElementById("addToCartButton")
const inputField = document.getElementById("inputField")
const itemList = document.getElementById("itemList")

//makes the button trigger a fuction on mouseup
atcButton.addEventListener("mouseup", function(){
    let inputValue = inputField.value
    //if the input field isnt empty
    if(inputValue.replace(/\s/g, "") != ""){
        //add the input field value to database and clear input field
        push(groceriesInDB, inputValue)
        //Logs the items added for testing purposes
        console.log(inputValue + " added to database")
        
        clearInputField()
    }
    //if it is empty, clear the input field in case of spaces
    else {
        clearInputField()
    }

})
//onValue happens whenever the database updates
onValue(groceriesInDB, function(snapshot){
    //If some data got returned
    if(snapshot.exists()){
        //Store all current items in list in an array
        let itemsArray = Object.entries(snapshot.val())

        clearList()
        //For every item in the database
        for(let i = 0; i < itemsArray.length; i++) {
            //Runs a function for every item in the array with each separate item as an input
            let currentItem = itemsArray[i]
            addToList(currentItem)
        }
    }
    //If database is empty, set list to "No items in database"
    else {
        itemList.innerHTML = "No items in database"
    }
})

//function for adding items to the visible item list
function addToList(currentItem){
    //Sets the item id to the id given by the database, taken from the array inputted
    let itemID = currentItem[0]
    //Sets the item name given by the user when inputted into the database, taken from the array inputted
    let itemValue = currentItem[1]
    //Prepares a new li element 
    let newElement = document.createElement("li")
    //Sets the text of the li to the itemValue downloaded from the database
    newElement.textContent = itemValue
    //Gives the element a button function similar to the earlier submit button
    newElement.addEventListener("mouseup", function(){
        //Prepares a reference to the unique id given by the database
        let exactLocationOfItemInDB = ref(database, `groceries/${itemID}`)
        //Unique for every element created with the function, uses an imported function from firebase to remove the item from the database
        remove(exactLocationOfItemInDB)
        //Logs the itemValue and itemID of the deleted element for testing purposes
        console.log(`Deleted element ${itemValue}: (${itemID})`)
    })
    //Adds the new element to the visible item list
    itemList.append(newElement)
}

//Function for clearing the visible item list
function clearList(){
    itemList.innerHTML = ""
}

//Function for clearing the input field
function clearInputField(){
    inputField.value = ""
}