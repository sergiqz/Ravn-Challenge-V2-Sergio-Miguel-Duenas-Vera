import express from 'express';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { Pool } from 'pg';

const router = express.Router();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'snack_shop',
  password: 'sergio1997',
  port: 5432,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
  }
});

router.post('/products', upload.single('image'), async (req: Request, res: Response) => {
    const { id, name, price, description } = req.body;
    const imageUrl = `/uploads/${req.file?.filename}`;
  
    if (!name) {
      return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
    }

    try {
      const result = await pool.query(
        'UPDATE product SET image_url = $1, name = $2, price = $3, description = $4 WHERE id = $5 RETURNING *',
        [imageUrl, name, price, description, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  });
  
export default router;
