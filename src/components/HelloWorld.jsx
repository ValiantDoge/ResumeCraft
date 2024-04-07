import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HelloWorld() {
  const [msg, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/create-resume/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1 className='text-3xl font-bold underline'>Hello, World!</h1>
      <p>{msg}</p>
    </div>
  );
}

export default HelloWorld;