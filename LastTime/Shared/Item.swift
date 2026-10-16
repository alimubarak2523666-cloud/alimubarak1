import Foundation
import SwiftData

/// Something the user does every so often, like "Changed toothbrush".
@Model
final class Item {
    var uuid: UUID = UUID()
    var name: String = ""
    var emoji: String = "✅"
    var lastDone: Date = Date.now
    /// Every time it was done, newest first.
    var history: [Date] = []
    /// Remind after this many days without doing it. 0 means no reminder.
    var remindAfterDays: Int = 0
    var createdAt: Date = Date.now

    init(name: String, emoji: String, lastDone: Date = .now, remindAfterDays: Int = 0) {
        self.uuid = UUID()
        self.name = name
        self.emoji = emoji
        self.lastDone = lastDone
        self.history = [lastDone]
        self.remindAfterDays = remindAfterDays
        self.createdAt = .now
    }

    var hasReminder: Bool { remindAfterDays > 0 }

    /// Whole calendar days since it was last done (0 = today).
    func daysSince(_ now: Date = .now) -> Int {
        let calendar = Calendar.current
        let days = calendar.dateComponents(
            [.day],
            from: calendar.startOfDay(for: lastDone),
            to: calendar.startOfDay(for: now)
        ).day ?? 0
        return max(days, 0)
    }

    func isOverdue(_ now: Date = .now) -> Bool {
        hasReminder && daysSince(now) >= remindAfterDays
    }

    func markDone(at date: Date = .now) {
        lastDone = date
        history.insert(date, at: 0)
        if history.count > 500 {
            history.removeLast(history.count - 500)
        }
    }

    /// Removes the most recent "done", for when it was tapped by mistake.
    func undoLastDone() {
        guard history.count > 1 else { return }
        history.removeFirst()
        lastDone = history[0]
    }

    /// Average number of days between dones, once there are at least two.
    var averageGapDays: Int? {
        guard history.count >= 2, let newest = history.first, let oldest = history.last else { return nil }
        let days = Calendar.current.dateComponents([.day], from: oldest, to: newest).day ?? 0
        return max(1, Int((Double(days) / Double(history.count - 1)).rounded()))
    }

    /// When the reminder notification should fire (9:00 local time), if any.
    var nextReminderDate: Date? {
        guard hasReminder else { return nil }
        let calendar = Calendar.current
        guard let day = calendar.date(byAdding: .day, value: remindAfterDays, to: calendar.startOfDay(for: lastDone)) else {
            return nil
        }
        return calendar.date(bySettingHour: 9, minute: 0, second: 0, of: day)
    }
}

extension Array where Element == Item {
    /// Overdue items first (most overdue on top), then everything else, longest ago first.
    func byUrgency(now: Date = .now) -> [Item] {
        sorted { a, b in
            let aOverdue = a.isOverdue(now)
            let bOverdue = b.isOverdue(now)
            if aOverdue != bOverdue { return aOverdue }
            if aOverdue {
                return (a.daysSince(now) - a.remindAfterDays) > (b.daysSince(now) - b.remindAfterDays)
            }
            return a.lastDone < b.lastDone
        }
    }
}
