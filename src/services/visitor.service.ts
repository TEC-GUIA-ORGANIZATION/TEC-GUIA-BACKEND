import { MessageVisitor } from "../models/automation/visitor.model";
import { IActivity } from "../models/activity.model";
import { ActivityStatus } from "../models/activity.model";

export class AcceptVisitorReminder implements MessageVisitor {
    visit(activity: IActivity): void {
        return;
    }
}

export class AcceptVisitorPublication implements MessageVisitor {
    visit(activity: IActivity): void {
        const currentDate = new Date();
        
        const diffDays = Math.floor((activity.date.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        
        if (diffDays <= activity.daysToAnnounce) {
            
            activity.status = ActivityStatus.NOTIFICADA;

            //CentroNotificaciones.notify(activity);
        }
    }
}
