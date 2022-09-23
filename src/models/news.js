const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publishedAt: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
newSchema.statics.displayTime = function(){
  var str = "";

  var currentTime = new Date()
  var month = currentTime.getMonth()+1;
  var date = currentTime.getDate()
  var year = currentTime.getFullYear() 
  var hours = currentTime.getHours()
  var minutes = currentTime.getMinutes()
  var seconds = currentTime.getSeconds()

  if (minutes < 10) {
      minutes = "0" + minutes
  }
  if (seconds < 10) {
      seconds = "0" + seconds
  }
  console.log(str);
  str =`${date}/${month}/${year}-${hours%12}:${minutes}:${seconds}-`;
  if(hours > 11){
      str += "PM"
  } else {
      str += "AM"
  }
  return str;
}

const News = mongoose.model("News", newSchema);
module.exports = News;
