const secure_fetch = (url, options) => {
  let { headers, accessToken, ...fetchOptions } = options;
  if (accessToken) {
    const bearerToken = `Bearer ${accessToken}`;
    fetchOptions = {
      ...fetchOptions,
      ...{
        headers: { Authorization: bearerToken }
      }
    };
  }
  return fetch(url, {
    ...fetchOptions,
    ...{ headers: { ...fetchOptions.headers, ...headers } }
  });
};

export { secure_fetch };
