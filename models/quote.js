var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var QuoteSchema = new Schema({
  author: String,
  quote: String,
  likes: {type: Number, default:0},
  creationDate : {type:Date, default: Date.now()}
});
QuoteSchema.index({quote:'text'});

module.exports = mongoose.model("Quote", QuoteSchema);
