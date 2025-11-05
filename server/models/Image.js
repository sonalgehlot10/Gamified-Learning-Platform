const imageSchema = new mongoose.Schema({
    label: String,
    imageUrl: String,
  });

const Image = mongoose.model('Image', imageSchema);