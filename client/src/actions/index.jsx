export const setUser = (user) => {
  return { type: "SET_USER", user };
};

export const delUser = () => {
  return { type: "DEL_USER" };
};
