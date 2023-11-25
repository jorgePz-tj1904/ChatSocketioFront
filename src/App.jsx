import io from 'socket.io-client'
import { useState, useEffect, useRef } from 'react'
import './App.css';
import { SendOutlined } from '@ant-design/icons';

const socket = io('https://chatback-lmc1.onrender.com');

const App = () => {

  const [inputValue, setInputValue] = useState('')
  const [user, setUser] = useState('')
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handlerSubmit = (e) => {

    e.preventDefault();
    scrollToBottom();
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
    scrollToBottom();
    return () => {
      socket.off('message', reciveMessage);
    }
  }, [mensajes])

  const reciveMessage = (message) => {
    setMensajes(state => [...state, message]);
  }

  return (
    <div>
      {
        user !== '' ? (
          <div className='container'>
            <div className='chat'>
              <div id='header'>
                <h3>Chat Global</h3>
              </div>
              {
                mensajes.length === 0? <div id='chatVacio'><h4>No se enviaron mensajes desede que abriste el chat.</h4><h4>Recuerda que si sales de la pagina o recargas la misma se perderan todos los mensajes.</h4></div>: null
              }
              <ul>
                {
                  mensajes.map((m, i) => (
                    <li className={m.from === user ? 'userMessage' : 'otherMessage'} key={i}><h5>{m.from}</h5> <p>{m.body}</p></li>
                  ))
                }
                <div ref={messagesEndRef} />
              </ul>
              <form id='formMensaje' onSubmit={handlerSubmit}>
                <input className='inputMessage' value={mensaje} type="text" placeholder='Escribi tu mensaje' onChange={(e) => setMensaje(e.target.value)} />
                <button type='submit' className='enviarBtn'><SendOutlined /></button>
              </form>
            </div>
          </div>
        ) : (<div className='login'>
          <form id='fomrLogin' action="" onSubmit={() => setUser(inputValue)}>
            <h1>Ingrese su nombre</h1>
            <input type="text" placeholder='Escribe tu nombre' onChange={(e) => setInputValue(e.target.value)} />
            <button>Entrar</button>
          </form>
        </div>)
      }
    </div>
  )
}

export default App