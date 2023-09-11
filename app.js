const express = require('express');
const { getDatabase, ref, get, set } = require("firebase/database");
const admin = require('firebase-admin');
const { initializeApp } = require("firebase/app");

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDMn66CHUPYG_mFSJhfw8wDDk7pNSOrIPQ",
  authDomain: "bdescuela-38f74.firebaseapp.com",
  databaseURL: "https://bdescuela-38f74-default-rtdb.firebaseio.com",
  projectId: "bdescuela-38f74",
  storageBucket: "bdescuela-38f74.appspot.com",
  messagingSenderId: "397977273575",
  appId: "1:397977273575:web:dc1fb1756e7107b98a4e42"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);


// Configura Firebase Admin SDK (para autenticación y acceso a la base de datos)
const adminConfig = {
  credential: admin.credential.applicationDefault(),
  databaseURL: "http://localhost:3000" // URL de la base de datos Firebase
};
admin.initializeApp(adminConfig);


// Crear una instancia de Express
const server = express();
server.use(express.json());
const port = 3000; // Puerto en el que escuchará el servidor Express

// Ruta para obtener datos de Firebase
server.get('/api/data', async (req, res) => {
  try {
    // Obtiene una referencia a la base de datos de Firebase
    const db = getDatabase();

    // Ruta específica de la base de datos que deseas consultar
    const dataRef = ref(db, 'alumnos'); // Reemplaza con la ruta real

    // Realiza la consulta de datos
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      // Si los datos existen, los envía como respuesta
      const data = snapshot.val();
      res.json(data);
    } else {
      res.status(404).json({ error: 'No se encontraron datos' });
    }
  } catch (error) {
    console.error('Error al obtener datos de Firebase:', error);
    res.status(500).json({ error: 'Error al obtener datos de Firebase' });
  }
});

server.post('/api/insertar', async (req, res) => {
  try {
    // Obtiene una referencia a la base de datos de Firebase
    const db = getDatabase();

    // Ruta específica de la base de datos donde deseas insertar datos
    const dataRef = ref(db, '/alumnos'); // Reemplaza con la ruta real

    // Datos que deseas insertar (pueden provenir del cuerpo de la solicitud HTTP)
    console.log(req.body);
    const newData = {
      nombre: req.body.nombre,
      // Agrega otros campos según tu estructura de datos
    };

    // Realiza la inserción de datos en Firebase
    await set(dataRef, newData);

    res.status(201).json({ message: 'Datos insertados correctamente' });
  } catch (error) {
    console.error('Error al insertar datos en Firebase:', error);
    res.status(500).json({ error: 'Error al insertar datos en Firebase' });
  }
});


// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
