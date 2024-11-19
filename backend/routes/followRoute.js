import express from 'express';
import { Follow } from '../models/followModel.js';

const router = express.Router();

//Route for Follow
router.post('/', async (request, response) => {
    try {
      if (
        !request.body.userID ||
        !request.body.followingID
      ) {
        return response.status(400).send({
          message: 'Send all required fields: User, Following',
        });
      }
      else{
        const newFollow = {
            userID: request.body.userID,
            followingID: request.body.followingID
          };
          const follow = await Follow.create(newFollow);

          return response.status(201).send(follow);
      }
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
//Route for Unfollow
router.delete('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      const result = await Follow.findByIdAndDelete(id);
  
      if (!result) {
        return response.status(404).json({ message: 'Follow not found' });
      }
  
      return response.status(200).send({ message: 'Follow deleted successfully' });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
// Route for Getting all Follower Of An User
router.get('/:follower', async (request, response) =>{
  try {
    const { follower } = request.params;
    const followings = await Follow.find({userID: follower});

    return response.status(200).json({
      count: followings.length,
      data: followings,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})

export default router;