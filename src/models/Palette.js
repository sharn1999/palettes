import mongoose from 'mongoose';

const paletteSchema = new mongoose.Schema({
  name: String,
  createdAt: Number,
  colors: [String],
});

const Palette = mongoose.model('Palette', paletteSchema);

export default Palette;