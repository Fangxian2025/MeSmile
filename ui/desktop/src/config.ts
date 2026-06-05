export const getApiUrl = (endpoint: string): string => {
  const mesmileApiHost = String(window.appConfig.get('GOOSE_API_HOST') || '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${mesmileApiHost}${cleanEndpoint}`;
};
