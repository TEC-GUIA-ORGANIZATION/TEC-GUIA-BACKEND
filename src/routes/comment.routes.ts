// comment.routes.ts

import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';

const router = Router();

router.post('/:id', CommentController.createComment); 
router.post('/:parentID/reply', CommentController.replyToComment);
router.patch('/:CommentID', CommentController.updateComment);
router.patch('/:CommentID', CommentController.deleteComment);
router.delete('/delete/:CommentID', CommentController.deleteCommentById);
router.get('/:id', CommentController.getCommentsByActivityId);

export default router;
