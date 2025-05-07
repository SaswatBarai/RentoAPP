import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullname:{
            type:String,
            required:true,
            trim:true,
            minLength:3,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minLength:6
        },
        phone:{
            type:Number,
            trim:true,
            required:true,
            minLength:10    
        },
        address:{
            street:String,
            city:String,
            state:String,
            zipCode:String,
            country:String
        },
        drivingLicense:{
            number:String,
            expiry:Date,
        },  
        bookings:[
            {
                type:Schema.Types.ObjectId,
                ref:"booking"
            }
        ],
        role:{
            type:String,
            enum:["admin","user"],
            default:"user"
        },

    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function (password){
    if(!this.isModified(password)){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
    next();
})


userSchema.method.generateAcessToken = async function(){
    return await jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRE
        }
    )
}

userSchema.method.genrateRefreshToken = async function (){
    return await jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRE
        }
    )
}

userSchema.method.MatchPassword = async function (password){
    return await bcrypt.compare(password,this.password);
}


const user = mongoose.model("user",userSchema);
export default user;