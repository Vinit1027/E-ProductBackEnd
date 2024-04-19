import jwt from 'jsonwebtoken';


const auth = (req,res,next)=> {
    try {
        if(req.headers.authorization){
            const token = req.headers.authorization;

            let decodeToken = jwt.verify(token,process.env.TOKEN_SECRET_KEY ) || jwt.verify(token,process.env.TOKEN_USER_SECRET_KEY );

            if(decodeToken){
                next();
            }
            else{
                return res.status(401).json({
                    message: "Invalid Token"
                })
            }
        }
        else{
            return res.status(401).json({
                message:'Authorization token is not there or something is wrong'
            })
        }
    } catch (error) {
        return res.status(401).json({
            message:error.message
        })
    }
}


export default auth;