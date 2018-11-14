import express from 'express';
import { getWorkflows, getFullWorkflows } from './workflowController';

const router = express.Router();

router.get('/', getWorkflows)

export default router