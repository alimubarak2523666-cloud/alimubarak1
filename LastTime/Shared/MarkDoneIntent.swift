import AppIntents
import SwiftData
import WidgetKit

/// Runs when the checkmark on the widget is tapped.
struct MarkDoneIntent: AppIntent {
    static var title: LocalizedStringResource = "Mark as Done"
    static var description = IntentDescription("Logs that you did this today.")

    @Parameter(title: "Item ID")
    var itemID: String

    init() {}

    init(itemID: String) {
        self.itemID = itemID
    }

    func perform() async throws -> some IntentResult {
        guard let uuid = UUID(uuidString: itemID) else { return .result() }
        let context = ModelContext(SharedStore.shared)
        let descriptor = FetchDescriptor<Item>(predicate: #Predicate<Item> { $0.uuid == uuid })
        if let item = try context.fetch(descriptor).first {
            item.markDone()
            try context.save()
            Reminders.schedule(for: item)
        }
        WidgetCenter.shared.reloadAllTimelines()
        return .result()
    }
}
