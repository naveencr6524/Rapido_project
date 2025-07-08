require('./db.js')
const express =  require('express');
const app = express();
const router = require('./module/user/userRoutes.js');
const driverRouter=require('./module/user/driverRoutes.js')
app.use(express.json());

app.use('/',router);
app.use('/api/',driverRouter);


app.listen(5000,()=>{
    console.log("listening to the port:5000");
})