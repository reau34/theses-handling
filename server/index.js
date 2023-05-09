const express=require("express")
const mysql=require("mysql")
const cors =require("cors")
const bodyParser=require("body-parser")
const cookieParser=require("cookie-parser")
const session=require("express-session")
const jwt=require("jsonwebtoken")
const multer = require("multer")
const nodemailer=require("nodemailer")
const bcrypt=require("bcrypt")
require("dotenv").config()

const app=express()

app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET","POST","DELETE","PUT"],
    credentials: true,  
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    key:"userCookie",
    secret:"njeMLEXGpe^y6MU#",
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:60*60*24,
    }
}))

const db=mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"root12345",
    database:"system"
})
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"files");
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    }
});

const upload=multer({storage:storage})

app.post("/download",(req,res)=>{
    const path=req.body.path;
    res.download(path);
});

app.post("/upload_file",upload.single("file"),(req,res)=>{
    res.json({message:"Dodanie pliku powiodło się"});
});


function auth(req,res,next){
    const authHeader=req.headers["authorization"]
    console.log(authHeader)
    const token=authHeader&& authHeader.split(" ")[1]
    if(token==null){
        return res.sendStatus(401)
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,data)=>{
        if(error){
            return res.sendStatus(403)
        }else{
            req.user=data
            next()
        }
    })
}
// app.post("/token",(req,res)=>{
//     const refreshToken=req.body.token
//     if(refreshToken==null){
//         return res.sendStatus(401)
//     }

//     jwt.verify(refreshToken,process.env.REFRESH_TOKEN_ACCESS,(error,email)=>{
//         if(error){
//             return res.sendStatus(403)
//         }else{
//             //const accessToken=jwt.ge
//         }
//     })
// })


app.post("/login",(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    //const refreshToken=jwt.sign(email,process.env.REFRESH_TOKEN_ACCESS)
    db.query("SELECT * FROM user WHERE email=?",[email],(error,result)=>{
        if(result.length>0){
            bcrypt.compare(password,result[0].password).then((rst)=>{
                if(rst){
                    //res.json({accessToken:accessToken})-cos z tym zrobic musze
                    req.session.user=result
                    //const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
                    res.json({auth:true,result:result})
                    //res.send(result)
                }else{
                    res.json({auth:false,msg:"Błędne hasło"})
                }
            })

        }else{
            res.json({auth:false,msg:"Brak użytkownika"})
        }
    })
})

app.get("/students",(req,res)=>{
    db.query("SELECT * FROM user WHERE user.role='student' AND user.iduser NOT IN (SELECT idstudent FROM studentthesis)",(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
})

app.post("/promoter_theses",(req,res)=>{
    const addedby=req.body.addedby;
    db.query("SELECT * FROM theses WHERE addedby=?",[addedby],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
})



app.post("/create_topic",(req,res)=>{
    const topic=req.body.topic
    const promoter=req.body.promoter
    const degree=req.body.degree
    const faculty=req.body.faculty
    const fieldOfStudy=req.body.fieldOfStudy
    const type=req.body.type
    const status=req.body.status
    const addedby=req.body.addedby
    db.query("INSERT INTO theses(topic, promoter, degree, faculty, fieldofstudy, type, status, addedby) VALUES (?,?,?,?,?,?,?,?)",
    [topic,promoter,degree,faculty,fieldOfStudy,type,status,addedby],
    (error,result)=>{
        if(error)
        {
            console.log(error)
        }
        else
        {
            res.sendStatus(200)
        }
    })
})

app.get("/get_theses",(req,res)=>{
    db.query("SELECT * FROM theses",(error,result)=>{
        if(error){
            console.log(error)
        }else{
            res.send(result)
        }
    })
})

app.post("/get_thesis",(req,res)=>{
    const thesisId=req.body.id
    console.log(thesisId)
    db.query("SELECT grades.promotergrade, grades.reviewergrade, reviewers.fullname, grades.review, files.path  FROM studentthesis LEFT JOIN files ON studentthesis.idthesis=files.idthesis LEFT JOIN grades ON studentthesis.idthesis=grades.idthesis LEFT JOIN reviewers ON studentthesis.idthesis=reviewers.idthesis WHERE studentthesis.idthesis=?",[thesisId],(error,result)=>{
        if(error){
            console.log(error)
        }else{
            console.log(result)
            res.send(result)
        }
    })
})

app.post("/student_thesis",(req,res)=>{
    const userId=req.body.userId
    db.query("SELECT * FROM studentthesis INNER JOIN theses ON studentthesis.idthesis=theses.idtheses LEFT JOIN grades ON theses.idtheses=grades.idthesis LEFT JOIN reviewers ON theses.idtheses=reviewers.idthesis LEFT JOIN files ON theses.idtheses=files.idthesis WHERE studentthesis.idstudent=?",[userId],(error,result)=>{
        if(error){
            console.log(error)
        }else{
            console.log(result)
            res.send(result)
        }
    })
})

app.post("/reviewer_theses",(req,res)=>{
    const reviewerId=req.body.userId
    db.query("SELECT * FROM reviewers INNER JOIN theses ON reviewers.idthesis=theses.idtheses LEFT JOIN files ON theses.idtheses=files.idthesis LEFT JOIN grades ON grades.idthesis=theses.idtheses LEFT JOIN studentthesis ON studentthesis.idthesis=theses.idtheses WHERE reviewers.idreviewer=?",[reviewerId],(error,result)=>{
        if(error){
            console.log(error)
        }else{
            res.send(result)
        }
    })
})

app.put("/setpromotergrade",(req,res)=>{
    const id=req.body.id;
    const promotergrade=req.body.promotergrade;
    db.query("UPDATE grades SET promotergrade=? WHERE idthesis=?",[promotergrade,id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
})

app.put("/setreviewergrade",(req,res)=>{
    const id=req.body.id;
    const reviewergrade=req.body.reviewergrade;
    db.query("UPDATE grades SET reviewergrade=? WHERE idthesis=?",[reviewergrade,id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
})

app.put("/setreview",(req,res)=>{
    const id=req.body.id;
    const review=req.body.review;
    db.query("UPDATE grades SET review=? WHERE idthesis=?",[review,id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
})

app.post("/set_path",(req,res)=>{
    const id=req.body.id;
    const path=req.body.path;
    db.query("INSERT INTO files(idthesis, path) VALUES (?,?)",[id,path],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.sendStatus(200)
        }
    })
})

app.put("/update",(req,res)=>{
    const reservedby=req.body.reservedby;
    const id=req.body.id;
    const userId=req.body.userId;
    const status=req.body.status;
    db.query("INSERT INTO studentthesis(idstudent, fullname, idthesis) VALUES (?,?,?)",[userId,reservedby,id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
    db.query("UPDATE theses SET status=? WHERE idtheses=?",[status,id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
           // res.send(result);
        }
    })
})

app.post("/create",(req,res)=>{
    const topic=req.body.topic;
    const promoter=req.body.promoter;
    const degree=req.body.degree;
    const faculty=req.body.faculty;
    const fieldOfStudy=req.body.fieldOfStudy;
    const type=req.body.type;
    const status=req.body.status;
    const addedby=req.body.addedby;
    db.query("INSERT INTO theses(topic, promoter, degree, faculty, fieldofstudy, type, status, addedby) VALUES (?,?,?,?,?,?,?,?)",
    [topic,promoter,degree,faculty,fieldOfStudy,type,status,addedby],
    (error,result)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            res.send(result);
        }
    });
})

app.delete('/delete/:thesisid',(req,res)=>{
    const thesisId=req.params.thesisid;
    db.query(`DELETE FROM theses WHERE idtheses=${thesisId}`,(error,result)=>{
        if(error){
            console.log(error);
        }
    })
})

app.post("/getemail",(req,res)=>{
    const id=req.body.id;
    db.query("SELECT email from user WHERE iduser=?",[id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
})

app.post("/setreviewer",(req,res)=>{
    const id=req.body.id;
    const reviewer=req.body.reviewer;
    const reviewerId=req.body.reviewerId;
    db.query("INSERT INTO reviewers(idthesis, idreviewer, fullname) VALUES (?,?,?)",[id,reviewerId,reviewer],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
})

app.post("/creategrades",(req,res)=>{
    const id=req.body.id;
    db.query("INSERT INTO grades SET idthesis=?",[id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
})

app.post("/send",(req,res)=>{
    const to=req.body.to;
    const subject=req.body.subject;
    const text=req.body.text;
    const transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"example",
            pass:"example"
        }
    });
    const mailConfig={
        from:"example",
        to:to,
        subject:subject,
        text:text
    };
    transport.sendMail(mailConfig);
})

app.post("/havethesis",(req,res)=>{
    const id =req.body.id;
    db.query("SELECT * from studentthesis WHERE idstudent=?",[id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            //console.log(result)
            res.send(result);
        }
    })
})

app.post("/get_promoters",(req,res)=>{
    const id=req.body.id;
    db.query("SELECT name, surname, iduser FROM user WHERE role='lecturer' AND iduser!=?",[id],(error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.send(result);
        }
    })
})

app.post("/logout",(req,res)=>{
    req.session.destroy();
})

app.listen(3001,()=>{
    console.log("Servers listening")
})