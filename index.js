const express = require("express");
const app = express();
const fsPromises = require("fs/promises");
const cors = require("cors");
app.listen(3000, console.log('Servidor iniciado'));

app.use(cors());

app.use(express.json());

// Leer o mostrar canciones
app.get("/canciones", async (req, res) => {
  const loadSongs = JSON.parse(
    await fsPromises.readFile("repertorio.json", "utf-8")
  );
  res.json(loadSongs);
});

// Crear una canción
app.post("/canciones", async (req, res) => {
  try {
    const song = req.body;
    if (song.titulo === "") {
      return;
    }

    if (song.artista === "") {
      return;
    }

    if (song.tono === "") {
      return;
    }
    const songs = JSON.parse(
      await fsPromises.readFile("repertorio.json", "utf-8")
    );
    songs.push(song);
    await fsPromises.writeFile("repertorio.json", JSON.stringify(songs));
    res.send("Se agregó una nueva canción");
  } catch (error) {
    res.send({ status: "error", data: "Error del servidor" });
  }
});

// Eliminar una canción
app.delete("/canciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const songs = JSON.parse(await fsPromises.readFile("repertorio.json"));
    const index = songs.findIndex((p) => p.id == id);
    songs.splice(index, 1);
    await fsPromises.writeFile("repertorio.json", JSON.stringify(songs));
    return res.send("La canción se ha eliminado");
  } catch (error) {
    res.send({ status: "error", data: "Error del Servidor" });
  }
});

// Actualizar una canción
app.put("/canciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const song = req.body;
    if (song.titulo === "") {
      return;
    }

    if (song.artista === "") {
      return;
    }

    if (song.tono === "") {
      return;
    }
    const songs = JSON.parse(await fsPromises.readFile("repertorio.json"));
    const index = songs.findIndex((p) => p.id == id);
    songs[index] = song;
    await fsPromises.writeFile("repertorio.json", JSON.stringify(songs));
    return res.send("La canción se ha actualizado");
  } catch (error) {
    res.send({ status: "error", data: "Error del servidor" });
  }
});

//  Html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
