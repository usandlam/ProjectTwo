const { Schema, model } = require("mongoose");

const tagSchema = new Schema(
    {
      label: String,
    },
    {
      timestamps: true
    }
  );
  
const Tag = model("Tag", tagSchema);

module.exports = Tag;
