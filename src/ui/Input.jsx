import PropTypes from "prop-types";

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  classN: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
};

function Input({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  classN = "",
  disabled = false,
}) {
  return (
    <input
      className={`rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-yellow-400 md:px-6 md:py-3 ${classN}`}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      disabled={disabled}
      required
    />
  );
}

export default Input;
