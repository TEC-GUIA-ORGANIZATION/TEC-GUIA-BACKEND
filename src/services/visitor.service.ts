import { MessageVisitor } from "../models/automation/visitor.model";
import { IActivity } from "../models/activity.model";

export class AcceptVisitorReminder implements MessageVisitor {
    visit(activity: IActivity): void {
        return;
    }
}

export class AcceptVisitorPublication implements MessageVisitor {
    visit(activity: IActivity): void {
        return;
    }
}
