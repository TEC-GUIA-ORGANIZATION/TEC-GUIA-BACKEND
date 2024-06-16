import { IActivity } from "../mongo/activity.model";

export interface MessageVisitor {
    visit(activities: IActivity): void;
}

export interface Element {
    acceptVisitorReminder(reminderVisitor: MessageVisitor): void;
    acceptVisitorPublication(publicationVisitor: MessageVisitor): void;
}










