//get references to interactive elements
const optSizes = document.getElementsByName("size");
const optType = document.getElementsByName("type");
const optS_base = document.getElementsByName("s_base");
const optM_base = document.getElementsByName("m_base");
const optExtra = document.getElementsByName("m_extra");
const txtCost = document.getElementById("cost");
const btnAdd = document.getElementById("add");
const btnPlace = document.getElementById("place");
const btnSave = document.getElementById("save");
const btnFav = document.getElementById("fav");
const txtOutput = document.getElementById("output");


//listen for events
btnAdd.addEventListener("click", addToOrder);
btnPlace.addEventListener("click", placeTheOrder); 
btnSave.addEventListener("click", SaveMyFav);
btnFav.addEventListener("click", OrderMyFav);

optSizes.forEach(item => item.addEventListener("change", checkSize));
optS_base.forEach(item => item.addEventListener("change", S_base));
optM_base.forEach(item => item.addEventListener("change", M_base));
optType.forEach(item => item.addEventListener("change", checkType));
optExtra.forEach(item => item.addEventListener("change", checkExtra));


//variables available to all code
let sizeCost;
let extraCost;
let size;
let type = null;
let ingredient = null;
let s_base;
let m_base;
let m_extra;
let malt;
let marsh;
let whip;
let flake;
let cost;

//initialise default values

initialise();

function initialise() {
    sizeCost = 3.20;
    extraCost = 0;
    malt = "no malt";
    marsh = "no marshmallow";
    whip = "no whip";
    flake = "no flake";
    size = "medium";
    s_base = "orange juice";
    m_base = "skimmed milk";
    cost = sizeCost + extraCost;
    txtOutput.innerText = `${cost.toFixed(2)}`;

    document.getElementById('s_base').style.display = 'none';
    document.getElementById('m_base').style.display = 'none';
    document.getElementById('m_extra').style.display = 'none';

    btnAdd.disabled = true;
    btnSave.disabled = true;
    btnFav.disabled = true;

}

// check if the button should be enabled or disabled
function checkButtonState() {

    const checkboxes = document.getElementsByName('ingredient');

    // If at least one checkbox is checked
    if (Array.from(checkboxes).some(checkbox => checkbox.checked)) {
        ingredient = true;
    } else {
        ingredient = null;
    }


    // If all the required fields have been completed
    if (type !== null && size !== null && ingredient !== null) {
        btnAdd.disabled = false;
        btnSave.disabled = false;

    } else {
        btnAdd.disabled = true;
        btnSave.disabled = true;
    }

   // If there is a favourite drink saved 
    if (localStorage.getItem('favourite') === null){
        btnFav.disabled = true;
    } else {  
        btnFav.disabled = false;
    }
}

// Check the size of the drink
function checkSize() {
    if (this.value == "small") {
        sizeCost = 2.70;
        size = "Small";
    } else if (this.value == "medium") {
        sizeCost = 3.20;
        size = "medium";
    } else if (this.value == "large") {
        sizeCost = 3.70;
        size = "large";
    } else {
        sizeCost = 4.50;
        size = "extra large";
    }
    cost = sizeCost + extraCost;
    txtCost.innerText = `${cost.toFixed(2)}`;
    checkButtonState();
    
}

// Check the type of the drink
function checkType() {
    type = this.value;


    // Show the relevant section based on the selected type
    if (type === 'smoothie') {
        document.getElementById('s_base').style.display = 'block';
        document.getElementById('m_base').style.display = 'none';
        document.getElementById('m_extra').style.display = 'none';

    } else if (type === 'milkshake') {
        document.getElementById('s_base').style.display = 'none';
        document.getElementById('m_base').style.display = 'block';
        document.getElementById('m_extra').style.display = 'block';
    }

// Update the button states
    checkButtonState();
}

// Check the smoothie base
function S_base() {
    if (this.value == "apple juice") {
        s_base = "apple juice";

    } else {
        s_base = "orange juice";
    }
}

// Check the milkshake base
function M_base() {
    if (this.value == "whole milk") {
        m_base = "whole milk";

    } else if (this.value == "semi-skimmed milk"){
        m_base = "semi-skimmed milk";

    } else if (this.value == "skimmed milk"){
        m_base = "skimmed milk";

    } else if (this.value == "coconut milk"){
        m_base = "coconut milk";

    } else {
        m_base = "oat milk";
    }
}

// Check the extra ingredients
function checkExtra() {
    if (this.value == "malt") {
        if (this.checked) {
            extraCost += 0.85;
            malt = "malt";

        } else {
            extraCost -= 0.85;
            malt = " no malt";

        }
    
    } else if (this.value == "marsh") {
        if (this.checked) {
            extraCost += 0.85;
            marsh = "marshmallow";

        } else {
            extraCost -= 0.85;
            marsh = "no marshmallow";

        }

    } else if (this.value == "whip") {
        if (this.checked) {
            extraCost += 0.85;
            whip = "whip";

        } else {
            extraCost -= 0.85;
            whip = "no whip";

        }

    } else {
        if (this.checked) {
            extraCost += 0.85;
            flake = "flake";

        } else {
            extraCost -= 0.85;
            flake = " no flake";

        }
    }
    // Update the cost
    cost = sizeCost + extraCost;
    txtCost.innerText = `${cost.toFixed(2)}`;
    checkButtonState();// Update the button states

}
// reads from the JSON file and creates the checkboxes
fetch('ingredients.json')
    .then(response => response.json())
    .then(data => {

        const ingredient = document.getElementById('ingredient');
        // create a checkbox for each ingredient
        data.forEach(item => {
            
            const checkbox = document.createElement('input');
            const label = document.createElement('label');
            const br = document.createElement('br');

            // Set the checkbox's properties
            checkbox.type = 'checkbox'; checkbox.id = item; checkbox.name = 'ingredient';checkbox.value = item;

            // Set the label's properties
            label.htmlFor = item;
            label.appendChild(document.createTextNode(item));

            // Append the checkbox and label to the list
            ingredient.appendChild(checkbox); ingredient.appendChild(label);ingredient.appendChild(br);
            checkbox.addEventListener('click', checkButtonState);

        });
    })
    


txtOutput.innerText = `Current Order:\n\n`

// Add the drink to the order
function addToOrder() {
    const checkboxes = document.getElementsByName('ingredient');

    //checks if the checkbox is checked
    const selectedIngredients = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    const selectedIngredientsString = selectedIngredients.map(checkbox => checkbox.value).join(', ');

    let base = type === 'smoothie' ? s_base : m_base;
    // Add the drink to the order along with all specifications
    txtOutput.innerText += `${size} ${type} with ${base} ,with ${selectedIngredientsString} and ${malt}, ${marsh}, ${whip}, ${flake}, will cost £${cost.toFixed(2)}\n\n`;
    checkButtonState();// Update the button states
    
}

// Reset the form
function resetForm() {
 
    sizeCost = 3.20;
    extraCost = 0;
    malt = "no malt";
    marsh = "no marshmallow";
    whip = "no whip";
    flake = "no flake";
    size = "medium";
    s_base = "orange juice";
    m_base = "skimmed milk";
    cost = sizeCost + extraCost;

    btnAdd.disabled = true;
    btnSave.disabled = true;
 

    optSizes.forEach(item => {
        item.checked = item.value === 'medium';
    });

    optType.forEach(item => {
        item.checked = false;
    });

    optS_base.forEach(item => {
        item.checked = item.value === 'orange juice';
    });

    optM_base.forEach(item => {
        item.checked = item.value === 'skimmed milk';
    });

    optExtra.forEach(item => {
        item.checked = false;
    });

    txtCost.innerText = `${cost.toFixed(2)}`;
    txtOutput.innerText = `Current Order:\n\n`;
    totalCostDisplay.innerText = '';
    

}
// Place the order
function placeTheOrder() {

    resetForm();

}

// Save the favourite drink
function SaveMyFav() {
// Create a JSON object to store the favourite drink
    const favourite = {
        size,
        type,
        s_base,
        m_base,
        malt,
        marsh,
        whip,
        flake,
        cost
    };
    localStorage.setItem('favourite', JSON.stringify(favourite));

    // Update the button states
    checkButtonState();
}

function OrderMyFav() {
// Retrieve the drink details from local storage
    const favourite = JSON.parse(localStorage.getItem('favourite'));

// Add the favourite drink to the order
    txtOutput.innerText += `${favourite.size} ${favourite.type} with ${favourite.s_base} ${favourite.m_base}, with ${favourite.malt}, ${favourite.marsh}, ${favourite.whip}, ${favourite.flake}, will cost £${favourite.cost.toFixed(2)}\n\n`;
}
