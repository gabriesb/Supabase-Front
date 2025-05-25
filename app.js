const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductDescription = document.querySelector('#update-description');
const updateProductPrice = document.querySelector('#update-price');

const searchInput = document.querySelector('#search-id');
const searchButton = document.querySelector('#search-button');
const searchResult = document.querySelector('#search-result');

const BASE_URL = 'http://34.229.203.152:3000';

// === Listar todos os produtos ===
async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products`);
  const products = await response.json();

  productList.innerHTML = '';
  products.forEach(product => appendProductToList(product));
}

function appendProductToList(product) {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>${product.name}</strong> - $${product.price}<br>
    <em>${product.description}</em>
  `;

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.onclick = async () => {
    await deleteProduct(product.id);
    await fetchProducts();
  };

  const updateButton = document.createElement('button');
  updateButton.innerText = 'Update';
  updateButton.onclick = () => {
    updateProductId.value = product.id;
    updateProductName.value = product.name;
    updateProductDescription.value = product.description;
    updateProductPrice.value = product.price;
  };

  li.appendChild(deleteButton);
  li.appendChild(updateButton);
  productList.appendChild(li);
}

// === Adicionar produto ===
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.name.value;
  const description = addProductForm.description.value;
  const price = addProductForm.price.value;
  await addProduct(name, description, price);
  addProductForm.reset();
  await fetchProducts();
});

async function addProduct(name, description, price) {
  await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
}

// === Atualizar produto ===
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value;
  const description = updateProductDescription.value;
  const price = updateProductPrice.value;
  await updateProduct(id, name, description, price);
  updateProductForm.reset();
  await fetchProducts();
});

async function updateProduct(id, name, description, price) {
  await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
}

// === Deletar produto ===
async function deleteProduct(id) {
  await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
}

// === Buscar produto por ID ===
async function getProductById(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;  // espera objeto do produto
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}

searchButton.addEventListener('click', async () => {
  const id = searchInput.value.trim();
  if (!id) {
    searchResult.innerHTML = '<p style="color:red">Please enter a valid ID.</p>';
    return;
  }

  const product = await getProductById(id);

  if (!product) {
    searchResult.innerHTML = '<p style="color:red">Product not found.</p>';
    return;
  }

  // Cria um container para listar todas as propriedades do produto
  const div = document.createElement('div');

  for (const [key, value] of Object.entries(product)) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${key}:</strong> ${value}`;
    div.appendChild(p);
  }

  // Botões Delete e Update
  const delButton = document.createElement('button');
  delButton.innerText = 'Delete';
  delButton.onclick = async () => {
    await deleteProduct(product.id);
    searchResult.innerHTML = '';
    await fetchProducts();
  };

  const updButton = document.createElement('button');
  updButton.innerText = 'Update';
  updButton.onclick = () => {
    updateProductId.value = product.id;
    updateProductName.value = product.name || '';
    updateProductDescription.value = product.description || '';
    updateProductPrice.value = product.price || '';
  };

  div.appendChild(delButton);
  div.appendChild(updButton);

  searchResult.innerHTML = '';
  searchResult.appendChild(div);
});

// === Inicializa a lista ao carregar a página ===
fetchProducts();
