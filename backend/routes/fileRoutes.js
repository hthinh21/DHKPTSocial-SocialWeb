import express from 'express';
import multer from 'multer';
import {MongoClient, GridFSBucket} from 'mongodb'
import mongoose from 'mongoose';

const router = express.Router();

const dbName = 'DHKPTSocial';

const upload = multer();

let db;
const client = new MongoClient('mongodb+srv://root:admin123456@socialmediamern.geor3.mongodb.net/?retryWrites=true&w=majority&appName=SocialMediaMERN');
client.connect().then(() => {
  db = client.db(dbName);
});

// Tải lên file cho bài đăng
router.post('/upload', upload.single('file'), (req, res) => {
  const postId = req.body.postId;
  const bucket = new GridFSBucket(db);
  const uploadStream = bucket.openUploadStream(req.file.originalname, {
    metadata: { postId: postId}
  });
  uploadStream.end(req.file.buffer);
  uploadStream.on('finish', () => {
    res.status(200).send('File uploaded successfully');
  });
});

router.post('/upload/avatar', upload.single('avatar'), (req, res) => {
  const bucket = new GridFSBucket(db);
  const uploadStream = bucket.openUploadStream(req.file.originalname);
  uploadStream.end(req.file.buffer);
  uploadStream.on('finish', () => {
    const fileInfo = {
      _id: uploadStream.id,
      filename: req.file.originalname, 
      length: req.file.size,       
      contentType: req.file.mimetype 
    };
    
    res.status(200).json({
      message: 'File uploaded successfully',
      file: fileInfo // Trả về thông tin file
    });
  });
});

// Tải về hình ảnh và video để hiển thị
router.get('/download/:id', (req, res) => {
  const bucket = new GridFSBucket(db);
  const fileId = new mongoose.Types.ObjectId(req.params.id);
  const downloadStream = bucket.openDownloadStream(fileId);
  downloadStream.pipe(res).on('error', () => {
    res.sendStatus(404);
  });
});

// Lấy danh sách hình ảnh hoặc videos của bài đăng
router.get('/:postId', async (req, res) => {
  try{
    const { postId } = req.params;
    const bucket = new GridFSBucket(db);
    const files = await bucket.find({ 'metadata.postId': postId }).toArray();
    res.json(files);
  }
    catch (error){
      console.log(error);
    }
  });
export default router;