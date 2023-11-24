import io from 'socket.io-client'
import { useState, useEffect } from 'react'
import './App.css';

const socket = io('https://chatback-lmc1.onrender.com');

const App = () => {

  const [inputValue, setInputValue] = useState('')
  const [user, setUser] = useState('')
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const handlerSubmit = (e) => {

    e.preventDefault();

    const newMessage = {
      body: mensaje,
      from: user
    }
    setMensajes([...mensajes, newMessage]);
    socket.emit('message', newMessage);
    setMensaje('');
  }

  useEffect(() => {

    socket.on('message', reciveMessage);
    return () => {
      socket.off('message', reciveMessage);
    }
  }, [])

  const reciveMessage = (message) => {
    setMensajes(state => [...state, message]);
  }

  return (
    <div>
      {
        user !== ''?(
          <div className='container'>
          <div className='chat'>
            <ul>
              {
                mensajes.map((m, i) => (
                  <li className={m.from === user? 'userMessage': 'otherMessage'} key={i}><h5>{m.from}</h5>  {m.body}</li>
                ))
              }
            </ul>
            <form onSubmit={handlerSubmit}>
              <input className='inputMessage' value={mensaje} type="text" placeholder='Escribi tu mensaje' onChange={(e) => setMensaje(e.target.value)} />
              <button type='submit' className='enviarBtn'>Enviar</button>
            </form>
          </div>
        </div>
        ):(<div className='login'>
          <h1>Ingrese su nombre</h1>
          <input type="text" placeholder='Escribe tu nombre' onChange={(e) => setInputValue(e.target.value)} />
          <button onClick={()=>setUser(inputValue)}>Entrar</button>
        </div>)
      }
    </div>
  )
}

export default App