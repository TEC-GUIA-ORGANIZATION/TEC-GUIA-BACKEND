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
    id: string;
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
        id: string,
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
        this.id = id;
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

    /**
     * Accept visitor reminder 
     * This method will accept a reminder visitor 
     * @param reminderVisitor The reminder visitor 
     * @returns void 
     **/
    acceptVisitorReminder(reminderVisitor: MessageVisitor): void {
        reminderVisitor.visit(this);
    }

    /**
     * Accept visitor publication 
     * This method will accept a publication visitor 
     * @param publicationVisitor The publication visitor 
     * @returns void 
     **/
    acceptVisitorPublication(publicationVisitor: MessageVisitor): void {
        publicationVisitor.visit(this);
    }

    /**
     * Subscribe 
     * This method will subscribe a subscriber to the activity 
     * @param subscriber The subscriber 
     * @returns void 
     **/
    subscribe(subscriber: Subscriber): void {
        this.suscriptores.push(subscriber);
    }

    /**
     * Unsubscribe 
     * This method will unsubscribe a subscriber from the activity 
     * @param subscriber The subscriber 
     * @returns void 
     **/
    unsubscribe(subscriber: Subscriber): void {
        this.suscriptores = this.suscriptores.filter(s => s !== subscriber);
    }

    /**
     * Notify reminder subscribers 
     * This method will notify all subscribers that the activity needs to be reminded
     * @returns void 
     **/
    notifyReminderSubscribers(): void {
        this.suscriptores.forEach(subscriber => {
            subscriber.updateReminder(this);
        });
    }

    /**
     * Notify publication subscribers 
     * This method will notify all subscribers that the activity has been published
     * @returns void 
     **/
    notifyPublicationSubscribers(): void {
        this.suscriptores.forEach(subscriber => {
            subscriber.updatePublication(this);
        });
    }
}
