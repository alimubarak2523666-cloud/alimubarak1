import Foundation
import UserNotifications

/// Local notifications for items that have a reminder interval.
enum Reminders {
    static func requestPermission() async -> Bool {
        (try? await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound])) ?? false
    }

    static func schedule(for item: Item) {
        let center = UNUserNotificationCenter.current()
        let id = item.uuid.uuidString
        center.removePendingNotificationRequests(withIdentifiers: [id])
        guard let date = item.nextReminderDate, date > .now else { return }

        let content = UNMutableNotificationContent()
        content.title = "\(item.emoji) \(item.name)"
        content.body = String(localized: "It's been \(item.remindAfterDays) days. Time to do it again?")
        content.sound = .default

        let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        center.add(UNNotificationRequest(identifier: id, content: content, trigger: trigger))
    }

    static func cancel(for item: Item) {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [item.uuid.uuidString])
    }
}
