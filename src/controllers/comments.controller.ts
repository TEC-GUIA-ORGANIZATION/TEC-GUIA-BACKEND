import { Request, Response } from 'express';
import { IComment, CommentsModel } from '../presentation/Models/comments.model';
import { ActivityModel } from '../presentation/Models/activities.model';
import mongoose from 'mongoose';

export class CommentController {

    constructor () {}

    public createComment = async (req: Request, res: Response) => {
        try {
            
            const activityExists = await ActivityModel.exists({_id: req.body.activityID});
            if(!activityExists)
                return res.status(404).json({message: 'Activity not found'});

            const newComment = await CommentsModel.create({
                activityID: req.body.activityID,
                // professor: req.body.professor,
                professor: req.body.name + " " + req.body.firstLastname + " " + req.body.secondLastname,
                message: req.body.message,
                timestamp: req.body.timestamp,
                parentID: req.body._id,
            });
            await this.addComentsToActivity(req.body.activityID, newComment._id.toString());

            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    public updateComment = async (req: Request, res: Response) => {
        try {
            const commentID  = req.params.commentID;

            const updatedComment = await CommentsModel.findByIdAndUpdate(commentID, {message: req.body.message,}, { new: true });

            if(!updatedComment) 
                return res.status(404).json({ message: 'Comment not found'});

            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    //Reddit Style
    public deleteComment = async (req: Request, res: Response) => {
        try {
            const commentID  = req.params.commentID;

            const deletedComment = await CommentsModel.findByIdAndUpdate(commentID, {message: "Comentario eliminado",}, { new: true });

            if(!deletedComment) 
                return res.status(404).json({ message: 'Comment not found'});

            res.status(200).json(deletedComment);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    //Delete everything
    public deleteCommentAndReplies = async (commentID: mongoose.Types.ObjectId, comment: IComment) => {

        const deletedComment = await CommentsModel.findByIdAndDelete(commentID);

        if(!deletedComment) 
            return;

        await CommentsModel.deleteMany({ parentID: commentID });
        
        for (const reply of comment.children) { 
            console.log('Hola estoy dentro de un for');
            await this.deleteCommentAndReplies(reply._id, comment); 
        }
            
    }

    public deleteCommentByID = async (req: Request, res: Response) => {
        try {
            const comment = await CommentsModel.findById(req.params.commentID);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            await this.deleteCommentAndReplies(comment?._id , comment);
            res.status(200).json({message: 'Comentario eliminado con éxito'});
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }


    public replyToComment = async (req: Request, res: Response) => {

        try {
            const parentID = req.params.parentID;
            const { professor, message } = req.body;

            const parentComment = await CommentsModel.findById(parentID);
            if(!parentComment)
                return res.status(404).json({message: 'Main comment not found'});
    
            const newReply = await CommentsModel.create( {
                activityID: parentComment.activityID,
                professor: professor,
                message: message,
                parentID: parentID
            });
    
            parentComment.children.push(newReply._id);
            await parentComment.save();
            res.status(201).json(newReply);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    public addComentsToActivity = async (activityId: string, commentID: string) => {
        await ActivityModel.findByIdAndUpdate(
            activityId,
            { $push: { comments: commentID} },
            { new: true }
        )
    }

    public getcommentsbyactivityid = async (req: Request, res: Response) => {
        try {
            const activityID = req.params.id;
            const comments = await CommentsModel.find({
                activityID: activityID
            });
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}
