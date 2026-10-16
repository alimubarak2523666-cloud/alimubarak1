import SwiftData
import WidgetKit

/// Saves changes and keeps the widget and reminders in step.
@MainActor
enum Store {
    static func commit(_ item: Item) {
        try? item.modelContext?.save()
        WidgetCenter.shared.reloadAllTimelines()
    }

    static func markDone(_ item: Item) {
        item.markDone()
        commit(item)
        Reminders.schedule(for: item)
    }

    static func undoLastDone(_ item: Item) {
        item.undoLastDone()
        commit(item)
        Reminders.schedule(for: item)
    }

    static func delete(_ item: Item) {
        Reminders.cancel(for: item)
        let context = item.modelContext
        context?.delete(item)
        try? context?.save()
        WidgetCenter.shared.reloadAllTimelines()
    }
}
