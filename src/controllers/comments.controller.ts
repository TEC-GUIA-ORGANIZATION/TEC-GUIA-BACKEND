import { Request, Response } from 'express';
import { IComment, CommentsModel } from '../presentation/Models/comments.model';
import { ActivityModel } from '../presentation/Models/activities.model';

export class CommentController {

    constructor () {}

    public createComment = async (req: Request, res: Response) => {
        try {
            
            const activityExists = await ActivityModel.exists({_id: req.body.activityID});
    
            if(!activityExists)
                return res.status(404).json({message: 'Activity not found'});
    
            // const newComment = await CommentsModel.create(req.body);
            const newComment = await CommentsModel.create({
                activityID: req.body.activityID,
                proffesor: req.body.professor,
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

    public updateComment = async (commentID: string, update: Partial<IComment>) => {
        return await CommentsModel.findByIdAndUpdate(commentID, update, {new: true});
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
    
}
