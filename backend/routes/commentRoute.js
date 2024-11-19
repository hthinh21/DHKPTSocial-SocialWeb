import express from 'express';
import { Comment } from '../models/commentModel.js';
const router = express.Router();

//Route for creating a comment
router.post('/', async (request, response) => {
    try {
      if (
        !request.body.articleID ||
        !request.body.userID ||
        !request.body.commentDetail
      ) {
        return response.status(400).send({
          message: 'Send all required fields: User, Following',
        });
      }
      else{
        const newComment = {
            articleID: request.body.articleID,
            userID: request.body.userID,
            commentDetail: request.body.commentDetail
          };
          const comment = await Comment.create(newComment);

          return response.status(201).send(comment);
      }
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
//Route for deleting a comment
router.delete('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      const result = await Comment.findByIdAndDelete(id);
  
      if (!result) {
        return response.status(404).json({ message: 'Comment not found' });
      }
  
      return response.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
router.get('/:articleID', async (request, response) => {
  try {
    const { articleID } = request.params;

    const result = await Comment.find({articleID: articleID}).populate('userID').sort({ publishDate: -1 });
    if (!result) {
      return response.status(404).json({ message: 'Comments not found' });
    }
    return response.status(200).send({
      count: result.length,
      data: result,
      });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;