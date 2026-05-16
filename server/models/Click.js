const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
    {
        url: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "URL",
        },
        ipaddress:{
            type:String,
        },
        browser:{
            type:String,
        },
        os:{
            type:String,
        },
        device:{
            type:String,
        },
        referrer:{
            type:String,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Click",clickSchema);