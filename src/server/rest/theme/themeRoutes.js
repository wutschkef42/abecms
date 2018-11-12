import express from 'express';

import {
	getThemes,
	postThemes,
	deleteTheme,
} from './themeController';

const router = express.Router();

router.get('/', getThemes)
router.post('/', postThemes)
router.delete('/', deleteTheme)

export default router