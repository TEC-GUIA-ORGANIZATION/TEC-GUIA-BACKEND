import { Router } from "express";
import { CommentController } from '../../controllers/comments.controller';
import { validateToken } from "../../libs/verifyToken";



export class CommentsRoutes {
    static get routes(): Router {
        const router = Router();

        const commentController = new CommentController();

        router.post('/:id', commentController.createComment); 
        router.post('/:parentID/reply', commentController.replyToComment);

        return router;
    }
}