const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const db=require('./config/db');
const multer=require('multer');
const path=require('path');
const fs=require('fs');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{res.send('Hello World')});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));
app.post('/login',(req,res)=>{
    const {username,password,role}=req.body;
    const query= 'SELECT* FROM users WHERE username=? AND password=? AND role=?';
    db.query(query,[username,password,role],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            userid=result[0].id;
    const studentquery='SELECT name,marks,attendance,department FROM students where user_id=?';
    db.query(studentquery,[userid],(err,sresult)=>{
        if(err){console.log('error');throw err;};
        res.send({ user: result, students: sresult });
        console.log(sresult);
    });
            console.log(result);
        }
        else{res.status(401).send('Login Failed');
        }
    });
});

app.post('/register', (req, res) => {
    const { regUsername, regPassword, regRole, name,department ,course} = req.body;
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserQuery, [regUsername], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.status(409).send('Username already exists');
        } else {
            const insertUserQuery = 'INSERT INTO users(username, password, role) VALUES(?, ?, ?)';
            db.query(insertUserQuery, [regUsername, regPassword, regRole], (err, result) => {
                if (err) throw err;
                let settable = '';
        if (regRole === 'student') {
                    settable = 'students';
        } else if (regRole === 'teacher') {
                    settable = 'teachers';
                }    if(settable==='teachers'){
  const insertRoleQuery = 'INSERT INTO ' + settable + '(name, user_id,department,course_id) VALUES(?,(SELECT id FROM users WHERE username = ?),?,?)';
                db.query(insertRoleQuery, [name, regUsername,department,course], (err, result) => {
              if (err) throw err;
      res.send('Registration and role assignment successful');
           console.log(result);
                }); }
                else{
                    const insertRoleQuery = 'INSERT INTO ' + settable + '(name, user_id,department) VALUES(?,(SELECT id FROM users WHERE username = ?),?)';
          db.query(insertRoleQuery, [name, regUsername,department], (err, result) => {
          if (err) throw err;
       res.send('Registration and role assignment successful');
          console.log(result);
                    });
                }  }); } });
});

app.post('/getstudent',(req,res)=>{
    const {id}=req.body;
    const query= `SELECT s.name, s.attendance, sc.course_id, sc.mark, c.name AS course_name
    FROM students s
    JOIN student_courses sc ON s.user_id = sc.student_id
    JOIN courses c ON sc.course_id = c.id
    WHERE s.user_id = ?`;
    db.query(query,[id],(err,result)=>{
        if(err) throw err;
        res.send(result);
        console.log(result);
    });
});
app.get('/showstudentuser',(req,res)=>{
    const query='select * from students';
    db.query(query,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});
app.get('/showteacheruser',(req,res)=>{
    const query='select * from teachers';
    db.query(query,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);});
});
app.post('/deleteuser',(req,res)=>{
    const {id}=req.body;
    const query='delete from users where id=?';
    db.query(query,[id],(err,result)=>{
        if(err) throw err;
        res.send('User deleted');
    });
})

app.post('/sendfeedback',(req,res)=>{
    const {feedback,name,department}=req.body;
    const query='insert into feedbacks (feedback,fromwho,depar) values(?,?,?)';
    db.query(query,[feedback,name,department],(err,result)=>{
        if(err) throw err;
        res.send('Feedback sent successfully');
    })
});

app.post('/showfeedback',(req,res)=>{
    const {department}=req.body;
    console.log({department});
const query='select * from feedbacks where depar=?';
db.query(query,[department],(err,result)=>{
    if(err) throw err;
    res.send(result);
    console.log(result);
});
});


 app.post('/fetchstudents',(req,res)=>{
    const {department,courseid}=req.body;
    console.log(department + courseid);
    const query= `SELECT s.user_id,s.name, s.attendance, sc.mark AS course_mark
        FROM students s
        JOIN student_courses sc ON s.user_id = sc.student_id
        JOIN courses c ON sc.course_id = c.id
        WHERE s.department = ? AND sc.course_id =? `;
    db.query(query,[department,courseid],(err,result)=>{
        if(err) throw err;
        res.send(result);
        console.log('students data');
        console.log(result);
    });
 });

 app.post('/teacherdep',(req,res)=>{    
    const {id}=req.body;
    const query=  `SELECT t.department, t.course_id, c.name AS course_name  FROM teachers t
    LEFT JOIN courses c ON t.course_id = c.id
    WHERE t.user_id = ?`;
    db.query(query,[id],(err,result)=>{
        if(err) throw err;
        res.send(result);
        console.log(result);}
)});
app.post('/update', (req, res) => {
    console.log('update');
    const { userid, marks, attendance, courseid } = req.body;
    console.log(marks);
    console.log(userid);
    console.log(attendance);

    let updateCount = 0;
    const totalUpdates = (attendance !== '' ? 1 : 0) + (marks !== '' ? 1 : 0);

    if (attendance !== '') {
        const query = 'UPDATE students SET attendance = ? WHERE user_id = ?';
        db.query(query, [attendance, userid], (err, result) => {
            if (err) throw err;
            updateCount++;
            if (updateCount === totalUpdates) {
                res.send('Student updated successfully');
            }
        });
    }
    if (marks !== '') {
        const query1 = 'UPDATE student_courses SET mark = ? WHERE student_id = ? AND course_id = ?';
        db.query(query1, [marks, userid, courseid], (err, result) => {
            if (err) throw err;
            updateCount++;
            if (updateCount === totalUpdates) {
                res.send('Student updated successfully');
            }
        });
    }
    if (totalUpdates === 0) {
        res.send('No updates to perform');
    }
});

 app.post('/delete',(req,res)=>{
    const {userid,courseid}=req.body;
    const query= 'delete from student_courses where student_id=? && course_id=?';
    db.query(query,[userid,courseid],(err,result)=>{
        if(err) throw err;
        res.send('Student deleted successfully');
    }); 
 });

app.post('/addstudent',(req,res)=>{
    const {userid,courseid,department}=req.body;
    const query1= 'select department from students where user_id=?';
    db.query(query1,[userid],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            if(result[0].department!==department){
                res.status(401).send('Student department does not match');
        }
    else{
        const query='insert into student_courses (student_id,course_id) values(?,?)';
        db.query(query,[userid,courseid],(err,result)=>{
            if(err) throw err;
            res.send('Student added successfully');
        });
    }}
    });});

    app.get('/showcourse',(req,res)=>{
         const query= 'select * from courses';
            db.query(query,(err,result)=>{
                if(err) throw err; 
                res.send(result);
                console.log(result);
            });});

    app.post('/deletecourse',(req,res)=>{
        const {id}=req.body;
        const query='delete from courses where id=?';
        db.query(query,[id],(err,result)=>{
            if(err) throw err;
            res.send('Course deleted');
        });
    });
    app.post('/addcourse',(req,res)=>{
        const {addcours}=req.body;
        const query='insert into courses (name) values(?)';
        db.query(query,[addcours],(err,result)=>{
            if(err) throw err;
            res.send('Course added successfully');
        });
    });


app.post('/setnotices',(req,res)=>{
    const {title,content,forwho}=req.body;
   const query='insert into notices (title,content,forwho) values(?,?,?)';
   db.query(query,[title,content,forwho],(err,result)=>{
    if(err) throw err;
    res.send('Notice added successfully');
    console.log('Notice added');
    
   });
});

app.get('/shownotices',(req,res)=>{
    const query='select * from notices';
    db.query(query,(err,result)=>{
        if(err) throw err;
        res.send(result);
        console.log(result); })
    });
    app.get('/showteachernotice',(req,res)=>{
        const query='select * from notices where forwho="teacher" OR forwho="all"';
        db.query(query,(err,result)=>{
            if(err)throw err;
            res.send(result);
        });
    });
    app.get('/showstudentnotice',(req,res)=>{
        const query='select * from notices where forwho="student" or forwho="all"';
        db.query(query,(err,result)=>{
            if(err)throw err;
            res.send(result);
        });
    });
app.post('/deletenotice',(req,res)=>{
    const {id}=req.body;
    const query= 'delete from notices where id=?';
    db.query(query,[id],(err,result)=>{
        if(err)throw err;
        res.send('notice deleted');
        console.log('notice deleted');
    });
});
app.post('/setnews',(req,res)=>{
    const {title,content}=req.body;
   const query='insert into news (title,content) values(?,?)';
   db.query(query,[title,content],(err,result)=>{
    if(err) throw err;
    res.send('News added successfully');
    console.log('News added');
   });
});
app.get('/shownews',(req,res)=>{
    const query='select * from news';
    db.query(query,(err,result)=>{
        if(err) throw err;
        res.send(result);
        console.log(result);
    }
    )
    });
    app.post('/deletenews',(req,res)=>{
        const {id}=req.body;
        const query= 'delete from news where id=?';
        db.query(query,[id],(err,result)=>{
            if(err)throw err;
            res.send('news deleted');
            console.log('news deleted');
        });
    });

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        }
      });
        const upload = multer({ storage });

        app.post('/upload-image', upload.single('image'), (req, res) => {
            const { title } = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
          
            if (!imageUrl) {
              return res.status(400).send('Image upload failed');
            }
            const query = 'INSERT INTO image_gallery (title, imageUrl) VALUES (?, ?)';
            db.query(query, [title, imageUrl], (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Error saving image to database');
              }
              res.send('Image uploaded and saved to database successfully');
            });
          });

app.get('/showimage', (req, res) => {
  const query = 'SELECT * FROM image_gallery';
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching images');
    }
    res.send(result);
  });
});

app.post('/deleteimage',(req,res)=>{
    const {id}=req.body;
    const query='delete from image_gallery where id=?';
    db.query(query,[id],(err,result)=>{
        if(err) throw err;
        res.send('Image deleted');
    });
})

app.post('/upload-video',upload.single('video'),(req,res)=>{
  const {title}=req.body;
  const videoUrl=req.file?`/uploads/${req.file.filename}`:null;
    if(!videoUrl){
        return res.status(400).send('Video upload failed');
    }
    const query='INSERT INTO video_gallery (title,videoUrl) VALUES (?,?)';
    db.query(query,[title,videoUrl],(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Error saving video to database');
        }
        res.send('Video uploaded and saved to database successfully');
    })
});

app.get('/showvideo',(req,res)=>{
    const query='SELECT * FROM video_gallery';
    db.query(query,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Error fetching videos');
        }
        res.send(result);
    });
});

app.post('/deletevideo',(req,res)=>{
    const {id}=req.body;
    const query='delete from video_gallery where id=?';
    db.query(query,[id],(err,result)=>{
        if(err) throw err;
        res.send('Video deleted');
    });
})

app.post('/upload-image-slider',upload.single('image'),(req,res)=>{
    const {title}=req.body;
    const imageUrl=req.file?`/uploads/${req.file.filename}`:null;
    if(!imageUrl){
        return res.status(400).send('Slider upload failed');
    }
    const query='INSERT INTO sliders (title,imageUrl) VALUES (?,?)';
    db.query(query,[title,imageUrl],(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Error saving slider to database');
        }
        res.send('Slider uploaded and saved to database successfully');
    })
});
app.get('/showslider',(req,res)=>{
const query='select * from sliders'
db.query(query,(err,result)=>{
    if(err){console.log(err);}
    res.send(result);
})
});

app.get('/studentcount',(req,res)=>{
    const query='select department ,count(*) as studentcount from students group by department';
    db.query(query,(err,result)=>{
        if(err) throw err;
        res.send(result);
    }
    )
    });

    app.get('/teachercount',(req,res)=>{
        const query='select department ,count(*) as teachercount from teachers group by department';
        db.query(query,(err,result)=>{
            if(err) throw err;
            res.send(result);
        }
        )
        });

   app.post('/setticker',(req,res)=>{
  const {message} = req.body;
  const query= 'insert into tickers (message) values(?)'
  db.query(query,[message],(err,result)=>{
    if(err)throw err;
    res.send('ticker set sucessfully');
  })
   });

   app.get('/showticker',(req,res)=>{
     const query= 'select * from tickers';
     db.query(query,(err,result)=>{
        res.send(result);
     })
   });
   
   app.post('/deleteticker',(req,res)=>{
    const {id}=req.body;
    const query= 'delete from tickers where id =? ';
    db.query(query,[id],(err,result)=>{
        if(err)throw err;
        res.send(result);
        console.log('ticker deleted');
    });
   });

   app.post('/sendcontact',(req,res)=>{
    const {name,message,email}=req.body;
    const query='insert into contact (name,message,email) values(?,?,?)';
    db.query(query,[name,message,email],(err,result)=>{
        if(err) throw err;
        res.send('contact set successfully');
    });
   })
   app.get('/getcontact',(req,res)=>{
    const query='select * from contact';
    db.query(query,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);});
    });

    app.post('/scheduleexam',(req,res)=>{
        console.log('exam calles');
        const {course,examdate}=req.body;
        const query='insert into exam (course,examdate) values(?,?)';
        db.query(query,[course,examdate],(err,result)=>{
            if(err) throw err;
            res.send('Exam scheduled successfully');
        });
    })
    app.get('/showexam',(req,res)=>{
        const query='select * from exam';
        db.query(query,(err,result)=>{
            if(err) throw err;
            res.send(result);
        });
    });

app.listen(5000,()=>{console.log('Server started on port 3000')});