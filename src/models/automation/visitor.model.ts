// visitor.model.ts

import { Activity } from "./activity.model";

export interface MessageVisitor {
    visit(activities: Activity): void;
}

export interface Visitable {
    acceptVisitorReminder(reminderVisitor: MessageVisitor): void;
    acceptVisitorPublication(publicationVisitor: MessageVisitor): void;
}
