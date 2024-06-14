// comment.controller.ts

import { Request, Response } from 'express';
import { IComment, Comment } from '../models/comment.model';
import { Activity } from '../models/activity.model';
import mongoose from 'mongoose';

export class CommentController {

    public static createComment = async (req: Request, res: Response) => {
        try {

            const activityExists = await Activity.exists({_id: req.url.split('/')[1]});
            if(!activityExists)
                return res.status(404).json({message: 'Activity not found'});

            const newComment = await Comment.create({
                activityID: req.url.split('/')[1],
                professor: req.body.autor.nombre + ' ' + req.body.autor.primerApellido + ' ' + req.body.autor.segundoApellido,
                message: req.body.contenido,
                timestamp: req.body.fechaHora,
                parentID: req.body._id
                //activityID: req.body.activityID,

            });
            await this.addComentsToActivity(req.body.activityID, newComment._id.toString());

            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    public static updateComment = async (req: Request, res: Response) => {
        try {
            const commentID  = req.params.commentID;

            const updatedComment = await Comment.findByIdAndUpdate(commentID, {message: req.body.message,}, { new: true });

            if(!updatedComment) 
                return res.status(404).json({ message: 'Comment not found'});

            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    // Reddit Style
    public static deleteComment = async (req: Request, res: Response) => {
        try {
            const commentID  = req.params.commentID;

            const deletedComment = await Comment.findByIdAndUpdate(commentID, {message: "Comentario eliminado",}, { new: true });

            if(!deletedComment) 
                return res.status(404).json({ message: 'Comment not found'});

            res.status(200).json(deletedComment);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    //Delete everything
    public static deleteCommentAndReplies = async (commentID: mongoose.Types.ObjectId, comment: IComment) => {

        const deletedComment = await Comment.findByIdAndDelete(commentID);

        if(!deletedComment) 
            return;

        await Comment.deleteMany({ parentID: commentID });

        for (const reply of comment.children) { 
            await this.deleteCommentAndReplies(reply._id, comment); 
        }

    }

    public static deleteCommentById = async (req: Request, res: Response) => {
        try {
            const comment = await Comment.findById(req.params.commentID);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            await this.deleteCommentAndReplies(comment?._id , comment);
            res.status(200).json({message: 'Comentario eliminado con éxito'});
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }


    public static replyToComment = async (req: Request, res: Response) => {

        try {
            const parentID = req.params.parentID;
            const { professor, message } = req.body;

            const parentComment = await Comment.findById(parentID);
            if(!parentComment)
                return res.status(404).json({message: 'Main comment not found'});

            const newReply = await Comment.create( {
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

    public static addComentsToActivity = async (activityId: string, commentID: string) => {
        await Activity.findByIdAndUpdate(
            activityId,
            { $push: { comments: commentID} },
            { new: true }
        )
    }

    public static getCommentsByActivityId = async (req: Request, res: Response) => {
        try {
            const activityID = req.params.id;
            const comments = await Comment.find({
                activityID: activityID
            });
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}
