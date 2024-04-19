import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import Cookies from "cookies";
import productModel from '../models/product.model';
import categoryModel from '../models/category.model';



const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        // const dest= path.join(path.dirname(__dirname), 'uploads');

        // console.log(dest)

        if (fs.existsSync('./uploads/products')) {

            cb(null, './uploads/products')
        }
        else {
            fs.mkdirSync('./uploads/products')
            cb(null, './uploads/products')
        }
    },

    filename: function (req, file, cb) {

        console.log(file)

        const ext = path.extname(file.originalname)
        const fileArr = file.originalname.split('.')
        console.log(fileArr)
        fileArr.pop();

        console.log(fileArr)

        const newfilename = fileArr.join('.') + '-' + Date.now() + ext;
        console.log(newfilename)
        cb(null, newfilename)

    }
});

const upload = multer({ storage: storage });




export const getProducts = async (req, res) => {
    try {

        // var cookies = new Cookies(req, res)

        // console.log(JSON.parse(cookies.get('User')))
        // console.log(JSON.parse(cookies.get('User')));
        // JSON.parse(cookies.get('User'))

        const { q, page, size, min } = req.query;

        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const searchRgx = rgx(q);

        var filterdata = {}
        if (q != undefined || min != undefined) {
            filterdata = {
                $or: [
                    { name: { $regex: searchRgx, $options: "i" } },
                    { description: { $regex: searchRgx, $options: "i" } },
                    { price: { $gt: min } }

                ]
            }
        }
        const pageno = page - 1;
        const skipno = pageno * size;

        const allData = await productModel.find(filterdata).populate('category').limit(size).skip(skipno);

        if (!allData) {
            return res.status(500).json({
                message: "Categories Doesnt exists!!"
            })
        }

        if(allData){
            return res.status(200).json({
                data: allData,
                message: "Successful"
            })
        }


    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


export const getSingleProduct = async (req, res) => {
    try {

        const id = req.params.id;

        const catData = await categoryModel.find()

        const singleData = await productModel.findOne({
                $or: [
                    { _id: id },
                    {category: id }
                ]
         }).populate('category');

        console.log(singleData)

        if (!singleData) {
            return res.status(500).json({
                message: "Categories Doesnt exists!!"
            })
        }

        return res.status(200).json({
            data: singleData,
            message: "Successful"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const addProduct = (req, res) => {
    try {
        const uploadData = upload.array('file',10);
        uploadData(req,res,function(er){
            if(er){
                return res.status(500).json({
                    message:er.message
                })
            }

            const {name, description,category,images, rating, price, stock} = req.body

            // console.log(req.body)

            console.log(req.files)

            const multiImg = req.files;

            const multiImgArr = multiImg.map((element)=> {
                return element.path
            })

            // console.log(multiImgArr)

            const ProData = new productModel({
                name:name,
                description:description,
                category:category,
                images:multiImgArr,
                rating:rating,
                price:price,
                stock:stock
            })

            ProData.save();

            if(ProData){
                return res.status(200).json({
                    data:ProData,
                    message:"Successful"
                })
            }

        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


export const updateProduct = (req, res) => {
    try {
        const uploadData = upload.array('file',10);

        uploadData(req,res, async function(er) {
            if(er){
                return res.status(501).json({
                    message:er.message
                })
            }

            const id = req.params.id;

            console.log(id)

            console.log(req.body)

            const { name, description,category,images, rating, price, stock } = req.body;


            const multiImg = req.files;

            if(multiImg === []){

                return undefined

            }

            const multiImgArr = multiImg.map((element)=> {
                    return element.path
                });

            console.log(multiImgArr)

            console.log(description)

            

            const UpdateData = await productModel.findOneAndUpdate({
                $or: [
                        { _id: id },
                        {category: id }
                ],
                $set: {
                    name: name,
                    description: description,
                    category: category,
                    rating: rating,
                    price: price,
                    stock: stock
                },
                $addToSet:{
                    images:{
                        $each: multiImgArr
                    }
                }
            })

            const theData = await productModel.findOne({
                    $or: [
                        { _id: id },
                        {category: id }
                    ]
            })

            if(UpdateData){
                return res.status(200).json({
                    data: theData,
                    message:"Successful"
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}




export const deleteProduct = async(req, res) => {
    try {
        const id = req.params.id;

        const allData = await productModel.findOne({
            $or: [
                { _id: id },
                {category: id }
            ]
        })

        const deleteProd = await productModel.findOneAndDelete({
            $or: [
                { _id: id },
                {category: id }
            ]
        })

        let imgArr = allData.images


        if(deleteProd.acknowledged){
            imgArr.forEach((element)=> {
                if(fs.existsSync(element)){
                    fs.unlinkSync(element)
                }
            })
        }

        return res.status(200).json({
            data:deleteProd,
            message: "Yeeted"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}