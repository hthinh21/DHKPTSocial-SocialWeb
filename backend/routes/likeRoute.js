import express, { request, response } from 'express';
import { Like } from '../models/likeModel.js';

const router = express.Router();

//Route for Like
router.post('/', async (request, response) => {
  try {
    if (
      !request.body.articleID ||
      !request.body.userID
    ) {
      return response.status(400).send({
        message: 'Send all required fields: ArticleID, UserID',
      });
    }
    else{
      const newLike = {
          userID: request.body.userID,
          articleID: request.body.articleID
        };
        const like = await Like.create(newLike);

        return response.status(201).send(like);
    }
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
//Route for Unlike
router.delete('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      const result = await Like.findByIdAndDelete(id);
  
      if (!result) {
        return response.status(404).json({ message: 'Like not found' });
      }
  
      return response.status(200).send({ message: 'Like deleted successfully' });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
router.get('/:userID/:articleID', async (request, response) => {
  const {userID, articleID} = request.params;
  const result = await Like.findOne({articleID, userID});
  return response.status(200).json(result);
})
router.get('/', async (request, response) => {
  const result = await Like.find({});
  return response.status(200).json(result);
})
export default router;