const InputField = ({ label, type, value, onChange, placeholder }) => {
    return (
      <div style={styles.container}>
        <label>{label}</label>
        <input 
          type={type} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          style={styles.input}
        />
      </div>
    );
  };
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '15px',
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      backgroundColor: 'var(--field-bg)',
    },
  };
  
  export default InputField;
  