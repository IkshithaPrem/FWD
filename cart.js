// Load cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to display the cart items
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('total-price');

    cartItemsDiv.innerHTML = ''; // Clear current items
    let totalPrice = 0;

    cart.forEach((entry, index) => {
        const itemTotal = entry.price * entry.quantity;
        totalPrice += itemTotal;

        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <img src="${entry.imageUrl}" alt="${entry.item}" class="cart-item-image">
                <div class="item-details">
                    <h3>${entry.item}</h3>
                    <p>Price: ₹${entry.price}</p>
                    <div class="quantity-control">
                        <button class="decrease" onclick="updateQuantity(${index}, -1)">-</button>
                        <input type="number" class="quantity" value="${entry.quantity}" min="1" readonly>
                        <button class="increase" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <p class="total">Total: ₹${itemTotal}</p>
                </div>
                <button class="remove" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    totalPriceElem.textContent = `Total: ₹${totalPrice}`;
}

// Function to update the quantity of an item
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Function to remove an item from the cart
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Handle the checkout process
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // Hide the cart section and show the payment section
    document.getElementById('cart-section').style.display = 'none';
    document.getElementById('payment-section').style.display = 'block';
}

// Handle payment confirmation
// Payment form submission handler
document.getElementById('payment-form').onsubmit = function (event) {
    event.preventDefault();

    // Fetch the selected payment method
    const paymentMethodInput = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethodInput) {
        alert("Please select a payment method.");
        return;
    }
    const paymentMethod = paymentMethodInput.value;

    // Notify user of the payment method
    alert(`Payment method noted! Method: ${paymentMethod}`);

    // Show the order summary and pass the payment method
    showOrderSummary(paymentMethod);

    // Clear cart from localStorage
    localStorage.removeItem('cart');
    cart = []; // Clear the in-memory cart
};

// Show order summary
function showOrderSummary(paymentMethod) {
    document.getElementById('payment-section').style.display = 'none';
    document.getElementById('order-summary').style.display = 'block';

    const orderItemsDiv = document.getElementById('order-items');
    orderItemsDiv.innerHTML = ''; // Clear current order items

    let totalPrice = 0;
    let cartDetails = '';

    // Generate a random order code
    const orderCode = 'ORDER-' + Math.floor(100000 + Math.random() * 900000); // Example: ORDER-123456

    // Display order items and build the message
    cart.forEach((entry) => {
        const itemTotal = entry.price * entry.quantity;
        totalPrice += itemTotal;

        orderItemsDiv.innerHTML += `
            <div class="order-item">
                <img src="${entry.imageUrl}" alt="${entry.item}" style="width: 50px; height: 50px;">
                <div class="item-details">
                    <h3>${entry.item}</h3>
                    <p>Price: ₹${entry.price} | Quantity: ${entry.quantity}</p>
                    <p>Total: ₹${itemTotal}</p>
                </div>
            </div>
        `;

        // Append item details to the message
        cartDetails += `${entry.item} (₹${entry.price} x ${entry.quantity}) = ₹${itemTotal}\n`;
    });

    // Display the random order code with copy to clipboard button
    const orderCodeDiv = document.getElementById('order-code');
    orderCodeDiv.innerHTML = `
        <p><strong>Order Code:</strong> <span id="code-text">${orderCode}</span></p>
        <button id="copy-btn" onclick="copyToClipboard('${orderCode}')">Copy to Clipboard</button>
    `;

    // Add a WhatsApp message button
    const whatsappDiv = document.getElementById('whatsapp-message');
    const message = encodeURIComponent(
        `Hello! I would like to confirm my order.\n\nOrder Code: ${orderCode}\n\nCart Details:\n${cartDetails}\nTotal Price: ₹${totalPrice}\n\nPayment Method: ${paymentMethod}`
    );

    whatsappDiv.innerHTML = `
        <a href="https://wa.me/7483221529?text=${message}" target="_blank">
            <button id="whatsapp-btn">Message on WhatsApp to proceed</button>
        </a>
    `;
}



// Function to copy the order code to the clipboard
function copyToClipboard(orderCode) {
    navigator.clipboard.writeText(orderCode)
        .then(() => {
            alert('Order Code copied to clipboard!');
        })
        .catch(() => {
            alert('Failed to copy Order Code. Please try again.');
        });
}


// Back to home page from order summary
function backToHomePage() {
    window.location.href = 'signup.html'; // Replace with your actual home page URL
}

// Initialize the page by displaying the cart items
displayCartItems();

// Function to go back to the menu
function goBackToMenu() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('home-page').style.display = 'block';
    window.location.href = 'fwd.html'; // Replace 'menu.html' with the correct page URL
}
