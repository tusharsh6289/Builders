document.addEventListener('DOMContentLoaded', () => {
  const currentUserMobile = localStorage.getItem('currentUserMobile');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find(u => u.mobile === currentUserMobile);

  
  const mummys = users.filter(u => u.role === 'mummy' && u.pincode === currentUser.pincode && u.mealsLeft > 0);
  renderMummys(mummys);

  
  updateCartCount();

  document.getElementById('cart-btn').addEventListener('click', toggleCart);
  document.getElementById('cart-close').addEventListener('click', toggleCart);
  document.getElementById('checkout-btn').addEventListener('click', placeOrder);

  document.querySelector('.profile-dropdown').addEventListener('click', () => {
      document.querySelector('.dropdown-content').classList.toggle('show');
  });

  
  if(currentUser.profilePicture) {
      document.getElementById('profile-pic').src = currentUser.profilePicture;
  }
});

function renderMummys(mummys) {
  const container = document.getElementById('mummy-listings');
  container.innerHTML = mummys.map(mummy => `
      <div class="mummy-card" data-id="${mummy.mobile}">
          <img src="${mummy.profilePicture || 'resources/images1/avatar1.png'}" 
               alt="${mummy.firstName}" 
               class="mummy-photo">
          <h3>${mummy.firstName}'s Kitchen</h3>
          <div class="mummy-info">
              <span>⭐ ${mummy.rating || '4.5'}</span>
              <span>📍 ${mummy.distance || '1.5'} km</span>
          </div>
          <p class="availability">🍛 ${mummy.mealsLeft || '20'} meals left today</p>
          <button class="view-menu-btn" onclick="viewMenu('${mummy.mobile}')">View Menu</button>
      </div>
  `).join('');
}

function viewMenu(mummyMobile) {
  const mummy = JSON.parse(localStorage.getItem('users'))
      .find(u => u.mobile === mummyMobile);

  const modal = document.getElementById('menu-modal');
  document.getElementById('mummy-name').textContent = `${mummy.firstName}'s Menu`;

  const menuItems = document.getElementById('menu-items');
  menuItems.innerHTML = (mummy.menu || []).map(item => `
      <div class="menu-item">
          <div class="item-info">
              <h4>${item.name}</h4>
              <p>${item.description || ''}</p>
              <span>₹${item.price+30}</span>
          </div>
          <button class="add-to-cart" 
                  onclick="addToCart('${mummy.mobile}', '${item.name}', ${item.price})">
              Add to Cart
          </button>
      </div>
  `).join('');

  modal.style.display = 'flex';
}

function addToCart(mummyMobile, itemName, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item =>
      item.mummyMobile === mummyMobile && item.name === itemName);

  if(existingItem) {
      existingItem.quantity++;
  } else {
      cart.push({
          mummyMobile,
          name: itemName,
          price,
          quantity: 1
      });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartSidebar();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.getElementById('cart-count').textContent = cart.length;
}

function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  sidebar.classList.toggle('active');
  updateCartSidebar();
}

function updateCartSidebar() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItems = document.getElementById('cart-items');

  cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
          <div class="item-details">
              <h4>${item.name}</h4>
              <p>₹${item.price} x ${item.quantity}</p>
          </div>
          <button onclick="removeFromCart('${item.mummyMobile}', '${item.name}')">×</button>
      </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + ((item.price) * item.quantity), 0);
  document.getElementById('cart-subtotal').textContent = `₹${subtotal}`;
  document.getElementById('cart-total').textContent = `₹${subtotal+30}`;
}

function placeOrder() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUserMobile = localStorage.getItem('currentUserMobile');
  const currentUser = users.find(u => u.mobile === currentUserMobile);

  cart.forEach(item => {
    
      const mummy = users.find(u => u.mobile === item.mummyMobile);
      if (mummy) {
          mummy.mealsLeft = Math.max(mummy.mealsLeft - item.quantity, 0);
          mummy.totalMeals += item.quantity;
      }

      
      orders.push({
          id: Date.now(),
          mummyMobile: item.mummyMobile,
          mummyName: mummy.firstName,
          customerMobile: currentUserMobile,
          customerName: currentUser.firstName,
          item: item.name,
          quantity: item.quantity,
          price: item.price,
          status: 'pending',
          timestamp: new Date().toISOString()
      });
  });

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.removeItem('cart');
  updateCartCount();
  toggleCart();
  alert('Order placed successfully!');
}

window.removeFromCart = (mummyMobile, itemName) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item =>
      !(item.mummyMobile === mummyMobile && item.name === itemName)
  );
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartSidebar();
};


window.onclick = function(event) {
  const modal = document.getElementById('menu-modal');
  if (event.target === modal) {
      modal.style.display = 'none';
  }

  const dropdowns = document.getElementsByClassName("dropdown-content");
  for (let i = 0; i < dropdowns.length; i++) {
      if (!event.target.matches('.profile-dropdown *')) {
          dropdowns[i].classList.remove('show');
      }
  }
}
