import { Router } from "express";
import { CommentController } from '../../controllers/comments.controller';



export class CommentsRoutes {
    static get routes(): Router {
        const router = Router();

        const commentController = new CommentController();

        router.post('/:id', commentController.createComment); 
        router.post('/:parentID/reply', commentController.replyToComment);
        router.patch('/:commentID', commentController.updateComment);
        router.patch('/:commentID', commentController.deleteComment);
        router.delete('/delete/:commentID', commentController.deleteCommentByID);
        return router;
    }
}