import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
dotenv.config();
// Database connection
const mongoURL = process.env.MONGO_URL || "";
mongoose.connect(mongoURL).then(() => {
    console.log("db connect");
}).catch((err) => {
    console.error(err);
});
const port = 8000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static("dist/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', __dirname + "/views");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("index");
});
const messageSchema = new mongoose.Schema({ fullname: String, email: String, message: String });
const Message = mongoose.model("message", messageSchema);
app.post("/submit-message", async (req, res) => {
    try {
        const { fullname, email, message } = req.body;
        if (!fullname || !email || !message) {
            return res.status(400).json({ message: "Invalid Input" });
        }
        await Message.create({ fullname, email, message });
        return res.status(201).redirect("/");
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something is wrong, Hold On! We Are Working On It." });
    }
});
const emailSchema = new mongoose.Schema({ email: String });
const NewsletterEmails = mongoose.model("newsletter-emails", emailSchema);
app.post("/newsletter-subscribe", async (req, res) => {
    const email = req.body.email;
    try {
        const existingEmail = await NewsletterEmails.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: "Email Already Exist" });
        }
        await NewsletterEmails.create({ email });
        return res.status(201).json({ message: "Successfully Added Email" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something is wrong, Hold On! We Are Working On It." });
    }
});
app.listen(port, () => {
    console.log("server started");
});
//# sourceMappingURL=app.js.map