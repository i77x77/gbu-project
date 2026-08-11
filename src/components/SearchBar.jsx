import { useState, useEffect } from 'react';
import '../styles/SearchBar.css';

function SearchBar({ name, status, onSearch }) {
  /* Локальный стейт для мгновенного отображения ввода */
  const [localName, setLocalName] = useState(name);
  const [localStatus, setLocalStatus] = useState(status);

  /* Debounce: сообщаем наверх новое значение через 250мс после последнего
     изменения. Каждое новое изменение отменяет предыдущий таймер через cleanup. */
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(localName, localStatus);
    }, 250);

    return () => clearTimeout(timeout);
  }, [localName, localStatus, onSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Поиск по имени..."
        className="search-input"
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
      />
      <select
        className="search-select"
        value={localStatus}
        onChange={(e) => setLocalStatus(e.target.value)}
      >
        <option value="">Все статусы</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
  );
}

export default SearchBar;
