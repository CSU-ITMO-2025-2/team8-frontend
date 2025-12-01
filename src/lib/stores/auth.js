import { writable } from "svelte/store";

export const auth = writable({
    login: null,
    password: null,
    token: null   // Base64(login:password)
});

export function setAuth(login, password) {
    const token = btoa(`${login}:${password}`);
    auth.set({ login, password, token });
}

export function clearAuth() {
    auth.set({ login: null, password: null, token: null });
}
