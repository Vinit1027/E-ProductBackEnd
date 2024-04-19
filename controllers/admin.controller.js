import adminModel from "../models/admin.model";
import multer from "multer";

import bcrypt from 'bcrypt';
import Cookies from "cookies";
import jwt from 'jsonwebtoken'


const upload = multer();


export const getAdmin = async (req,res)=> {
    try {
         const allAdmin = await adminModel.find();

         res.status(200).json({
            data:allAdmin,
            message: 'Successful'
         })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}



export const signupAdmin = (req,res)=> {

    try {
        const uploadData = upload.none();

        uploadData(req,res, async function(er){
            if(er){
                return res.status(500).json({
                    message: er.message
                })
            }
            const { name, email, password } = req.body;

            const existAdminAcc = await adminModel.findOne({ email:email });

            if(existAdminAcc){
                return res.status(200).json({
                    message: "Already Admin User Exists!"
                })
            }

            const newPassword = await bcrypt.hash(password, 10);

            console.log(newPassword);


            const AdminData = new adminModel({
                name: name,
                email: email,
                password: newPassword
            });
        
            AdminData.save();

            if(AdminData){
                return res.status(201).json({
                    data:AdminData,
                    message: 'sucessfully created'
                })
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}




export const loginAdmin = (req,res)=> {

    
    try {
        
        const uploadData = upload.none();
        
        uploadData(req,res, async function (){
            
            const {email, password} = req.body;

            console.log(req.body)

            const existAdmin = await adminModel.findOne({email:email});

            if(!existAdmin){
                return res.status(200).json({
                    message: 'Admin account doesnt exists'
                })
            }

            const isPasswordCorrect = await bcrypt.compare(password, existAdmin.password);

            if(!isPasswordCorrect){
                return res.status().json({
                    message:'Password is incorrect'
                })
            }


            // set Cookies

            const cookie = new Cookies(req,res);

            // cookie.set('admin',JSON.stringify(existAdmin), {
            //     httpOnly : false,
            //     sameSite: 'lax',
            //     secure: false,
            //     maxAge : 1000 * 60 * 60
            // });


            const token = jwt.sign({_id: existAdmin.id, email: existAdmin.email}, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });

            cookie.set('admin',JSON.stringify(token), {
                httpOnly : false,
                sameSite: 'lax',
                secure: false,
                maxAge : 1000 * 60 * 60
            });


            return res.status(200).json({
                data: existAdmin,
                token: token,
                message: 'Successfully login'
            })
            
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}