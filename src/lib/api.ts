export async function apiRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    // Cookies are automatically included with credentials: 'include'
    return fetch(url, {
      ...options,
      credentials: 'include', // Important: include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }