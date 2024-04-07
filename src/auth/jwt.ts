export const getJwt = (authorization: string) => {
  // Bearer JWT in case that we cannot setCookie through different AWS domains
  if (authorization && authorization.startsWith('Bearer')) {
    return authorization.substring(7, authorization.length);
  }
};
