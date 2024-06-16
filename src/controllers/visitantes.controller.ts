import { MessageVisitor } from "../models/mongo/visitor.model";
import { IActivity } from "../models/mongo/activity.model";

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