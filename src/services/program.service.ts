// program.service.ts

import { Activity } from "../models/automation/activity.model";
import { NotificationsCenter } from "./notifications-center.service";
import { MessageVisitor } from "../models/automation/visitor.model";
import { VisitorPublication, VisitorReminder } from "./visitor.service";
import { IActivity } from '../models/activity.model';
import { Document, Types } from "mongoose";
import { Activity as ActivityModel } from "../models/mongo/activity.model";

export class Program {
    date: Date;
    activities: Activity[] = [];
    visitors: MessageVisitor[];
    notificationsCenter: NotificationsCenter;

    // Singleton instance
    private static instance: Program;

    /**
     * Get the singleton instance
     * @param date The date of the program
     * @returns The singleton instance
     **/
    static getInstance(): Program {
        if (!this.instance) {
            this.instance = new Program();
        }
        return this.instance;
    }

    /**
     * Constructor 
     * @param date The date of the program 
     **/
    private constructor() {
        this.date = new Date();

        // Get the activities from the database
        ActivityModel.find().exec().then((activities: (Document<unknown, {}, IActivity> & IActivity & { _id: Types.ObjectId; })[]) => {
            activities.map(activity => {
                const act = new Activity(
                    activity._id.toString(),
                    activity.week, 
                    activity.date, 
                    activity.type, 
                    activity.name, 
                    activity.description, 
                    activity.responsible, 
                    activity.daysToAnnounce, 
                    activity.daysToRemember, 
                    activity.modality, 
                    activity.placeLink, 
                    activity.poster, 
                    activity.status, 
                    [], // Subscribers
                    activity.evidence, 
                    activity.comments
                );
                this.activities.push(act);
            });
            console.log(`${activities.length} activities loaded successfully`);
        }).catch((error) => {
            console.error('Error al obtener las actividades', error);
            return [];
        });

        this.visitors = [
            new VisitorReminder(this),
            new VisitorPublication(this)
        ];

        this.notificationsCenter = new NotificationsCenter();
    }

    /**
     * Get notifications center 
     * This method returns the notifications center 
     * @returns The notifications center 
     **/
    getNotificationsCenter(): NotificationsCenter {
        return this.notificationsCenter;
    }

    /**
     * Run the program
     * This method will iterate over all activities and visitors
     * checking if the activity needs to be updated
     * and notifying the visitors
     **/
    async run(): Promise<void> {
        this.activities.forEach(activity => {
            // Subscribe the notifications center to the activity
            activity.subscribe(this.notificationsCenter);

            this.visitors.forEach(visitor => {
                // Visit the activity with the visitor
                activity.acceptVisitorReminder(visitor);
                activity.acceptVisitorPublication(visitor);
            });
        });
    }

    /**
     * Update the date
     * This method will update the date and run the program
     * @param date The new date
     **/
    updateDate(date: Date): void {
        this.date = date;
        this.run();
    }

    /**
     * Update an activity 
     * This method will update an activity 
     * @param activity The activity to update 
     * @returns void 
     **/
    updateActivity(activity: Activity): void {
        this.activities = this.activities.map(act => {
            if (act.id === activity.id) {
                this.visitors.forEach(visitor => {
                    // Visit the activity with the visitor
                    activity.acceptVisitorReminder(visitor);
                    activity.acceptVisitorPublication(visitor);
                });
                return activity;
            }
            return act;
        });
    }

    /**
     * Patch an activity 
     * This method will patch an activity into the database
     * @param activity The activity to patch 
     * @returns void
     **/
    patchActivity(activity: Activity): void {
        ActivityModel.findByIdAndUpdate(activity.id, activity).exec().then(() => { }).catch((error) => {
            console.error('Error al actualizar la actividad', error);
        });
    }
}
