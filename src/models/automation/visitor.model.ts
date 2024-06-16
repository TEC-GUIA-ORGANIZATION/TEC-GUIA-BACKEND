import { IActivity } from "../activity.model";

export interface MessageVisitor {
    visit(activities: IActivity): void;
}

export interface Visitable {
    acceptVisitorReminder(reminderVisitor: MessageVisitor): void;
    acceptVisitorPublication(publicationVisitor: MessageVisitor): void;
}










