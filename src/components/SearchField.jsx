export default function SearchField({ name, label, icon, value, error, onChange, onBlur, placeholder, title }) {
  return (
    <div className="search-input-box">
      {icon}
      <div className="search-input-content">
        <label htmlFor={`search-${name}`} className="search-input-label">{label}</label>
        <input id={`search-${name}`} name={name} type="text" value={value}
          onChange={onChange} onBlur={onBlur} placeholder={placeholder} title={title}
          aria-invalid={Boolean(error)} aria-describedby={error ? `error-${name}` : undefined} />
        {error && <small id={`error-${name}`} role="alert">{error}</small>}
      </div>
    </div>
  );
}
