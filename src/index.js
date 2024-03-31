import connectDB from "./db/index.js";
import { app } from "./app.js"

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({
    path:".env"
});

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`sever runing at port number ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("MONGO DB CONNECTION FAILED !!!", err);
})

