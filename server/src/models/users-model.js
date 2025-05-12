import mongoose,{Schema} from "mongoose"
import bcrypt from "bcryptjs";
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
            minLength:10,
            unique:true  
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
        refreshToken:{
            type:String
        }

    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
    next();
})


userSchema.methods.generateAcessToken = async function(){
    return await jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullname:this.fullname 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

userSchema.methods.genrateRefreshToken = async function (){
    return await jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}

userSchema.methods.MatchPassword = async function (password){
    return await bcrypt.compare(password,this.password);
}


const user = mongoose.model("user",userSchema);
export default user;