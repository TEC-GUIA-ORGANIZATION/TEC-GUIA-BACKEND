// notifications-center.service.ts

import { IActivity } from "../models/activity.model";
import { Subscriber } from "../models/automation/observer.model";

export class NotificationsCenter implements Subscriber {
    /**
     * Update reminder 
     * This send a notification to the user to remind them of the activity
     * @param context The activity context 
     * @returns void
     **/
    updateReminder(context: IActivity): void {
        console.log(`Activity "${context.name}" is coming up!`);
    }

    /**
     * Update publication 
     * This sends a notification to the user to inform them of the activity
     * @param context The activity context 
     * @returns void
     **/
    updatePublication(context: IActivity): void {
        console.log(`Activity "${context.name}" has been published!`);
    }

    /**
     * Update cancelation
     * This sends a cancelation notification to the user
     * @param context The activity context 
     * @returns void
     **/
    updateCancelation(context: IActivity): void {
        console.log(`Activity "${context.name}" has been canceled!`);
    }
}
