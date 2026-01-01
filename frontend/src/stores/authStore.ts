import {create} from "zustand";
import {persist} from "zustand/middleware";

import {User} from "@/types";
import {userService} from "@/services/user.service.ts";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;

    // Actions
    fetchUser: () => Promise<void>;
    setAuth: (user: User) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,

            fetchUser: async () => {
                set({isLoading: true});
                const {isAuthenticated, clearAuth} = get();

                if (!isAuthenticated) return;

                try {
                    const user = await userService.getCurrentUser();
                    if (!user) return clearAuth();
                    set({
                        user,
                        isAdmin: user.role === "ADMIN",
                        isLoading: false
                    });
                } catch (error) {
                    console.error(error);
                    clearAuth();
                }
            },

            setAuth: (user: User) => {
                set({
                    user,
                    isAuthenticated: true,
                    isAdmin: user.role === "ADMIN"
                });
            },

            clearAuth: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false,
                    isLoading: false
                });
            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);
