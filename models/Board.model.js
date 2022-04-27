const { Schema, model } = require("mongoose");

const boardSchema = new Schema(
    {
      name: String,  
      typeTag: [ { type: Schema.Types.ObjectId, ref: "Tag"} ],
      altTag: [String],
      topSVG: String,
      bottomSVG: String,
      postedBy: { type: Schema.Types.ObjectId, ref: "User"},
      description: String,
      url: String,
      pcb: Boolean,
      
    },
    {
      timestamps: true
    }
  );
  
const Board = model("Board", boardSchema);

module.exports = Board;
