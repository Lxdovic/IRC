const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.user;
    case "DEL_USER":
      return {};
    default:
      return state;
  }
};

export default userReducer;
