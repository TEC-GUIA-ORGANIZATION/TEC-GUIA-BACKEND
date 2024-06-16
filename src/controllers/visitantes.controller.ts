import { MessageVisitor } from "../models/visitor.model";
import { IActivity } from "../models/activity.model";

export class AcceptVisitorReminder implements MessageVisitor {
    visit(activities: IActivity): void {
        return;
    }
}

export class AcceptVisitorPublication implements MessageVisitor {
    visit(activities: IActivity): void {
        return;
    }
}