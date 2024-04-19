import userModel from "../models/user.model";
import multer from "multer";
import bcrypt from 'bcrypt';
import Cookies from "cookies";
import jwt from 'jsonwebtoken';




const upload = multer();



export const getUsers = async (req,res)=> {
    try {

        const allUsers = await userModel.find();

        if(!allUsers){
            return res.status(200).json({
                message: "User doesnt exist!"
            })
        }

        return res.status(200).json({
            data: allUsers,
            message:"Success"
        })

        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}




export const addUser = (req,res)=> {
    
    try {

        const uploadData = upload.none();

        uploadData(req,res, async function(er){

            if(er){
                return res.status(500).json({
                    message: er.message
                })
            }

            const {name, email, password, contact} = req.body;

            const newPassword = await bcrypt.hash(password, 10);

            const userData = new userModel({
                name:name,
                email:email,
                password: password,
                passwordcrypt : newPassword,
                contact: contact
            })

            userData.save();

            if(userData){
                return res.status(201).json({
                    data: userData,
                    message: 'Data added Sucessfully'
                })
            }

        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}



export const updateUser = (req,res)=> {

    try {
        const updateData = upload.none();

        updateData(req,res, async function(er){
            if(er){
                return res.status(500).json({
                    message: er.message
                })
            }

            const id = req.params.id;

            const {name, email, password, contact} = req.body;

            console.log(req.body);

            if(password){
                
                const newPassword = await bcrypt.hash(password, 10);


                var modifyUser = await userModel.findByIdAndUpdate(
                    { 
                        _id: id
                    },
                    {
                        $set: {
                            name:name,
                            email:email,
                            password : password,
                            passwordcrypt :newPassword,
                            contact: contact

                        }

                });

            }

            else{

                var modifyUser = await userModel.findByIdAndUpdate(
                    { 
                        _id: id
                    },
                    {
                        $set: {
                            name:name,
                            email:email,
                            contact: contact

                        }

                });

            }

            modifyUser.save();


            const updatedData = await userModel.find({email:email});
            
            if(modifyUser){
                return res.status(201).json({
                    data: updatedData,
                    message: 'User Data updated'
                })
            }


        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}




export const deleteUser = (req,res)=> {

    try {

        const updateData = upload.none();

        updateData(req,res, async function(er){
            if(er){
                return res.status(500).json({
                    message: er.message
                })
            }

            const id = req.params.id;

            const deleteUser = await userModel.deleteOne({ _id:id });

            console.log(deleteUser);

            const allUsers = await userModel.find();

            if(deleteUser.acknowledged){
                return res.status(200).json({
                    data: allUsers,
                    message: "User deleted successfully"
                })
            }


        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }


}



export const signUpUsers = (req,res)=> {

    try {

        const uploadData = upload.none();

        uploadData(req,res, async function(er){

            if(er){
                return res.status(500).json({
                    message: er.message
                })
            }

            const {name, email, password, contact} = req.body;

            const existUser = await userModel.findOne({ email: email});

            if(existUser){
                return res.status(200).json({
                    message: "User already exists!!"
                })
            }

            const newPassword = await bcrypt.hash(password, 10);

            const userData = new userModel({
                name:name,
                email:email,
                password: password,
                passwordcrypt : newPassword,
                contact: contact
            })

            userData.save();

            if(userData){
                return res.status(201).json({
                    data: userData,
                    message: 'Data added Sucessfully'
                })
            }

        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}





export const loginUsers = (req,res)=> {
    try {
        const uploadData = upload.none()

        uploadData(req,res, async function(er){
            if(er){
                return res.status(500).json({
                    message: er.message
                })
            }


            const {email, password} = req.body;


            const existUser = await userModel.findOne({email: email});

            if(!existUser){
                return res.status(500).json({
                    message: 'User doesnt Exist!!'
                })
            }

            const isPasswordCorrect = await bcrypt.compare(password, existUser.passwordcrypt);

            if(!isPasswordCorrect){
                return res.status(500).json({
                    message: 'Password is Incorrect'
                })
            }


            const cookies = new Cookies(req,res);

            // cookies.set('User',JSON.stringify(existUser));

            const token = jwt.sign({_id:existUser.id, email: existUser.email}, process.env.TOKEN_USER_SECRET_KEY, {expiresIn: '1h'});

            cookies.set('User',JSON.stringify(token), {
                httpOnly : false,
                sameSite: 'lax',
                secure: false,
                maxAge : 1000 * 60 * 60
            });

            return res.status(200).json({
                data: existUser,
                token: token,
                message: "Login Successfully"
            })
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}



