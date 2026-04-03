export function httpClient(url, options = {}) {
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  });
}
