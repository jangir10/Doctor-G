import jwt from 'jsonwebtoken'

// User authentication middleware

const authUser = async (req,res,next)=>{
    try{
        const {token} = req.headers
        if(!token){
            return res.json({success:false,message:"Access Denied"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();

    }catch(error){
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

export default authUser