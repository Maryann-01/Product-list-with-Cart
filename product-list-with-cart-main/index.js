
fetch('./data.json')
  .then(response => response.json())  // Parse the JSON data
  .then(data => {
    
    const content = document.getElementById('content');
    const cartItems = {}; 
    const cartContainer = document.getElementById('cart');
    const numPrice = document.querySelector('.num-Price');

    
    const getImageSource = (images) => {
        return `
            <picture>
                <source media="(max-width: 576px)" srcset="${images.mobile}">
                <source media="(max-width: 768px)" srcset="${images.tablet}">
                <source media="(min-width: 769px)" srcset="${images.desktop}">
                <img src="${images.thumbnail}" class="card-img-top" alt="${images.name}">
            </picture>
        `;
    };

    function updateCart() {
      cartContainer.innerHTML = ''; 
      numPrice.innerHTML=" "
      let totalPrice = 0;

      // Loop through cartItems to display them
      Object.keys(cartItems).forEach(itemName => {
        const item = cartItems[itemName];
        if (item.quantity > 0) {
          const itemTotalPrice = (item.quantity * item.price).toFixed(2);
          totalPrice += parseFloat(itemTotalPrice);
          numPrice.innerHTML=`<span>(${item.quantity})</span>`
          cartContainer.innerHTML += `<p>${itemName}: ${item.quantity} x $${item.price.toFixed(2)} = $${itemTotalPrice}</p>`;
        }
        cartTitle.innerHTML = `Your Cart <span class="num-Price">(${totalQuantity})</span>`;
        if (totalQuantity === 0) {
            cartContainer.innerHTML = `
                <img src="./assets/images/illustration-empty-cart.svg"/>
                <p>Your added items will appear here</p>
            `;
        }
      });

      if (totalPrice > 0) {
        cartContainer.innerHTML += `<p><strong>Order Total <span> $${totalPrice.toFixed(2)}</span></strong></p>`;
      } else {
        cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
      }
    }

    
    window.toggleQuantity = function(productName, price) {
        const addToCartButton = document.querySelector(`.add-to-cart[onclick="toggleQuantity('${productName}', ${price})"]`);

        
        addToCartButton.style.backgroundColor = 'red'; 
        addToCartButton.innerHTML = `
            <img src="./assets/images/icon-decrement-quantity.svg" class="icon" alt="Subtract" onclick="changeQuantity('${productName}', ${price}, -1)">
            <span id="quantity-${productName.replace(/\s+/g, '')}">1</span>
            <img src="./assets/images/icon-increment-quantity.svg" class="icon" alt="Add" onclick="changeQuantity('${productName}', ${price}, 1)">
        `;

       
        cartItems[productName] = { quantity: 1, price: price };
        updateCart();
    };

  
    window.changeQuantity = function(productName, price, change) {
        const quantitySpan = document.getElementById(`quantity-${productName.replace(/\s+/g, '')}`);
        
        if (quantitySpan) {
            let currentQuantity = parseInt(quantitySpan.textContent);
            currentQuantity += change;

            if (currentQuantity < 0) currentQuantity = 0; 
            quantitySpan.textContent = currentQuantity;

            
            if (currentQuantity === 0) {
                delete cartItems[productName]; 
                const addToCartButton = document.querySelector(`.add-to-cart[onclick="toggleQuantity('${productName}', ${price})"]`);
                addToCartButton.style.backgroundColor = ''; 
                addToCartButton.innerHTML = `
                    <img src="./assets/images/icon-add-to-cart.svg"/>
                    <span>Add to Cart</span>
                `;
            } else {
                cartItems[productName].quantity = currentQuantity; 
            }

            updateCart(); 
        } else {
            console.error(`Quantity span for ${productName} not found!`); // Error if span is missing
        }
    };


    data.forEach(item => {
        const column = document.createElement('div');
        column.classList.add('col-12', 'col-md-4', 'mb-4'); 
        
        column.innerHTML = `
            <div class="card h-100 position-relative">
                <div>${getImageSource(item.image)}</div>
                <div class="quantity-container position-absolute" style="bottom: 10px; left: 50%; transform: translateX(-50%);">
                    <button class="add-to-cart" onclick="toggleQuantity('${item.name}', ${item.price})">
                        <img src="./assets/images/icon-add-to-cart.svg"/>
                        <span>Add to Cart</span>
                    </button>
                </div>
                <div class="card-body">
                    <p class="card-title">${item.name}</p>
                    <h2 class="card-text">${item.category}</h2>
                    <h1 class="priceVal" ">$${item.price.toFixed(2)}</h1>
                </div>
            </div>
        `;
        
        content.appendChild(column);
    });
  })
  .catch(error => {
    console.error('Error fetching the data:', error);
  });
