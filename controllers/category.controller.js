import multer from "multer";
import { AsyncResource } from "node:async_hooks";
import fs from 'node:fs';
import path from 'node:path';
import categoryModel from '../models/category.model';



const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    // const dest= path.join(path.dirname(__dirname), 'uploads');

    // console.log(dest)

    if(fs.existsSync('./uploads/category')){

      cb(null, './uploads/category')
    }
    else{
      fs.mkdirSync('./uploads/category')
      cb(null, './uploads/category')
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






export const getCategory= async (req,res)=> {
    try {
      
      const allData = await categoryModel.find();

      if(!allData){
        return res.status(500).json({
          message: "Categories Doesnt exists!!"
        })
      }

      return res.status(200).json({
        data:allData,
        message: "Successful"
      })
    } catch (error) {
      return res.status(500).json({
        message: error.message
      })
    }
}

export const addCategory= (req,res)=> {
    try {
        
        const uploadData = upload.single('file');

        uploadData(req,res, function (er){
          if(er){
            return res.status(500).json({
              message: er.message
            })
          }

          const { name , description } = req.body;

          console.log(req.file)

          console.log(req.body)

          let imageName = ''
          if(req.file != undefined){
            // const splitDirname = __dirname.slice(0,-11);
            // imageName = splitDirname + req.file.path
            imageName = req.file.path
          }


          const addCategoryData = new categoryModel({
            name: name,
            description: description,
            image: imageName
          })

          addCategoryData.save()

          if(addCategoryData){
            return res.status(200).json({
              data: addCategoryData,
              message: "Successfully Created"
            })
          }
        })
    } catch (error) {
        return res.status(200).json({
          message: error.message
        })
    }
}



export const updateCategory= (req,res)=> {
    try {
      const uploadData = upload.single('file');

      uploadData(req, res, async function(er){
        if(er){
          return res.status(500).json({
            message:er.message
          })
        }

        const { name, description } = req.body;

        console.log(req.body)

        const id = req.params.id;

        console.log(id)

        const catRepData = await categoryModel.findOne({_id:id});

        let imageName = '';
        if(req.file == undefined){
          imageName = catRepData.image;
        }
        else{
          imageName = req.file.path;
          if(fs.existsSync(catRepData.image)){
            fs.unlinkSync(catRepData.image)
          }
        }

        const updateCategoryData = await categoryModel.findByIdAndUpdate(
          {
            _id: id
          }, {
            $set:{
              name:name,
              description: description,
              image: imageName
            }
          })

          const allCatData = await categoryModel.find({name:name})


          if(updateCategoryData){
            return res.status(200).json({
              data: allCatData,
              message: "Updated Category Data"
            })
          }

      } )


    } catch (error) {
        return res.status(200).json({
          message: error.message
        })
    }
}



export const deleteCategory= async (req,res)=> {
    try {
      const id = req.params.id;

      console.log(id)

      const allCatData = await categoryModel.findOne({_id : id})
      const deleteCategoryData = await categoryModel.deleteOne({_id : id});

      if (deleteCategoryData.acknowledged) {
            if (fs.existsSync(allCatData.image)) {
                fs.unlinkSync(allCatData.image)
            }
          
          }

        return res.status(200).json({
          data: deleteCategoryData,
          message: "Successful"
        })
    } catch (error) {
        return res.status(200).json({
          message: error.message
        })
    }
}