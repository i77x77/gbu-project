import './filterBar.css';

const Search = ({ value, onChange, placeholder = 'Поиск...' }) => {
  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Search;