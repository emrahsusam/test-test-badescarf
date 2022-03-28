const mongoose=require("mongoose")
const Reviews=require("./reviews")
const productSchema=new mongoose.Schema({
    model:{
        type:String
    },
    image:{
        data :Buffer,
        contentType:String
    },
    img:{
        type:String
    },

    price:{
        type:Number,
        min:0,
        required:true
    },
    name:{
        type:String
    },

    desc:{
        type:String
    },

    reviews:[
        {
            type:mongoose.ObjectId,
            ref:"reviews"
        },
    ]



})
const Product=new mongoose.model("products",productSchema)
module.exports=Product;