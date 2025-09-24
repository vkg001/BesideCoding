import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  loading: true, // Start as true to indicate initial check is pending

  // Actions
  /**
   * Called on successful login/signup to manually set the user state.
   * This avoids an extra network request.
   */
  login: (userData) => set({ user: userData, loading: false }),

  /**
   * Called on logout.
   */
  logout: () => set({ user: null, loading: false }),

  /**
   * Checks the session with the backend.
   * This is used on initial app load or page refresh.
   */
  checkSession: async () => {
    try {
      // The `withCredentials: true` is crucial for sending the session cookie
      const res = await axios.get('api/session-user', { withCredentials: true });
      if (res.data && res.data.userId) {
        set({ user: res.data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error("No active session", error);
      set({ user: null, loading: false });
    }
  },
}));

export default useAuthStore;