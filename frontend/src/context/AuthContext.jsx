import {createContext, useState} from 'react';
export const AuthContext = createContext(null);

function getSavedUser(){
    try{
        const savedUser = localStorage.getItem('userInfo');

        return savedUser ? JSON.parse(savedUser):null;

    }
    catch (error){
        console.error('Could not saved user information:', error);
        localStorage.removeItem('userInfo');
        return null;
    }
}

export const AuthProvider = ({children}) => {
    const[user, setUser] = useState(getSavedUser);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    }

    return (
        <AuthContext.Provider value ={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
