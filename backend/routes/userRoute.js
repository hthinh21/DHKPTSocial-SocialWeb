import express from 'express';
import { User } from '../models/userModel.js';
import multer from 'multer';
import { searchUsers, 
  userProfile,
  userFollowerandFollowingData,
  followandUnfollowUser,
  getNotifications,
  loginUser}
  from '../controllers/userControllers.js';
import { updateUserProfile } from "../controllers/userControllers.js";
import { upload } from "../middlewares/upload.js"; 

const router = express.Router();

router.get('/notification/:id',getNotifications); 
router.post('/follow/:id', followandUnfollowUser);
router.get("/followdata/:id", userFollowerandFollowingData);
router.get('/profile/:id', userProfile);
router.put('/:id', upload.single('avatar'), updateUserProfile);
router.get("/all", searchUsers);

const uploadAvatar = multer();
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - name
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           example: "DKhoa"
 *         password:
 *           type: string
 *           example: "12345"
 *         name:
 *           type: string
 *           example: "Đăng Khoa"
 *         dob:
 *           type: Date
 *           example: "13/09/2004"
 *         email:
 *           type: string
 *           example: "khoa@gmail.com"
 *         description:
 *           type: string
 *           example: "Something to introduce your self"
 *         avatar:
 *            type: String
 *            example: "././avatar.png"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage users
 */

// Route for Register
/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "DKhoa"
 *               password:
 *                 type: string
 *                 example: "12345"
 *               name:
 *                 type: string
 *                 example: "Đăng Khoa"
 *               dob:
 *                 type: Date
 *                 example: "13/09/2004"
 *               email:
 *                 type: string
 *                 example: "khoa@gmail.com"
 *               description:
 *                 type: string
 *                 example: "Something to introduce your self"
 *               avatar:
 *                 type: String
 *                 example: "././avatar.png"
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109cb"
 *                 username:
 *                   type: string
 *                   example: "DKhoa"
 *                 password:
 *                   type: string
 *                   example: "12345"
 *                 name:
 *                   type: string
 *                   example: "Đăng Khoa"
 *                 dob:
 *                   type: Date
 *                   example: "13/09/2004"
 *                 email:
 *                   type: string
 *                   example: "khoa@gmail.com"
 *                 description:
 *                   type: string
 *                   example: "Something to introduce your self"
 *                 avatar:
 *                   type: String
 *                   example: "././avatar.png"
 */
router.post('/', async (request, response) => {
  try {
    if (
      !request.body.username ||
      !request.body.password ||
      !request.body.dob ||
      !request.body.name ||
      !request.body.email
    ) {
      return response.status(400).send({
        message: 'Send all required fields: username, password, age, name',
      });
    }
    const newUser = {
      username: request.body.username,
      password: request.body.password,
      dob: request.body.dob,
      name: request.body.name,
      email: request.body.email,
      description: "",
      avatar: request.body.avatar
    };
    const user = await User.create(newUser);

    return response.status(201).send(user);
    // if(request.body.avatar && request.body.description){
    //   const newUser = {
    //     username: request.body.username,
    //     password: request.body.password,
    //     dob: request.body.dob,
    //     name: request.body.name,
    //     email: request.body.email,
    //     description: request.body.description,
    //     avatar: request.file.buffer.toString("base64")
    //   };
    //   const user = await User.create(newUser);

    //   return response.status(201).send(user);
    // }
    // if(!request.body.description && request.file.buffer == null){
    //   const newUser = {
    //     username: request.body.username,
    //     password: request.body.password,
    //     dob: request.body.dob,
    //     name: request.body.name,
    //     email: request.body.email,
    //     description: "",
    //     avatar: ""
    //   };
    //   const user = await User.create(newUser);

    //   return response.status(201).send(user);
    // }
    // else{
    //   if(request.body.description){
    //     const newUser = {
    //       username: request.body.username,
    //       password: request.body.password,
    //       dob: request.body.dob,
    //       name: request.body.name,
    //       email: request.body.email,
    //       description: request.body.description,
    //       avatar: ""
    //     };
    //     const user = await User.create(newUser);
  
    //     return response.status(201).send(user);
    //   }
    //   else{
    //     const newUser = {
    //       username: request.body.username,
    //       password: request.body.password,
    //       dob: request.body.dob,
    //       name: request.body.name,
    //       email: request.body.email,
    //       description: "",
    //       avatar: request.file.buffer.toString("base64")
    //     };
    //     const user = await User.create(newUser);
  
    //     return response.status(201).send(user);
    //   }
    // }
    
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Users from database
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   username:
 *                     type: string
 *                     example: "DKhoa"
 *                   password:
 *                     type: string
 *                     example: "12345"
 *                   name:
 *                     type: string
 *                     example: "Đăng Khoa"
 *                   dob:
 *                     type: Date
 *                     example: "13/09/2004"
 *                   description:
 *                     type: string
 *                     example: "Something to introduce your self"
 *                   avatar:
 *                     type: string
 *                     example: "././avatar"
 */
router.get('/', async (request, response) => {
  try {
    const users = await User.find({});

    return response.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One User from database by id
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get one user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to get
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109cb"
 *                 username:
 *                   type: string
 *                   example: "DKhoa"
 *                 password:
 *                   type: string
 *                   example: "12345"
 *                 name:
 *                   type: string
 *                   example: "Đăng Khoa"
 *                 dob:
 *                   type: Date
 *                   example: "09/13/2004"
 *                 email:
 *                   type: string
 *                   example: "khoa@gmail.com"
 *                 description:
 *                   type: string
 *                   example: "Something to introduce your self"
 *                 avatar:
 *                   type: String
 *                   example: "././avatar.png"
 */
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const user = await User.findById(id).populate('followers').populate('followings');

    return response.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a User
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update an existing user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "DKhoa"
 *               password:
 *                 type: string
 *                 example: "12345"
 *               name:
 *                 type: string
 *                 example: "Đăng Khoa"
 *               dob:
 *                 type: Date
 *                 example: "09/13/2004"
 *               email:
 *                 type: string
 *                 example: "khoa@gmail.com"
 *               description:
 *                 type: string
 *                 example: "Something to introduce your self"
 *               avatar:
 *                 type: String
 *                 example: "././avatar.png"
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109cb"
 *                 username:
 *                   type: string
 *                   example: "DKhoa"
 *                 password:
 *                   type: string
 *                   example: "12345"
 *                 name:
 *                   type: string
 *                   example: "Đăng Khoa"
 *                 dob:
 *                   type: Date
 *                   example: "13/09/2004"
 *                 email:
 *                   type: string
 *                   example: "khoa@gmail.com"
 *                 description:
 *                   type: string
 *                   example: "Something to introduce your self"
 *                 avatar:
 *                   type: String
 *                   example: "././avatar.png"
 */
router.put('/:id', async (request, response) => {
  try {
    if (
        !request.body.username ||
        !request.body.password ||
        !request.body.dob ||
        !request.body.name
    ) {
      return response.status(400).send({
        message: 'Send all required fields: username, password, age, name',
      });
    }

    const { id } = request.params;

    const result = await User.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'User not found' });
    }

    return response.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a User
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete an user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'User not found' });
    }

    return response.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Get user by username
/**
 * @swagger
 * /users/username/{username}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username to get
 *         schema:
 *           type: string
 *           example: "Dkhoa"
 *     responses:
 *       200:
 *         description: A user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109cb"
 *                 username:
 *                   type: string
 *                   example: "DKhoa"
 *                 password:
 *                   type: string
 *                   example: "12345"
 *                 name:
 *                   type: string
 *                   example: "Đăng Khoa"
 *                 dob:
 *                   type: Date
 *                   example: "13/09/2004"
 *                 email:
 *                   type: string
 *                   example: "khoa@gmail.com"
 *                 description:
 *                   type: string
 *                   example: "Something to introduce your self"
 *                 avatar:
 *                   type: String
 *                   example: "././avatar.png"
 */
router.get('/username/:username', async (request, response) => {
  try {
    const { username } = request.params;
    const user = await User.findOne({ username });
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }
    response.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;