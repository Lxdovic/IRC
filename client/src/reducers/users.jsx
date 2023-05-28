const usersReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_USERS":
      return action.users;
    case "ADD_USER": {
      if (state.some((user) => user._id === action.user._id)) {
        let newState = state.map((user) => {
          if (user._id === action.user._id) {
            return action.user;
          }

          return user;
        });

        return newState;
      }

      return [...state, action.user];
    }
    case "DEL_USERS":
      return [];
    default:
      return state;
  }
};

export default usersReducer;
