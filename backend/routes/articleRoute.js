import express from 'express';
import { Article } from '../models/articleModel.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - description
 *         - publishDate
 *         - articleStatus
 *       properties:
 *         description:
 *           type: string
 *           example: "Somthing to introduce this article"
 *         publishDate:
 *           type: string
 *           example: "13/09/2024"
 *         articleStatus:
 *           type: string
 *           example: "Active"
 *         numberOfComment:
 *           type: Number
 *           example: 200
 *         numberOfLike:
 *           type: Number
 *           example: 100
 *         userID:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 */

/**
 * @swagger
 * tags:
 *   name: Article
 *   description: API to manage articles
 */

// Route for Create Article
/**
 * @swagger
 * /articles:
 *   post:
 *     tags: [Article]
 *     summary: Create a new article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Somthing to introduce this article"
 *               publishDate:
 *                 type: string
 *                 example: "13/09/2024"
 *               articleStatus:
 *                 type: string
 *                 example: "Active"
 *               numberOfComment:
 *                 type: Number
 *                 example: 200
 *               numberOfLike:
 *                 type: Number
 *                 example: 100
 *               userID:
 *                 type: String
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       201:
 *         description: Article created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                description:
 *                  type: string
 *                  example: "Somthing to introduce this article"
 *                publishDate:
 *                  type: string
 *                  example: "13/09/2024"
 *                articleStatus:
 *                  type: string
 *                  example: "Active"
 *                numberOfComment:
 *                  type: Number
 *                  example: 200
 *                numberOfLike:
 *                  type: Number
 *                  example: 100
 *                userID:
 *                  type: String
 *                  example: "60d0fe4f5311236168a109ca"
 */
router.post('/', async (request, response) => {
    try {
      if (
        !request.body.descriptionPost ||
        !request.body.user
      ) {
        return response.status(400).send({
          message: 'Send all required fields: Description, User',
        });
      }
      else{
        const newArticle = {
            description: request.body.descriptionPost,
            userID: request.body.user
          };
          const article = await Article.create(newArticle);

          return response.status(201).send(article);
      }
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

//Route for Get All Article of An User
/**
 * @swagger
 * /articles/{user_ID}:
 *   get:
 *     tags: [Article]
 *     summary: Get list article of an user
 *     parameters:
 *       - in: path
 *         name: user_ID
 *         required: true
 *         description: ID of the user to get article
 *         schema:
 *           type: string
 *           example: "670f69cae4bc8d1fe3c5dfd2"
 *     responses:
 *       200:
 *         description: A list of article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109cb"
 *                 description:
 *                   type: string
 *                   example: "Somthing to introduce this article"
 *                 publishDate:
 *                   type: string
 *                   example: "13/09/2024"
 *                 articleStatus:
 *                   type: string
 *                   example: "Active"
 *                 numberOfComment:
 *                   type: Number
 *                   example: 200
 *                 numberOfLike:
 *                   type: Number
 *                   example: 100
 *                 userID:
 *                   type: String
 *                   example: "60d0fe4f5311236168a109ca"
 */
router.get('/:user_ID', async (request, response) => {
    try {
        const { user_ID } = request.params;
        const articles = await Article.find({userID: user_ID});

        return response.status(200).json({
        count: articles.length,
        data: articles,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for Update Article
/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     tags: [Article]
 *     summary: Update an existing article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the article to update
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
 *               description:
 *                 type: string
 *                 example: "Something to introduce this article"
 *     responses:
 *       200:
 *         description: Article updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109cb"
 *                 description:
 *                   type: string
 *                   example: "Something to introduce this article"
 *                 publishDate:
 *                   type: Date
 *                   example: "13/09/2024"
 *                 articleStatus:
 *                   type: string
 *                   example: "Active"
 *                 numberOfComment:
 *                   type: Date
 *                   example: 100
 *                 numberOfLike:
 *                   type: string
 *                   example: 200
 *                 userID:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109cb"
 */
router.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Article.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Article not found' });
    }

    return response.status(200).send({ message: 'Article updated successfully' });
  } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
  }
});

//Route for Delete Article
/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     tags: [Article]
 *     summary: Delete an article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the article to delete
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       204:
 *         description: Article deleted
 */
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Article.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Article not found' });
    }

    return response.status(200).send({ message: 'Article deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
router.get('/all/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Article.findById(id);

    return response.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;