// visitor.service.ts

import { MessageVisitor } from "../models/automation/visitor.model";
import { ActivityStatus } from "../models/activity.model";
import { Program } from "./program.service";
import { Activity } from "../models/automation/activity.model";

export class VisitorReminder implements MessageVisitor {

    /**
     * Constructor 
     * @param date The date of the program 
     **/
    constructor(private context: Program) {}

    /**
     * Visit an activity 
     * This method will check if the activity needs to be reminded
     * @param activity The activity to visit 
     * @returns void 
     **/
    visit(activity: Activity): void {
        // Avoid notifying the same activity multiple times
        if (activity.status !== ActivityStatus.NOTIFICADA) {
            return;
        }

        const diffDays = Math.floor((activity.date.getTime() - this.context.date.getTime()) / (1000 * 3600 * 24));

        if (diffDays % activity.daysToRemember === 0 && diffDays > 0) {
            activity.notifyReminderSubscribers();
        }
    }
}

export class VisitorPublication implements MessageVisitor {

    /**
     * Constructor 
     * @param date The date of the program 
     **/
    constructor(private context: Program) {}

    visit(activity: Activity): void {
        // Avoid notifying the same activity multiple times
        if (activity.status !== ActivityStatus.PLANEADA) {
            return;
        }

        const diffDays = Math.floor((activity.date.getTime() - this.context.date.getTime()) / (1000 * 3600 * 24));

        if (diffDays <= activity.daysToAnnounce) {
            activity.status = ActivityStatus.NOTIFICADA;
            Program.getInstance().patchActivity(activity);

            // if (diffDays > 0) {
                activity.notifyPublicationSubscribers();
            // }
        }
    }
}
