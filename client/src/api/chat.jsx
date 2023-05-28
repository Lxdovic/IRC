
import { get, post, patch, del } from "./index";

export const modifyRoom = (formData, id) => patch("/api/room/" + id, formData);
export const createRoom = (formData) => post("/api/rooms", formData);
export const getRooms = () => get("/api/rooms");
export const getAllRooms = () => get("/api/rooms/all");
export const getRoomByName = (name) => get(`/api/rooms/by-name/${name}`)
export const joinRoom = (id) => patch(`/api/room/join/${id}`);
export const joinRoomByName = (name) => patch(`/api/room/join/by-name/${name}`);
export const leaveRoom = (id) => patch(`/api/room/leave/${id}`);
export const deleteRoom = (id) => del(`/api/room/${id}`);
export const deleteRoomByName = (name) => del(`/api/room/by-name/${name}`);