// Obtener el carrito del localStorage o inicializarlo si no existe
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// Función para actualizar el carrito en la vista
function updateCart() {
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.querySelector('.cart-total');
    let total = 0;

    cartItemsElement.innerHTML = ''; // Limpiar la vista del carrito

    // Verificar si hay elementos en el carrito
    if (Object.keys(cart).length === 0) {
        cartItemsElement.innerHTML = '<p>El carrito está vacío</p>';
        cartTotalElement.textContent = 'Total: $0.00';
        return;
    }

    // Iterar sobre los productos en el carrito
    for (const [id, item] of Object.entries(cart)) {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="remove-item" data-id="${id}">Eliminar</button>
        `;
        cartItemsElement.appendChild(itemElement);
        total += item.price * item.quantity;
    }

    // Actualiza el total en la vista
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Función para agregar un producto al carrito
function addToCart(id, title, price, image) {
    if (cart[id]) {
        cart[id].quantity += 1;
    } else {
        cart[id] = { id, title, price, image, quantity: 1 };
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(); // Actualizar el carrito al agregar un producto
}

// Función para eliminar un producto del carrito
function removeFromCart(id) {
    if (cart[id]) {
        delete cart[id];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart(); // Actualizar el carrito al eliminar un producto
    }
}

// Event listener para el botón de agregar al carrito
document.addEventListener('click', function(e) {
    if (e.target && e.target.matches('.cta[cta-type="buy"]')) {
        const button = e.target;
        const itemElement = button.closest('.category__list--item');
        
        const id = button.getAttribute('data-title'); // Usa el atributo data-title como ID
        
        // Cambiar la selección del título y precio
        const title = itemElement.querySelector('.category__list__item--details .category__list__item--title').textContent;
        const price = parseFloat(itemElement.querySelector('.category__list__item--price .__item--price').textContent.replace(' USD', ''));
        const image = itemElement.querySelector('img') ? itemElement.querySelector('img').getAttribute('src') : ''; // Usa un valor por defecto si no hay imagen

        addToCart(id, title, price, image); // Agregar al carrito
    }

    if (e.target && e.target.classList.contains('remove-item')) {
        const id = e.target.getAttribute('data-id');
        removeFromCart(id); // Llamar a la función para eliminar el producto
    }
});

// Event listener para el botón de carrito
document.getElementById('toggleCart').addEventListener('click', function(e) {
    e.stopPropagation(); // Evita que el clic en el carrito cierre el carrito
    document.getElementById('cartMenu').classList.toggle('show');
});

// Cierra el carrito si se hace clic fuera de él
document.addEventListener('click', function(e) {
    const cartMenu = document.getElementById('cartMenu');
    const toggleCart = document.getElementById('toggleCart');

    if (cartMenu.classList.contains('show') && !cartMenu.contains(e.target) && e.target !== toggleCart) {
        cartMenu.classList.remove('show');
    }
});

// Event listener para el botón de finalizar compra
document.getElementById('checkoutButton').addEventListener('click', function() {
    window.location.href = '../checkout.html'; // Redirige a la página de pago
});

// Actualiza el carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateCart(); // Inicializar el carrito al cargar la página
});


