require('./db.js')
const express =  require('express');
const app = express();
const router = require('./module/user/userRoutes.js');
app.use(express.json());

app.use('/',router);


app.listen(5000,()=>{
    console.log("listening to the port:5000");
})