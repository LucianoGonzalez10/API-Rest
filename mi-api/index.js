const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const rutaArchivo = './jugadores.json';

// Función para leer Jugadores
function leerJugadores() {
  const data = fs.readFileSync(rutaArchivo, 'utf-8');
  return JSON.parse(data);
}

// Función para guardar Jugadores
function guardarJugadores(Jugadores) {
  fs.writeFileSync(rutaArchivo, JSON.stringify(Jugadores, null, 2));
}

// Obtener todos los Jugadores
app.get('/Jugadores', (req, res) => {
  const Jugadores = leerJugadores();
  res.json(Jugadores);
});

// Obtener un Jugador por id
app.get('/Jugadores/:id', (req, res) => {
  const Jugadores = leerJugadores();
  const Jugador = Jugadores.find(p => p.id === parseInt(req.params.id));
  if (Jugador) {
    res.json(Jugador);
  } else {
    res.status(404).send('Jugador no encontrado');
  }
});

// Agregar un nuevo Jugador
app.post('/Jugadores', (req, res) => {
  const Jugadores = leerJugadores();
  const nuevoJugador = {
    id: Jugadores.length > 0 ? Jugadores[Jugadores.length - 1].id + 1 : 1,
    nombre: req.body.nombre,
    camiseta: req.body.camiseta,
    posicion: req.body.posicion
  };
  Jugadores.push(nuevoJugador);
  guardarJugadores(Jugadores);
  res.status(201).json(nuevoJugador);
});

// Eliminar un Jugador
app.delete('/Jugadores/:id', (req, res) => {
  let Jugadores = leerJugadores();
  const JugadoresFiltrados = Jugadores.filter(p => p.id !== parseInt(req.params.id));
  if (Jugadores.length === JugadoresFiltrados.length) {
    return res.status(404).send('Jugador no encontrado');
  }
  guardarJugadores(JugadoresFiltrados);
  res.send('Jugador eliminado');
});

// Servidor escuchando
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
