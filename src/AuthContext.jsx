import { createContext, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}
export function AuthProvider({ children }) {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [isAuthenticated, setIsAuthenticated] = useState(cookies['access_token'] ? true : false);
    const [user, setUser] = useState(localStorage.getItem('uuid') ? localStorage.getItem('uuid') : null);

    const login = async (email, password) => {
        try {
            const response = await fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            console.log(response.data);
            console.log(response.headers);
            if (response.ok) {
                const userData = await response.json();
                console.log(userData);
                localStorage.setItem('uuid', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                console.error('Authentication failed');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setIsAuthenticated(false);
        }
    };

    const signup = async (email, password, phone, owner) => {
        try {
            const res = await fetch('/signup/', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({email, password, phone, owner})
            });

            if(res.status == 201) {
                const {message, user_id} = await res.json();
                window.alert(message);
                localStorage.setItem('uuid', {message, user_id});
            }

        } catch (error) {
            window.alert(error);
        }
    }

    const logout = async () => {
        try {
            const response = await fetch(`/logout`, { method: 'GET' });

            if (response.ok) {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('user');
                return response.status(200).json('Logged In');
            } else {
                console.error('Error during Logout');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}
