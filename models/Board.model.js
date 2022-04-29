const { Schema, model } = require("mongoose");

const boardSchema = new Schema(
    {
      name: { type: String, trim: true},
      author: { type: String, trim: true},      
      tag: { type: Schema.Types.ObjectId, ref: "Tag"},
      altTag: [String],
      topSVG: { type: String, trim: true},
      bottomSVG: { type: String, trim: true},
      postedBy: { type: Schema.Types.ObjectId, ref: "User"},
      description: { type: String, trim: true},
      url: { type: String, trim: true},
      features: {
          type: [String],
          enum: ['Gerbers','Guide'],
      },
    },
    {
      timestamps: true
    }
  );
  
const Board = model("Board", boardSchema);

module.exports = Board;
