import express, { request, response } from 'express';
import { Notify } from '../models/notifyModel.js';

const router = express.Router();

//Route for Notification
router.post('/', async (request, response) => {
    try {
      if (
        !request.body.user ||
        !request.body.actor ||
        !request.body.actionDetail
      ) {
        return response.status(400).send({
          message: 'Send all required fields: UserID, ActorID, Action Details',
        });
      }
      else if(request.body.article){
        if(request.body.comment){
          const newNotify = {
            user: request.body.user,
            actor: request.body.actor,
            actionDetail: request.body.actionDetail,
            article: request.body.article,
            commentID: request.body.comment
          };
          const notify = await Notify.create(newNotify);
  
          return response.status(201).send(notify);
        }
        else if(request.body.like){
          const newNotify = {
            user: request.body.user,
            actor: request.body.actor,
            actionDetail: request.body.actionDetail,
            article: request.body.article,
            likeID: request.body.like
          };
          const notify = await Notify.create(newNotify);
  
          return response.status(201).send(notify);
        }
        else{
          const newNotify = {
            user: request.body.user,
            actor: request.body.actor,
            actionDetail: request.body.actionDetail,
            article: request.body.article
          };
          const notify = await Notify.create(newNotify);
  
          return response.status(201).send(notify);
        }
      }
      else{
        const newNotify = {
            user: request.body.user,
            actor: request.body.actor,
            actionDetail: request.body.actionDetail
          };
          const notify = await Notify.create(newNotify);

          return response.status(201).send(notify);
      }
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

//Route for retrieve list notifications by user id
router.get('/:user_id', async (request, response) => {
    try {
      const { user_id } = request.params;
  
      const notify = await Notify.find({ user: user_id })
      .populate('actor').populate('user').populate('article').populate('likeID').populate('commentID');
      
      return response.status(200).json(notify);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
//Route for delete Notifications
router.delete('/', async (request, response) => {
  try {
    if(request.body.like){
      const result = await Notify.findOneAndDelete({
        user: request.body.user,
        actor: request.body.actor,
        likeID: request.body.like
      }).populate('user').populate('actor').populate('likeID');

      if (!result) {
        return response.status(404).json({ message: 'Notify not found' });
      }
      return response.status(200).send({ message: 'Notify deleted successfully' });
    }
    else if(request.body.comment){
      const result = await Notify.findOneAndDelete({
        user: request.body.user,
        actor: request.body.actor,
        commentID: request.body.comment
      }).populate('user').populate('actor').populate('commentID');

      if (!result) {
        return response.status(404).json({ message: 'Notify not found' });
      }
      return response.status(200).send({ message: 'Notify deleted successfully' });
    }
    else{
      const result = await Notify.findOneAndDelete({
        user: request.body.user,
        actor: request.body.actor,
        actionDetail: 'đã theo dõi bạn'
      }).populate('user');
      if (!result) {
        return response.status(404).json({ message: 'Notify not found' });
      }
      return response.status(200).send({ message: 'Notify deleted successfully' });
    }
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
})

export default router;