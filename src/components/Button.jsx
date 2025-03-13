const Button = ({ text, onClick, type = "primary" }) => {
    return (
      <button 
        className={type} 
        onClick={onClick} 
        style={styles[type]}>
        {text}
      </button>
    );
  };
  
  const styles = {
    primary: {
      backgroundColor: 'var(--primary-purple)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--secondary-green)',
      color: 'white',
    },
  };
  
  export default Button;
  