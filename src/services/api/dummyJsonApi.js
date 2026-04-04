import { httpClient } from '../http/httpClient';

const BASE_URL = 'https://dummyjson.com';
const getCache = new Map();
const pendingGetRequests = new Map();

function jsonRequest(url, method, body) {
  return httpClient(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function cachedGet(key, fetcher) {
  if (getCache.has(key)) {
    return getCache.get(key);
  }

  if (pendingGetRequests.has(key)) {
    return pendingGetRequests.get(key);
  }

  const request = fetcher()
    .then((data) => {
      getCache.set(key, data);
      pendingGetRequests.delete(key);
      return data;
    })
    .catch((error) => {
      pendingGetRequests.delete(key);
      throw error;
    });

  pendingGetRequests.set(key, request);
  return request;
}

function invalidateGetCache(key) {
  getCache.delete(key);
  pendingGetRequests.delete(key);
}

export function getUsers() {
  return cachedGet('users', async () => {
    const response = await httpClient(`${BASE_URL}/users?limit=100`);
    return response.users || [];
  });
}

export function addUser(payload) {
  return jsonRequest(`${BASE_URL}/users/add`, 'POST', payload).then((response) => {
    invalidateGetCache('users');
    return response;
  });
}

export function updateUser(id, payload) {
  return jsonRequest(`${BASE_URL}/users/${id}`, 'PUT', payload).then((response) => {
    invalidateGetCache('users');
    return response;
  });
}

export function getCarts() {
  return cachedGet('carts', async () => {
    const response = await httpClient(`${BASE_URL}/carts?limit=100`);
    return response.carts || [];
  });
}

export function addOrder(payload) {
  return jsonRequest(`${BASE_URL}/carts/add`, 'POST', payload).then((response) => {
    invalidateGetCache('carts');
    return response;
  });
}

export function updateOrder(id, payload) {
  return jsonRequest(`${BASE_URL}/carts/${id}`, 'PUT', payload).then((response) => {
    invalidateGetCache('carts');
    return response;
  });
}

export function getProducts() {
  return cachedGet('products', async () => {
    const response = await httpClient(`${BASE_URL}/products?limit=100`);
    return response.products || [];
  });
}

export function addProduct(payload) {
  return jsonRequest(`${BASE_URL}/products/add`, 'POST', payload).then((response) => {
    invalidateGetCache('products');
    return response;
  });
}

export function updateProduct(id, payload) {
  return jsonRequest(`${BASE_URL}/products/${id}`, 'PUT', payload).then((response) => {
    invalidateGetCache('products');
    return response;
  });
}

export function getComments() {
  return cachedGet('comments', async () => {
    const response = await httpClient(`${BASE_URL}/comments?limit=100`);
    return response.comments || [];
  });
}

export function addComment(payload) {
  return jsonRequest(`${BASE_URL}/comments/add`, 'POST', payload).then((response) => {
    invalidateGetCache('comments');
    return response;
  });
}

export function updateComment(id, payload) {
  return jsonRequest(`${BASE_URL}/comments/${id}`, 'PUT', payload).then((response) => {
    invalidateGetCache('comments');
    return response;
  });
}

export function getPosts() {
  return cachedGet('posts', async () => {
    const response = await httpClient(`${BASE_URL}/posts?limit=100`);
    return response.posts || [];
  });
}

export function addPost(payload) {
  return jsonRequest(`${BASE_URL}/posts/add`, 'POST', payload).then((response) => {
    invalidateGetCache('posts');
    return response;
  });
}

export function updatePost(id, payload) {
  return jsonRequest(`${BASE_URL}/posts/${id}`, 'PUT', payload).then((response) => {
    invalidateGetCache('posts');
    return response;
  });
}

export function getTodos() {
  return cachedGet('todos', async () => {
    const response = await httpClient(`${BASE_URL}/todos?limit=100`);
    return response.todos || [];
  });
}

export function addTodo(payload) {
  return jsonRequest(`${BASE_URL}/todos/add`, 'POST', payload).then((response) => {
    invalidateGetCache('todos');
    return response;
  });
}

export function updateTodo(id, payload) {
  return jsonRequest(`${BASE_URL}/todos/${id}`, 'PUT', payload).then((response) => {
    invalidateGetCache('todos');
    return response;
  });
}
