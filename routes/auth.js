import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// POST /api/auth/register - Register a new user
router.post("/register", async (req, res) => {
  try {
    const {name,email, password} = req.body
    // TODO: Implement the registration logic
    // 1. Validate the input
    if(!name|| !email|| !password){
      return res.status(404).json({
       success: false,
       message: "name ,email,and  passwor are required"
      })

    }

    // 2. Check if the user already exists
     const existingUser = await prisma.user.findUnique({
      where:{email}
     })
     if (existingUser){
      return res.status(400).json({
        success: false,
        message: "  student this email  already exisits"
      })

     }
    // 3. Hash the password
     const saltRound = 10;
     const hashPassword = await bcrypt.hash(password, saltRound);


    // 4. Create the user
     const newUser = await prisma.user.create({
       data:{
        name,
        email,
        password:hashPassword,
       },
       select:{
        id: true,
        name:true,
        email:true,
        createdAt:true
       }
     })
    // 5. Generate a JWT token
     const token=jwt.sign(
      {userId:newUser.id},
      process.env.JWT_SECRET||"my secret",
      {expiresIn:"24"}

     )
    // 6. Return the user data and token
    res.status(201).json({
      success:true,
      message: "student Registered successfully",
      data:{
        user:newUser,
        token
      }
    })



  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
});

// POST /api/auth/login - Login user
router.post("/login", async (req, res) => {
  try {
    // TODO: Implement the login logic
    const {email,password}= req.body
    // 1. Validate the input
    if( !email|| !password){
      res.status(400).json({
     success:false,
     message:"Email and  password are required"
      })
    }
    // 2. Check if the user exists
    const user = await prisma.user.findUnique({
      where:{email}
    });
    if(!user){
      res.status(404).json({
        success:false,
        message: "user not found "
      })
    }
    // 3. Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
      res.status(401).json({
        success: false,
        message: "sorry  your password is wrong "
      })
    }
    
     const token = jwt.sign(
      {userId: user.id , email:email},
      process.env.JWT_SECRET||"my secret",
      {expiresIn: "24"}
     )
    // 5. Return the user data and token
    const { password: _, ...userData} = user;

     res.json({
      success: true,
      message: "login successful",
      data:{
        user:userData,
        token,
      }
     })
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// GET /api/auth/me - Get current user profile (protected route)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // req.user will be set by the authenticateToken middleware
    const { password, ...userWithoutPassword } = req.user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user profile",
      error: error.message,
    });
  }
});

export default router;
