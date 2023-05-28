const NavItem = ({ children, className, onClick, style }) => {
  return (
    <li
      onClick={onClick}
      style={style}
      className={
        `flex hover:bg-[#161B22] transition duration-300 px-2 py-2 rounded ` +
        className
      }
    >
      {children}
    </li>
  );
};

export default NavItem;
