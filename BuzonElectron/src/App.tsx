import { useState, useEffect} from 'react'
import img from './assets/google.png'
import recepcion from './assets/recepcion.jpg'

import './App.css'

function App() {
  const [pressed, setPressed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
      }, 4000); // 8000 milisegundos (8 segundos)

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showPopup]);


  const handleButtonClick = () => {
    setTimeout(() => setPressed(false), 300);
    setPressed(true);
    window.ipcRenderer.send('data','open');
    setShowPopup(true);
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
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            Deposite su documentación y recoja su recibo de acuse. ¡Gracias!
          </div>
        </div>
      )}
    </>
  )
}

export default App
