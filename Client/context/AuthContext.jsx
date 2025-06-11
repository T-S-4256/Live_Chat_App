import { createContext } from "react";
import { useContext } from "react";
import axios from "axios"
import { useState } from "react";
import toast from "react-hot-toast"
import { useEffect } from "react";
import { io } from "socket.io-client"
import { data } from "react-router-dom";



const backend_url = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backend_url

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);


    // CHECK IF THE USER IS AUTHENTICATED AND IF SO, SET THE USER DATA AND CONNECT THE SOCKET 
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }





    // LOGIN FUNCTION TO AUTHENTICATE USER AND SOCKET CONNECTION 
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common['token'] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }
            else {
                console.log("Unsuccess")
                toast.error(data.message);
            }
        }
        catch (error) {
            console.log("Error")
            toast.error(error.message);
        }
    }



    // LOG OUT FUNCTION TO HANDLE USER LOG OUT AND SOCKET DISCONNECTION 
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common['token'] = null;
        toast.success("Logged Out Successfully");
        socket.disconnect();
    }

    // UPDATE USER FUNCTION TO HANDLE UPDATE USER PROFILE 
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully");
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }




    // CONNECT SOCKET FUNCTION TO HANDLE SOCKET CONNECTIONS AND ONLINE USER UPDATES 
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backend_url, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userId) => {
            console.log("User ID : ", userId)
            setOnlineUsers(userId);
        })
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['token'] = token;
        }
        checkAuth();
    }, []);



    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
