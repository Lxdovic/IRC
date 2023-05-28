import { post, get } from "./index";

export const register = (formData) => post("/api/register", formData);
export const login = (formData) => post("/api/login", formData);
export const guestLogin = (formData) => post("/api/guest/login", formData);
