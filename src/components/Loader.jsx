import '../styles/Loader.css';

function Loader({ size = 'medium', inline = false }) {
  const sizeMap = {
    small: '30px',
    medium: '50px',
    large: '70px',
  };

  const borderSizeMap = {
    small: '3px',
    medium: '4px',
    large: '5px',
  };

  const style = {
    width: sizeMap[size],
    height: sizeMap[size],
    borderWidth: borderSizeMap[size],
  };

  const wrapperStyle = inline 
    ? { padding: '16px 0', minHeight: 'auto' } 
    : { padding: '40px 0', minHeight: '200px' };

  return (
    <div className="loader-wrapper" style={wrapperStyle}>
      <div className="spinner" style={style}></div>
    </div>
  );
}

export default Loader;