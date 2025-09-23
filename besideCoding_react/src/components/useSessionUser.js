// src/components/useSessionUser.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useSessionUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/session-user', { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  return { user, loading };
};

export default useSessionUser;
