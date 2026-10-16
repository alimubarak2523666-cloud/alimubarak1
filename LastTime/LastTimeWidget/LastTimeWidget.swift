import WidgetKit
import SwiftUI
import SwiftData

@main
struct LastTimeWidgetBundle: WidgetBundle {
    var body: some Widget {
        LastTimeWidget()
    }
}

struct LastTimeWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "LastTimeWidget", provider: Provider()) { entry in
            LastTimeWidgetView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Last Time")
        .description("See what's been the longest, and tap to mark it done.")
        .supportedFamilies([
            .systemSmall, .systemMedium, .systemLarge,
            .accessoryCircular, .accessoryRectangular,
        ])
    }
}

// MARK: - Timeline

struct ItemSnapshot: Identifiable {
    let id: String
    let name: String
    let emoji: String
    let days: Int
    let overdue: Bool
}

struct LastTimeEntry: TimelineEntry {
    let date: Date
    let items: [ItemSnapshot]
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> LastTimeEntry {
        LastTimeEntry(date: .now, items: Self.samples)
    }

    func getSnapshot(in context: Context, completion: @escaping (LastTimeEntry) -> Void) {
        if context.isPreview {
            completion(placeholder(in: context))
        } else {
            completion(entries(at: [.now])[0])
        }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<LastTimeEntry>) -> Void) {
        // "Days ago" changes at midnight, so prepare that entry too.
        let now = Date.now
        let calendar = Calendar.current
        let midnight = calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: now)) ?? now.addingTimeInterval(86_400)
        completion(Timeline(entries: entries(at: [now, midnight]), policy: .after(midnight)))
    }

    private func entries(at dates: [Date]) -> [LastTimeEntry] {
        let context = ModelContext(SharedStore.shared)
        let items = (try? context.fetch(FetchDescriptor<Item>())) ?? []
        return dates.map { date in
            let top = items.byUrgency(now: date).prefix(6).map { item in
                ItemSnapshot(
                    id: item.uuid.uuidString,
                    name: item.name,
                    emoji: item.emoji,
                    days: item.daysSince(date),
                    overdue: item.isOverdue(date)
                )
            }
            return LastTimeEntry(date: date, items: Array(top))
        }
    }

    static var samples: [ItemSnapshot] {
        [
            ItemSnapshot(id: "1", name: String(localized: "Changed toothbrush"), emoji: "🪥", days: 92, overdue: true),
            ItemSnapshot(id: "2", name: String(localized: "Called Mom"), emoji: "📞", days: 4, overdue: false),
            ItemSnapshot(id: "3", name: String(localized: "Watered the plants"), emoji: "🪴", days: 2, overdue: false),
        ]
    }
}

// MARK: - Views

struct LastTimeWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: LastTimeEntry

    var body: some View {
        if let first = entry.items.first {
            switch family {
            case .systemSmall:
                SmallView(item: first)
            case .accessoryCircular:
                CircularView(item: first)
            case .accessoryRectangular:
                RectangularView(item: first)
            case .systemLarge:
                ListView(items: Array(entry.items.prefix(6)))
            default:
                ListView(items: Array(entry.items.prefix(3)))
            }
        } else {
            EmptyWidgetView()
        }
    }
}

private struct DoneButton: View {
    let item: ItemSnapshot

    var body: some View {
        Button(intent: MarkDoneIntent(itemID: item.id)) {
            Image(systemName: item.days == 0 ? "checkmark.circle.fill" : "checkmark.circle")
                .font(.title2)
                .foregroundStyle(item.days == 0 ? Color.green : Color.accentColor)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(Text("Mark as Done"))
    }
}

private struct SmallView: View {
    let item: ItemSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .top) {
                Text(verbatim: item.emoji)
                    .font(.largeTitle)
                Spacer()
                DoneButton(item: item)
            }
            Spacer(minLength: 0)
            Text(verbatim: item.name)
                .font(.headline)
                .lineLimit(2)
            DaysAgoText(days: item.days)
                .font(.subheadline)
                .foregroundStyle(item.overdue ? Color.orange : Color.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    }
}

private struct ListView: View {
    let items: [ItemSnapshot]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ForEach(items) { item in
                HStack(spacing: 10) {
                    Text(verbatim: item.emoji)
                        .font(.title3)
                    VStack(alignment: .leading, spacing: 0) {
                        Text(verbatim: item.name)
                            .font(.subheadline.weight(.semibold))
                            .lineLimit(1)
                        DaysAgoText(days: item.days)
                            .font(.caption)
                            .foregroundStyle(item.overdue ? Color.orange : Color.secondary)
                    }
                    Spacer(minLength: 4)
                    DoneButton(item: item)
                }
            }
            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

private struct CircularView: View {
    let item: ItemSnapshot

    var body: some View {
        ZStack {
            AccessoryWidgetBackground()
            VStack(spacing: 0) {
                Text(verbatim: item.emoji)
                    .font(.caption)
                Text(item.days, format: .number)
                    .font(.headline)
                    .minimumScaleFactor(0.6)
            }
        }
    }
}

private struct RectangularView: View {
    let item: ItemSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(verbatim: "\(item.emoji) \(item.name)")
                .font(.headline)
                .lineLimit(1)
            DaysAgoText(days: item.days)
                .font(.subheadline)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

private struct EmptyWidgetView: View {
    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: "clock.arrow.circlepath")
                .font(.title2)
            Text("Add something in the app")
                .font(.caption)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview(as: .systemMedium) {
    LastTimeWidget()
} timeline: {
    LastTimeEntry(date: .now, items: Provider.samples)
}
