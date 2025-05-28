import fetch from 'node-fetch';

const BASE_URL = 'https://fakestoreapi.com';

const getAllProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  const data = await res.json();
  console.log(data);
};

const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) {
    console.log(`Producto con id ${id} no encontrado (status ${res.status})`);
    return;
  }
  const data = await res.json();
  console.log(data);
};

const createProduct = async (title, price, category) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    body: JSON.stringify({ title, price: parseFloat(price), category }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  console.log('Producto creado:', data);
};

const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  console.log('Producto eliminado:', data);
};

const main = async () => {
  const [,, method, resource, ...args] = process.argv;

  if (method === 'GET') {
    if (resource === 'products') {
      await getAllProducts();
    } else if (resource.startsWith('products/')) {
      const id = resource.split('/')[1];
      await getProductById(id);
    } else {
      console.log('Comando GET no reconocido.');
    }

  } else if (method === 'POST' && resource === 'products') {
    const [title, price, category] = args;
    if (!title || !price || !category) {
      console.log('Faltan argumentos: <title> <price> <category>');
      return;
    }
    await createProduct(title, price, category);

  } else if (method === 'DELETE' && resource.startsWith('products/')) {
    const id = resource.split('/')[1];
    await deleteProduct(id);

  } else {
    console.log('Comando no reconocido. Intenta con:\n' +
      'GET products\nGET products/<id>\n' +
      'POST products <title> <price> <category>\n' +
      'DELETE products/<id>');
  }
};

main();