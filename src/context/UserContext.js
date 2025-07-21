import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
    // 전역에서 세션값 사용
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // 세션 로딩 여부

    useEffect(() => {
        fetch('http://localhost/session', {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('세션 없음');
        })
        .then(data => {
            setUser(data);
            console.log('세션 데이터:', data);
        })
        .catch(() => setUser(null))
        .finally(() => setLoading(false)); // 로딩 끝
    }, []);


    return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}