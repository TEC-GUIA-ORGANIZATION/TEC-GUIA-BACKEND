// notifications-center.service.ts

import { IActivity } from "../models/activity.model";
import { Subscriber } from "../models/automation/observer.model";
import { Mailbox } from "../models/mongo/mailbox.model";
import { Message } from "../models/mongo/message.model";
import { Notification } from "../models/mongo/notification.model";
import { Program } from "./program.service";

enum NotificationType {
    REMINDER = 'reminder',
        PUBLICATION = 'publication',
        CANCELATION = 'cancelation'
}

export class NotificationsCenter implements Subscriber {

    buildNotification(type: NotificationType, context: IActivity): string {
        var notification = '';

        switch (type) {
            case NotificationType.REMINDER:
                notification = `Recordatorio de actividad: ${context.name}

Se le recuerda la realización próxima de la actividad "${context.name}" el día ${context.date.toDateString()} a las ${context.date.toTimeString()}.

A continuación se le presenta el resumen de su información:

Descripción: ${context.description}
Semana: ${context.week}
Modalidad: ${context.modality} en ${context.placeLink}
Tipo: ${context.type}

Agradecemos su participación.`;
            break;
            case NotificationType.PUBLICATION:
                notification = `Anuncio de actividad: ${context.name}

El Instituto Tecnológico de Costa Rica se enorgullece de anunciar la realización de una nueva actividad: ${context.name}.

Esta se realizará el día ${context.date.toDateString()} a las ${context.date.toTimeString()}. La misma será ${context.modality} y se llevará a cabo en ${context.placeLink}.

Agradecemos su participación`;
            break;
            case NotificationType.CANCELATION:
                notification = `Cancelación de actividad: ${context.name}

Lamentamos informarle que la actividad "${context.name}" ha sido cancelada. Agradecemos su comprensión.`;
            break;
            default:
                notification = `Notificación de actividad: ${context.name}`;
        }

        return notification;
    }

    /**
        * Update reminder 
    * This send a notification to the user to remind them of the activity
    * @param context The activity context 
    * @returns void
    **/
    async updateReminder(context: IActivity): Promise<void> {
        try {
            const notificationContent = this.buildNotification(NotificationType.REMINDER, context);
            const date = new Date();
            const author = context.name; // Ensure this is an ObjectId

            // Create the message first and wait for the operation to complete
            const message = await Message.create({
                contenido: notificationContent,
                fecha: date,
                emisor: author // This should be an ObjectId
            });

            // Get the instance of Program
            const program = Program.getInstance();

            // Iterate over students and create notifications
            for (const student of program.getStudents()) {
                const notification = await Notification.create({
                    mensaje: message._id, // Use the _id of the created message
                    leido: false
                });

                // Find the student's mailbox and add the notification
                const mailbox = await Mailbox.findById(student.mailbox);
                if (mailbox) {
                    mailbox.notificaciones?.push(notification._id); // Use the _id of the created notification
                    await mailbox.save();
                } else {
                    console.error(`Mailbox not found for student ${student._id}`);
                }
            }

            console.log(`Reminder for activity "${context.name}" has been sent!`);
        } catch (error) {
            console.error('Error al enviar el recordatorio', error);
        }
    }

    /**
        * Update publication 
    * This sends a notification to the user to inform them of the activity
    * @param context The activity context 
    * @returns void
    **/
    async updatePublication(context: IActivity): Promise<void> {
        try {
            const notificationContent = this.buildNotification(NotificationType.PUBLICATION, context);
            const date = new Date();
            const author = context.name; // Ensure this is an ObjectId

            // Create the message first and wait for the operation to complete
            const message = await Message.create({
                contenido: notificationContent,
                fecha: date,
                emisor: author // This should be an ObjectId
            });

            // Get the instance of Program 
            const program = Program.getInstance();

            // Iterate over students and create notifications
            for (const student of program.getStudents()) {
                const notification = await Notification.create({
                    mensaje: message._id, // Use the _id of the created message
                    leido: false
                });

                // Find the student's mailbox and add the notification
                const mailbox = await Mailbox.findById(student.mailbox);
                if (mailbox) {
                    mailbox.notificaciones?.push(notification._id); // Use the _id of the created notification
                    await mailbox.save();
                } else {
                    console.error(`Mailbox not found for student ${student._id}`);
                }
            }

            console.log(`Activity "${context.name}" has been published!`);
        } catch (error) {
            console.error('Error al enviar la publicación', error);
        }
    }

    // Updated updateCancelation method
    async updateCancelation(context: IActivity): Promise<void> {
        try {
            const notificationContent = this.buildNotification(NotificationType.CANCELATION, context);
            const date = new Date();
            const author = context.name; // Ensure this is an ObjectId

            // Create the message first and wait for the operation to complete
            const message = await Message.create({
                contenido: notificationContent,
                fecha: date,
                emisor: author // This should be an ObjectId
            });

            // Get the instance of Program
            const program = Program.getInstance();

            // Iterate over students and create notifications
            for (const student of program.getStudents()) {
                const notification = await Notification.create({
                    mensaje: message._id, // Use the _id of the created message
                    leido: false
                });

                // Find the student's mailbox and add the notification
                const mailbox = await Mailbox.findById(student.mailbox);
                if (mailbox) {
                    mailbox.notificaciones?.push(notification._id); // Use the _id of the created notification
                    await mailbox.save();
                } else {
                    console.error(`Mailbox not found for student ${student._id}`);
                }
            }

            console.log(`Activity "${context.name}" has been canceled!`);
        } catch (error) {
            console.error('Error al enviar la cancelación', error);
        }
    }

}
