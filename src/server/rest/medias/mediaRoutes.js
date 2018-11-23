import express from 'express';

import { getImage, uploadImage, getThumbs } from './imageController';

const router = express.Router();

router.get('/', getImage)

router.get('/thumbs', getThumbs)

router.post('/', uploadImage)

export default router