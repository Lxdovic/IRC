import CommandListItem from "./CommandListItem.jsx";

const CommandMenu = ({
  message,
  setMessage,
  commandSuggestions,
  selectedSuggestionIndex,
  setSelectedSuggestionIndex,
  showCommandMenu,
  className,
}) => {
  // TODO: implementation of handleKeyDownCommandMenu
  const handleKeyDownCommandMenu = (event) => {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        setMessage(commandSuggestions.at(selectedSuggestionIndex));
        break;

      case "ArrowUp":
        event.preventDefault();
        setSelectedSuggestionIndex(
          selectedSuggestionIndex === 0
            ? commandSuggestions.length - 1
            : selectedSuggestionIndex - 1
        );
        break;

      case "ArrowDown":
      case "Tab":
        event.preventDefault();
        setSelectedSuggestionIndex(
          selectedSuggestionIndex === commandSuggestions.length - 1
            ? 0
            : selectedSuggestionIndex + 1
        );
        break;

      default:
        setMessage(message + event.key);
        break;
    }
  };

  return (
    <ul
      className={`flex flex-col ${
        showCommandMenu ? "" : "hidden"
      } ${className}`}
    >
      {commandSuggestions.map((item, index) => (
        <li key={index} onClick={() => setMessage(item.label)}>
          <CommandListItem
            item={item}
            // isSelected={index === selectedSuggestionIndex}
          />
        </li>
      ))}
    </ul>
  );
};

export default CommandMenu;
