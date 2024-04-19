import mongoose from "mongoose";


const connectionString = 'mongodb+srv://viniot1027:Xyzzyspoon1@nodeexpressprojects.ky6d2w8.mongodb.net/EcomProject?retryWrites=true&w=majority';


mongoose.connect(connectionString).then(()=> {
    console.log(`CONNECTED TO DATABASE`);
}).catch((err)=> {
    console.log(err);
})