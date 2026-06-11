const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// 📝 1. CREATE NEW POST (POST ROUTE)
router.post('/create', async (req, res) => {
    try {
        const { userId, content, isAnonymous } = req.body;

        if (!userId || !content) {
            return res.status(400).json({ message: 'User ID aur content dono zaroori hain!' });
        }

        const newPost = new Post({
            userId,
            content,
            isAnonymous: isAnonymous || false
        });

        const savedPost = await newPost.save();
        
        return res.status(201).json({ 
            message: 'Aapki baat SafeSpace par share ho gayi hai! 🕊️', 
            post: savedPost 
        });
    } catch (error) {
        console.error("CREATE ERROR:", error);
        return res.status(500).json({ message: 'Server me gadbad hui!', error: error.message });
    }
});

// 📬 2. GET ALL POSTS (GET ROUTE)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: 'Posts fetch karne me gadbad hui!', error: error.message });
    }
});

// 🔍 GET ROUTE: Database se saare posts khinch kar laane ke liye
router.get('/', async (req, res) => {
  try {
    // .find() saare posts nikaalega aur .sort({createdAt: -1}) se naye posts sabse upar dikhenge!
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server gadbad kar raha hai posts laane me!" });
  }
});

module.exports = router;