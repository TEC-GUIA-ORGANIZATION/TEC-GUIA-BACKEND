// notification.controller.ts

import { Request, Response } from 'express';
import { Notification } from '../models/mongo/notification.model';
import { Message } from '../models/mongo/message.model';
import { Mailbox } from '../models/mongo/mailbox.model';
import { AuthenticableWrapper } from '../models/mongo/student-wrapper.model';

// Notification controller class
// This class contains methods to handle the notifications
export class NotificationController {

    // Get user notifications 
    public static getUserNotifications = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const user = await AuthenticableWrapper.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            const mailbox = await Mailbox.findById(user.mailbox);
            if (!mailbox) {
                return res.status(404).json({ error: "Mailbox not found." });
            }

            const notifications = await Notification.find({
                _id: { $in: mailbox.notificaciones }
            });

            const messages = await Message.find({
                _id: { $in: notifications.map(notification => notification.mensaje) }
            });

            // Merge notifications with messages
            const mergedNotifications = notifications.map(notification => {
                const message = messages.find(message => message._id.toString() === notification.mensaje.toString());
                return {
                    ...notification.toObject(),
                    mensaje: message
                };
            });

            return res.status(200).json(mergedNotifications);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Could not get notifications." });
        }
    }

    public static toggleReadNotification = async (req: Request, res: Response) => {
        try {
            const { notificationId } = req.params;
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res.status(404).json({ error: "Notificación no encontrada." });
            }
            notification.leido = !notification.leido;
            await notification.save();
            return res.status(200).json(notification);
        } catch (error) {
            return res.status(500).json({ error: "No se pudo cambiar el estado de la notificación." });
        }
    }

    public static deleteNotification = async (req: Request, res: Response) => {
        try {
            const { notificationId } = req.params;
            const notification = await Notification.findByIdAndDelete(notificationId);
            if (!notification) {
                return res.status(404).json({ error: "Notificación no encontrada." });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: "No se pudo eliminar la notificación." });
        }
    }
}
