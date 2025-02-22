import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL="http://localhost:5001"


export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [], // Add this line to initialize onlineUsers
  socket:null,
  
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      // Don't show error toast for auth check
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data });
      get().connectSocket()
      toast.success("Account created successfully");
      get().connectSocket()
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },
  
  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.msg || "Something went wrong");
    }
  },
  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.msg || "Something went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", formData);
      set({ authUser: res.formData});
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.msg || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket:()=>{
    const {authUser}=get();
    if(!authUser||get().socket?.connect) return;
    const socket =io(BASE_URL)
    socket.connect()
  

  },

  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();

  }
}));