import { createContext, useState, useEffect } from "react";

import { getMe } from "./services/auth.api";



export const AuthContext = createContext()



export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });
    
    // We can avoid showing the loading screen if we already rehydrated a user
    const [loading, setLoading] = useState(user === null);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                console.log(err);
                if (err.response?.status === 401) {
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };
        getAndSetUser();
    }, []);



    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>


    )

}