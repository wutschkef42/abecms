import express from 'express';
import { getWorkflows } from './workflowController';

const router = express.Router();

router.get('/', getWorkflows)

export default router