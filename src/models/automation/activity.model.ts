// activity.model.ts

import mongoose from 'mongoose';
import { IActivity } from "../activity.model";
import { Publisher, Subscriber } from "./observer.model";
import { IComment } from "../mongo/comment.model";
import { ActivityModality, ActivityType } from '../activity.model';
import { MessageVisitor, Visitable } from './visitor.model';

// Activity implementation
// This class implements the activity, publisher and visitable interfaces
export class Activity implements IActivity, Publisher, Visitable {
    week: number;
    date: Date;
    type: ActivityType;
    name: string;
    description: string;
    responsible: mongoose.ObjectId;
    daysToAnnounce: number;
    daysToRemember: number;
    modality: ActivityModality;
    placeLink: string;
    poster: string;
    status: string;
    suscriptores: Subscriber[];
    evidence?: {
        attendance: [String],
        participants: [String],
        recordingLink: String
    };
    comments?: IComment[];

    constructor(
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
        suscriptores: Subscriber[],
        evidence?: {
            attendance: [String],
            participants: [String],
            recordingLink: String
        },
        comments?: IComment[],
    ) {
        this.week = week;
        this.date = date;
        this.type = type;
        this.name = name;
        this.description = description;
        this.responsible = responsible;
        this.daysToAnnounce = daysToAnnounce;
        this.daysToRemember = daysToRemember;
        this.modality = modality;
        this.placeLink = placeLink;
        this.poster = poster;
        this.status = status;
        this.suscriptores = suscriptores;
        this.evidence = evidence;
        this.comments = comments;
    }

    acceptVisitorReminder(reminderVisitor: MessageVisitor): void {}
    acceptVisitorPublication(publicationVisitor: MessageVisitor): void {}
    subscribe(subscriber: Subscriber): void {}
    unsubscribe(subscriber: Subscriber): void {}
    notifySubscribers(): void {}
}
