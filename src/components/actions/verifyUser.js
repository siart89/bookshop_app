const verifyUser = async () => {
  const resp = await fetch('/secret', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
    },
  });
  if (resp.status === 403) {
    const refreshResp = await fetch('/refresh', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('refreshToken'))}`,
      },
    });
    if (refreshResp.ok) {
      const refreshResult = await refreshResp.json();

      localStorage.setItem('token', JSON.stringify(refreshResult.token));
      localStorage.setItem('refreshToken', JSON.stringify(refreshResult.refreshToken));
      // Repeat request after refresh token
      verifyUser();
    } else {
      return false;
    }
  }
  return true;
};

export default verifyUser;
