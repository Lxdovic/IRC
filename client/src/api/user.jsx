import { get, patch } from "./index";

export const whoami = () => get("/api/whoami");
export const searchUser = (username) => get("/api/users?username=" + username);
export const getUser = (userId) => get("/api/user?userId=" + userId);
export const updateUser = (formData) => patch("/api/users/nick", formData);