import React from 'react';

function App() {
  const handleClick = () => {
    alert('App is working!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>EduFlow - Testing Mode</h1>
      <p>If you see this and can click the button, the app is working.</p>
      <button 
        onClick={handleClick}
        style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Click Me
      </button>
      <p style={{ marginTop: '20px' }}>
        <a href="/login" style={{ color: 'blue' }}>Go to Login</a>
      </p>
    </div>
  );
}

export default App;