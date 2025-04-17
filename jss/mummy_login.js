document.addEventListener('DOMContentLoaded', () => {
    const currentUserMobile = localStorage.getItem('currentUserMobile');
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.mobile === currentUserMobile);

    
    user.menu = user.menu || [];

    
    document.getElementById('profile-name').textContent = user.firstName;
    document.getElementById('greet-name').textContent = user.firstName;
    document.getElementById('meals-left').textContent = user.mealsLeft;
    document.getElementById('meal-limit').textContent = user.mealLimit;
    document.getElementById('earnings-today').textContent = user.earningsToday;
    document.getElementById('earnings-week').textContent = user.earningsWeek;
    document.getElementById('earnings-lifetime').textContent = user.earningsLifetime;

    
    renderOrders();

    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-item').forEach(i =>
                i.classList.remove('active'));
            item.classList.add('active');
            const section = item.dataset.section;
            document.querySelectorAll('.section').forEach(sec =>
                sec.style.display = 'none');
            document.getElementById(`${section}-section`).style.display = 'block';
        });
    });

    
    let currentDishId = null;
    renderMenu();

    document.getElementById('add-dish-btn').onclick = () => {
        currentDishId = null;
        openModal('dish-modal');
    };

    document.getElementById('close-dish-modal').onclick = () => closeModal('dish-modal');
    document.getElementById('cancel-dish-btn').onclick = () => closeModal('dish-modal');

    document.getElementById('dish-form').onsubmit = e => {
        e.preventDefault();
        const dishData = {
            id: currentDishId || Date.now(),
            name: document.getElementById('dish-name').value,
            price: parseInt(document.getElementById('dish-price').value),
            qty: parseInt(document.getElementById('dish-qty').value),
            premium: document.getElementById('dish-premium').checked
        };

        const index = user.menu.findIndex(d => d.id === currentDishId);
        if (index > -1) {
            user.menu[index] = dishData;
        } else {
            user.menu.push(dishData);
        }
        saveMenu();
        renderMenu();
        closeModal('dish-modal');
    };

    window.editDish = id => {
        const dish = user.menu.find(d => d.id === id);
        if (dish) {
            document.getElementById('dish-name').value = dish.name;
            document.getElementById('dish-price').value = dish.price;
            document.getElementById('dish-qty').value = dish.qty;
            document.getElementById('dish-premium').checked = dish.premium;
            currentDishId = id;
            openModal('dish-modal');
        }
    };

    window.deleteDish = id => {
        if (confirm('Delete this dish permanently?')) {
            user.menu = user.menu.filter(d => d.id !== id);
            saveMenu();
            renderMenu();
        }
    };

    document.getElementById('save-meal-limit-btn').onclick = () => {
        let val = parseInt(document.getElementById('meal-limit-input').value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 20) val = 20;
        user.mealLimit = val;
        user.mealsLeft = val;
        saveMenu();
        document.getElementById('meal-limit').textContent = user.mealLimit;
        document.getElementById('meals-left').textContent = user.mealsLeft;
        alert('Meal limit updated!');
    };

    function renderOrders() {
        const orders = (JSON.parse(localStorage.getItem('orders')) || []).filter(o => o.mummyMobile === currentUserMobile);
        const ordersContainer = document.getElementById('orders-timeline');
        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-info">
                    <h3>${order.item} × ${order.quantity}</h3>
                    <p>Customer: ${order.customerName}</p>
                    <p>Status: ${order.status.toUpperCase()}</p>
                    <p>Order Time: ${new Date(order.timestamp).toLocaleTimeString()}</p>
                </div>
                ${order.status === 'pending' ? `
                <button class="btn save-btn" onclick="markPrepared(${order.id})">
                    Mark Prepared
                </button>` : ''}
            </div>
        `).join('');
    }

    window.markPrepared = orderId => {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex > -1) {
            orders[orderIndex].status = 'prepared';
            const order = orders[orderIndex];
            
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.mobile === currentUserMobile);
            const earnings = order.quantity * order.price;
            users[userIndex].earningsToday += earnings;
            users[userIndex].earningsWeek += earnings;
            users[userIndex].earningsLifetime += earnings;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('orders', JSON.stringify(orders));
            
            document.getElementById('earnings-today').textContent = users[userIndex].earningsToday;
            document.getElementById('earnings-week').textContent = users[userIndex].earningsWeek;
            document.getElementById('earnings-lifetime').textContent = users[userIndex].earningsLifetime;
            renderOrders();
        }
    };

    function renderMenu() {
        const menuContainer = document.getElementById('menu-cards');
        menuContainer.innerHTML = user.menu.length ? user.menu.map(dish => `
            <div class="menu-card${dish.premium ? ' premium' : ''}">
                <div class="dish-title">${dish.name}</div>
                <div class="dish-price">₹${dish.price}</div>
                <div class="dish-qty">Available: ${dish.qty}</div>
                <div class="card-actions">
                    <button class="btn edit-btn" onclick="editDish(${dish.id})">Edit</button>
                    <button class="btn delete-btn" onclick="deleteDish(${dish.id})">Delete</button>
                </div>
            </div>
        `).join('') : `<div style="color:#a05b00;">No dishes added yet.</div>`;
    }

    function saveMenu() {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.mobile === currentUserMobile);
        users[userIndex].menu = user.menu;
        users[userIndex].mealLimit = user.mealLimit;
        users[userIndex].mealsLeft = user.mealsLeft;
        localStorage.setItem('users', JSON.stringify(users));
    }

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
});
