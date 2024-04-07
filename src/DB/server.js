import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/palettes';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

import Palette from '../models/Palette.js'

app.get('/palettes', async (req, res) => {
  try {
    const palettes = await Palette.find();
    res.json(palettes);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/palettes', async (req, res) => {
  try {
    const { name, createdAt, colors } = req.body;
    const newPalette = new Palette({ name, createdAt, colors });
    await newPalette.save();
    res.status(201).send(newPalette);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/palettes/removeColor', async (req, res) => {
  const { paletteName, colorIndex } = req.body;

  try {
    const palette = await Palette.findOne({ name: paletteName });
    if (!palette) {
      return res.status(404).send({ message: 'Палитра не найдена' });
    }
    palette.colors.splice(colorIndex, 1);

    await palette.save();

    res.send(palette);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при удалении цвета', error: error.message });
  }
});

app.post('/palettes/clearColors', async (req, res) => {
  const { paletteName } = req.body;

  try {
    const updatedPalette = await Palette.findOneAndUpdate(
      { name: paletteName },
      { $set: { colors: [] } },
      { new: true }
    );

    if (!updatedPalette) {
      return res.status(404).send({ message: 'Палитра не найдена.' });
    }

    res.send(updatedPalette);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при обновлении палитры', error: error.message });
  }
});


app.post('/palettes/addColor', async (req, res) => {
  const { paletteName, colors } = req.body;

  try {
    let palette = await Palette.findOne({ name: paletteName });

    if (palette) {
      palette.colors.push(...colors);
      await palette.save();
      res.status(200).json(palette);
    } else {
      res.status(404).json({ message: "Палитра не найдена" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

app.delete('/palettes/:paletteName', async (req, res) => {
  const { paletteName } = req.params;

  try {
    const result = await Palette.findOneAndDelete({ name: paletteName });
    if (result) {
      res.status(200).json({ message: "Палитра успешно удалена" });
    } else {
      res.status(404).json({ message: "Палитра не найдена" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении палитры", error: error.message });
  }
});