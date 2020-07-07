export const origin = (location.hostname === 'localhost') ? 'https://staging.online-zapis.com' : location.origin;

export function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || (data && data.exceptionMessage) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
