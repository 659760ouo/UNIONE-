// 引入所需的模块
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { config } from 'dotenv';


import {validateRegister} from '../middleware/validation.js'
import { authenticateUser } from '../middleware/auth.js';

config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());

if (!JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set.');
    process.exit(1);
}
// 启用 CORS
app.use(cors());
app.use(bodyParser.json());

// 连接到 SQLite 数据库
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
    // 创建用户表（如果不存在）
    db.run(`CREATE TABLE IF NOT EXISTS users_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL
    )`);

    // In server.js (database connection section)
    db.run(`CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL,
      target_date TEXT,
      start_date TEXT,
      finished_date TEXT,
      updates INTEGER DEFAULT 0,
      LOCAL_ID INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users_info(id) ON DELETE CASCADE
      
    )`);
  }
});

// 注册接口
app.post('/api/signup',validateRegister, async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // 检查用户是否已存在
    db.get('SELECT * FROM users_info WHERE email = ?', [email], async (err, user) => {
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // 对密码进行哈希处理
      const hashedPassword = await bcrypt.hash(password, 10);

      // 将新用户保存到数据库
      db.run(
        'INSERT INTO users_info (email, password, username) VALUES (?, ?, ?)',
        [email, hashedPassword, username],
        function (err) {
          if (err) {
            return res.status(500).json({ message: 'Error creating user' });
          }
          const userId = this.lastID;
          // 生成 JWT 令牌
          const token = jwt.sign(
            { userId: userId, email: email, username: username },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          res.status(201).json({
            message: 'User created successfully',
            userId: userId,
            username: username,
            token: token
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 登录接口
app.post('/api/signin', async (req, res) => {
  const { logID, password } = req.body;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(logID);
  const query = isEmail ? 'SELECT * FROM users_info WHERE email = ?' : 'SELECT * FROM users_info WHERE username = ?'
  
  if (query)
    // 通过邮箱查找用户
    db.get(query, [logID], (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      if (!user) return res.status(400).json({ message: 'Invalid credentials , email or username not found' });
      
    
    // 验证密码
      bcrypt.compare(password, user.password, (err, isMatch) => {
        
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
        // 生成 JWT 令牌
        const token = jwt.sign(
          { userId: user.id, email: user.email, username: user.username },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Login successful',
          token: token,
          user: { id: user.id, username: user.username, email: user.email }
        });
      });
    });
  }
  
  



);

app.get('/api/profile',authenticateUser, async(req, res) => {
  try{
    const username = req.user.username
    const email = req.user.email
    res.json({
      username: username,
      message: 'Identity Approved, fetching Home page',
      email: email
    }
    )
  }catch(error){
    res.status(500).json({ error: 'Server error' });
  }

});


app.get('/api/token_reg', authenticateUser, async(req, res) => {
  try{
    const d_user = req.user
    
    const refresh_token = jwt.sign(
          { userId: d_user.id, email: d_user.email, username: d_user.username},
          JWT_SECRET,
          { expiresIn: '3d' }
        );
    
    res.json({
      token: refresh_token
    })

    
  }catch(error){
    return res.status(400).json({
      errors: error
    })
      
  }

}
)

// Get user's goals
app.get('/api/goals', authenticateUser, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT LOCAL_ID AS id, title, description, status, updates, target_date AS targetDate, start_date AS startDate, finished_date AS finishedDate FROM goals WHERE user_id = ?', [userId], (err, goals) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({
      data: goals}
    );
  });
});

// Add new goal
app.post('/api/goals', authenticateUser, (req, res) => {
  
  
  const { id, title, description, status, update, targetDate, startDate} = req.body;
  
  const userId = req.user.id;
  
  db.run(
    `INSERT INTO goals (user_id, title, description, status, updates, target_date, start_date, LOCAL_ID) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, title, description, status, update, targetDate, startDate, id],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error saving goal' });
      res.status(201).json({ 
        id: this.lastID,
        message: 'Goal created successfully' 
      });
    }
  );
});

// Update goal status
app.patch('/api/goals/:id', authenticateUser, (req, res) => {
  const { id } = req.params;
  const { status, finishedDate } = req.body;
  const userId = req.user.id;


  db.run(
    `UPDATE goals SET status = ?, finished_date = ? 
     WHERE LOCAL_ID = ? AND user_id = ?`,
    [status, finishedDate, id, userId],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error updating goal' });
      res.json({ data: {
        message: 'Goal updated' }
      });
      
    }
  );
});

// Delete goal
app.delete('/api/goals/:id', authenticateUser, (req, res) => {
  
  const { id } = req.params;
  const userId = req.user.id;
  console.log(id,userId)
  db.run(
    'DELETE FROM goals WHERE LOCAL_ID = ? AND user_id = ?',
    [id, userId],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error deleting goal' });
      res.json({ message: 'Goal deleted' });
      
    }
  );
});

// Add this after the other goal endpoints in server.js
app.get('/api/goals/stats/completed', authenticateUser, (req, res) => {
  const userId = req.user.id;
  
  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Query to get completed goals grouped by date
  db.all(`
    SELECT DATE(finished_date) as date, COUNT(*) as count 
    FROM goals 
    WHERE user_id = ? 
      AND status = 'finished' 
      AND finished_date >= ?
    GROUP BY DATE(finished_date)
    ORDER BY date ASC
  `, [userId, thirtyDaysAgo.toISOString().split('T')[0]], (err, stats) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    // Calculate total completed goals  : use reduce accumulator, set an initial value 0 , in which each iterables will be added to sum
    const totalCompleted = stats.reduce((sum, item) => sum + parseInt(item.count), 0);  
    
    res.json({ stats: stats, totalCompleted: totalCompleted });
  });
});



// 启动服务器
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});



export default db;