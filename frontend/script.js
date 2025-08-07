const API = 'http://localhost:3000/api';

fetch(`${API}/products`)
  .then(res => res.json())
  .then(products => {
    const list = document.getElementById('product-list');
    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick='addToCart(${JSON.stringify(p)})'>Add to cart</button>
      `;
      list.appendChild(div);
    });
  });

function addToCart(product) {
  fetch(`${API}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...product, quantity: 1 })
  }).then(() => loadCart());
}

function loadCart() {
  fetch(`${API}/cart`)
    .then(res => res.json())
    .then(items => {
      const list = document.getElementById('cart');
      list.innerHTML = '';
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.quantity}`;
        list.appendChild(li);
      });
    });
}

function checkout() {
  fetch(`${API}/checkout`, {
    method: 'POST'
  })
    .then(res => res.json())
    .then(data => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout failed!');
      }
    });
}

loadCart();
