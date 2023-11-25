const express = require('express');

const User = require('../Models/User');
const UserFollower = require('../Models/UserFollower');
const Murmur = require('../Models/Murmur');
const MurmurLike = require('../Models/MurmurLike')
require('./../Models/associations');

const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');
const Authcontroller = express.Router();
const Auth = require('../middlewares/Auth');
const {extractUserId} = require('./AuthUtils');
const { Sequelize, where } = require('sequelize');


Authcontroller.post('/api/login', async (req, res) => {
    const { name, password } = req.body;
    try {
      const user = await User.findOne({
        where:{
          name:name
        }
      });
      if (user) {
        const isValidPassword = await bcript.compare(password, user.password);
        if(isValidPassword){
          const token = jwt.sign({
            userName:user.name,
            id: user.id
          },process.env.JWT_SECRET,{expiresIn:'365d'});
          res.status(200).json({
            access_token: token,
            message: "Login successful" 
          });
        }else{
          res.status(401).json({ message: "Invalid username or password" });
        }
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }

    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

Authcontroller.post('/api/registration', async (req, res)=>{
  const {name, password} = req.body;
  try{
    let user = await User.findOne({
      where:{
        name:name,
      }
    });
    if(!user){
      const hashedPassword = await bcript.hash(password,10);
      user = await User.create({
        name:name,
        password: hashedPassword
      });
      const token = jwt.sign({
        userName:user.name,
        id: user.id
      },process.env.JWT_SECRET,{expiresIn:'365d'});
      res.status(200).json({
        access_token: token,
        message: "Registration successful" 
      });
    }else{
      res.json({
        error:true,
        message:'This name was taken by another user'
      });
    }
  }catch(error){
    console.log(error);
    res.status(500).json({message:'Server error'});
  }

});

Authcontroller.get('/api/get_user', Auth,async (req, res) => {
  const user_id = extractUserId(req);
  try{
    
    const user = await User.findOne({
      where:{
        id:user_id,
      }
    });
    res.status(200).json(user); 
  }catch(error){
    console.log(error);
  }
  
});

Authcontroller.get('/api/my_timeline', Auth,async (req, res) => {
  const user_id = extractUserId(req);
  try{
    
    const followers = await User.findOne({
      where:{
        id:user_id
      },
      include:{
        model: UserFollower,
        required: false,
        include:[
          {
            model: User,
            attributes: ['id', 'name', 'password', 'created_at', 'updated_at'],
            foreignKey: 'followed_by',
            targetKey: 'id',
            as: 'follower',
          },
        ],
      }, 
    });
    let follower_ids = [user_id];
    if (followers && followers.UserFollowers) {
      followers.UserFollowers.forEach((follower) => {
        follower_ids.push(follower.followed_by);
      });
    }
    const murmurs = await Murmur.findAll({
      where: {
        user_id: {
          [Sequelize.Op.in]: follower_ids,
        },
      },
      include: [
        {
          model: MurmurLike,
          as: 'likes',
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const modifiedMurmurs = murmurs.map((murmur) => {
      return {
        ...murmur.get(),
        is_deletable: murmur.user_id == user_id,
      };
    });
    
    


    res.status(200).json({
      user_details:followers,
      murmurs:modifiedMurmurs
    });

    
  }catch(error){
    console.log(error);
  }
  
});

Authcontroller.delete('/api/murmur/:id', Auth, async (req, res)=>{
  try{
    const murmurId = req.params.id;
    await Murmur.destroy({
      where: {
        id: murmurId,
      },
    });
    res.status(200).json({
      message: 'Murmur deleted successfully',
    });
  }catch(error){
    console.log(error);
  }

});

Authcontroller.get('/api/murmurs/:murmurId/like', async (req, res) => {
  const { murmurId } = req.params;
  const user_id = extractUserId(req);
  try {
    // Check if the user has already liked the murmur
    const existingLike = await MurmurLike.findOne({
      where: {
        murmur_id: murmurId,
        user_id: user_id,
      },
    });

    if (existingLike) {
      // User has already liked the murmur, you can handle this scenario as needed
      return res.status(400).json({ message: 'You have already liked this murmur.' });
    }

    // If the user hasn't liked the murmur, create a new like
    const like = await MurmurLike.create({
      murmur_id: murmurId,
      user_id: user_id,
    });

    

    res.status(200).json({ like: like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

Authcontroller.get('/api/get_user_list', Auth,async (req, res) => {
  const user_id = extractUserId(req);
  try{
    
    const followers = await User.findOne({
      where:{
        id:user_id
      },
      include:{
        model: UserFollower,
        required: false,
      }, 
    });
    let follower_ids = [user_id];
    
    if (followers && followers.UserFollowers) {
      followers.UserFollowers.forEach((follower) => {
        follower_ids.push(follower.followed_by);
      });
    }
    
    const users = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.not]: follower_ids,
        },
      },
    });
    
    res.json(users);
    
  }catch(error){
    console.log(error);
  }
  
});

Authcontroller.post('/api/add_follower', Auth, async (req, res) => {
  const user_id = extractUserId(req);
  const  followerId  = req.body.user_id;
  try {
    // Check if the user is trying to follow themselves
    if (user_id === followerId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    // Check if the followerId is a valid user
    const follower = await User.findOne({
      where: {
        id: followerId,
      },
    });

    if (!follower) {
      return res.status(404).json({ message: "Follower not found" });
    }

    // Check if the user is already following the given follower
    const existingFollower = await UserFollower.findOne({
      where: {
        user_id,
        followed_by: followerId,
      },
    });

    if (existingFollower) {
      return res.status(400).json({ message: "User is already following the given follower" });
    }

    // Add the follower
    await UserFollower.create({
      user_id: user_id,
      followed_by: followerId,
    });

    res.status(200).json({ message: "Follower added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

Authcontroller.post('/api/add_murmur', Auth, async (req, res) => {
  const user_id = extractUserId(req);
  const { content } = req.body;
  try {
    
    const newMurmur = await Murmur.create({
      user_id: user_id,
      content: content,
    });

    const followers = await User.findOne({
      where:{
        id:user_id
      },
      include:{
        model: UserFollower,
        required: false,
        include:[
          {
            model: User,
            attributes: ['id', 'name', 'password', 'created_at', 'updated_at'],
            foreignKey: 'followed_by',
            targetKey: 'id',
            as: 'follower',
          },
        ],
      }, 
    });
    let follower_ids = [user_id];

    if (followers && followers.UserFollowers) {
      followers.UserFollowers.forEach((follower) => {
        follower_ids.push(follower.followed_by);
      });
    }
    const murmurs = await Murmur.findAll({
      where: {
        user_id: {
          [Sequelize.Op.in]: follower_ids,
        },
      },
      include: [
        {
          model: MurmurLike,
          as: 'likes',
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const modifiedMurmurs = murmurs.map((murmur) => {
      return {
        ...murmur.get(),
        is_deletable: murmur.user_id == user_id,
      };
    });

    res.status(201).json({
      murmurs:modifiedMurmurs
    });


  } catch (error) {
    console.error('Error creating murmur:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

Authcontroller.get('/api/follower_stats', Auth, async (req, res)=> {
  const user_id = extractUserId(req);
  try {
    const followerCount = await UserFollower.count({
      where: { followed_by: user_id },
    });

    const followingCount = await UserFollower.count({
      where: { user_id: user_id },
    });

    res.json({
      followerCount: followerCount,
      followingCount: followingCount,
    });
  } catch (error) {
    console.error("Error getting follower stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = Authcontroller;