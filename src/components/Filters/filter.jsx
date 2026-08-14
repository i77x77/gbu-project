import './filterBar.css';

const Filter = ({ value, onChange, options, placeholder = 'Все' }) => {
  return (
    <select className="status-filter" value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Filter;