const URL = require("../models/Url");
const Click = require("../models/Click");

const getAnalytics = async(req,res)=>{
    try{
        const {id} = req.params;
        const url = await URL.findById(id);
        if(!url){
            return res.status(404).json({error:"URL not found"});
        }
        
        const clicks = await Click.find({url:id});
        res.json({
            totalClicks: url.clicks,
            analytics: clicks
        });
    }
    catch(err){
        res.status(500).json({error:"Server Error"});
    }
};

module.exports = {getAnalytics};