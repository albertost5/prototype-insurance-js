// HTML ELEMENTS    
const yearSelect = document.querySelector('#year');
const insuranceForm = document.querySelector('#insurance-form');
const spinnerDiv = document.querySelector('#loading');
const contentDiv = document.querySelector('#content');
const resultDiv = document.querySelector('#result');

// CONSTRUCTORS
function Insurance( brand, year, type ) {
    this.brand = brand;
    this.year = year;
    this.type = type;
}

// Create constructor to be able to add functions to the prototype
function UI() {}

UI.prototype.addYears = () => {
    const maxYear = new Date().getFullYear(),
    minYear = maxYear - 20;
    for(let i = maxYear; i > minYear; i--) {
        const yearOption = document.createElement('option');
        yearOption.value = i;
        yearOption.textContent = i;
        yearSelect.appendChild( yearOption );
    }
}

UI.prototype.showMessage = ( message, type ) => {

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'mt-10');

    type === 'error' ? messageDiv.classList.add('error') : messageDiv.classList.add('correct');

    messageDiv.textContent = message;

    insuranceForm.insertBefore( messageDiv, resultDiv );

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

UI.prototype.showResult = ( insuranceObj, result ) => {
    const { brand, year, type } = insuranceObj;
    const insuranceResultDiv = document.createElement('div');

    let brandText;
    switch (brand) {
        case "1":
            brandText = 'American'
            break;
        case "2":
            brandText = 'Asian'
            break;
        case "3":
            brandText = 'European'
            break;    
        default:
            break;
    }
    insuranceResultDiv.classList.add('mt-10');
    insuranceResultDiv.innerHTML = `
        <p class="header">Result:</p>
        <p class="font-bold">Brand: <span class="font-normal">${ brandText }</span></p>
        <p class="font-bold">Year: <span class="font-normal">${ year }</span></p>
        <p class="font-bold">Type: <span class="font-normal capitalize  ">${ type }</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${ result }</span></p>
    `
    // Show spinner, remove spinner, show result
    spinnerDiv.classList.remove('hidden');
    setTimeout(() => {
        spinnerDiv.classList.add('hidden');
        resultDiv.appendChild( insuranceResultDiv );
    }, 3000);
}

Insurance.prototype.calculateInsurance = function() {
    let price;
    const base = 2000;

    switch ( this.brand ) {
        case '1':
            price = base * 1.15;
            break;
        case '2':
            price = base * 1.05;
            break;
        case '3':
            price = base * 1.35;
            break;
        default:
            break;
    }

    const currentYear = new Date().getFullYear();
    // Discount of 3% per year != currentYear
    const discountPerYears = ( currentYear - this.year ) * 0.97;

    if( discountPerYears !== 0 ) {
        price = price * discountPerYears;
    }

    // basic +30%, full +50%
    this.type === 'basic' ? price *= 1.3 : price *= 1.5;
    console.log(price);
    return price;
}

// Instantiate UI
const userInterface = new UI();
console.log(userInterface);

// EVENTS
document.addEventListener('DOMContentLoaded', ()=> {
    userInterface.addYears();
});


function eventListeners() {
    insuranceForm.addEventListener('submit', validateForm);
}

function validateForm( e ) {
    e.preventDefault();

    resultDiv.textContent = '';

    const brandValue = document.querySelector('#brand').value;
    const radioValue = document.querySelector('input[name="type"]:checked').value;

    // Show ERROR message
    if ( !brandValue || !radioValue || !yearSelect.value ) {
        // Prototype function to display the error
        userInterface.showMessage('Invalid: All fields are mandatory.', 'error');
        return;
    }

    //Show insurance result
    const insuranceData = new Insurance( brandValue, yearSelect.value, radioValue );
    const totalInsurance = insuranceData.calculateInsurance();
    
    // Show OK message
    userInterface.showMessage('Calculating', 'success');
    
    userInterface.showResult( insuranceData, totalInsurance );
}




eventListeners();