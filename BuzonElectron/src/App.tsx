import { useState } from 'react'
import img from './assets/google.png'
import recepcion from './assets/recepcion.jpg'

import './App.css'

function App() {
  const [pressed, setPressed] = useState(false);

  const handleButtonClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 300);
  };

  return (
    <>
      <img className='logo' src={img} />
      <div className='recepcion' ><img src={recepcion} /></div>
      <button
        className={`custom-button ${pressed ? 'pressed' : ''}`}
        onClick={handleButtonClick}>
        Presiona aquí para dejar 
        tu documentación
      </button>
    </>
  )
}

export default App
