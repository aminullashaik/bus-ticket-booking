const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  operatorName: { type: String, required: true },
  type: { type: String, enum: ['AC Seater', 'Non-AC Seater', 'AC Sleeper', 'Non-AC Sleeper'], required: true },
  totalSeats: { type: Number, required: true },
  layout: [String] // e.g. ["1A", "1B", ...]
}, { timestamps: true });

// Pre-fill layout if not provided (simple logic)
busSchema.pre('save', function(next) {
  if (!this.layout || this.layout.length === 0) {
    this.layout = Array.from({ length: this.totalSeats }, (_, i) => {
        const row = Math.floor(i / 4) + 1;
        const col = ['A', 'B', 'C', 'D'][i % 4];
        return `${row}${col}`;
    });
  }
  next();
});

module.exports = mongoose.model('Bus', busSchema);
