import mongoose from 'mongoose';
import { IActivity } from "../mongo/activity.model";
import { Subscriber } from "./observer.model";
import { IComment } from "../mongo/comment.model";


export class ActivityOnMemory implements IActivity{
    week: number,
    date: Date,
    type: ActivityType,
    name: string,
    description: string,
    responsible: mongoose.ObjectId,
    daysToAnnounce: number,
    daysToRemember: number,
    modality: ActivityModality,
    placeLink: string,
    poster: string,
    status: string,
    evidence?: {
        attendance: [String],
        participants: [String],
        recordingLink: String
    },
    comments?: IComment[],
    suscriptores: Subscriber[],


    acceptVisitorReminder(reminderVisitor: MessageVisitor): void;
    acceptVisitorPublication(publicationVisitor: MessageVisitor): void;
    subscribe(subscriber: Subscriber): void;
    unsubscribe(subscriber: Subscriber): void;
    notifySubscribers(): void;
}


//week: number,
//date: Date,
//type: ActivityType,
//name: string,
//description: string,
//responsible: mongoose.ObjectId,
//daysToAnnounce: number,
//daysToRemember: number,
//modality: ActivityModality,
//placeLink: string,
//poster: string,
//status: string,
//evidence?: {
    //attendance: [String],
    //participants: [String],
    //recordingLink: String
//},
//comments?: IComment[],
//suscriptores: Subscriber[],

//acceptVisitorReminder(reminderVisitor: MessageVisitor): void;
//acceptVisitorPublication(publicationVisitor: MessageVisitor): void;
//subscribe(subscriber: Subscriber): void;
//unsubscribe(subscriber: Subscriber): void;
//notifySubscribers(): void;