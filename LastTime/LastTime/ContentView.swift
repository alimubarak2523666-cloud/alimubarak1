import SwiftUI
import SwiftData

struct ContentView: View {
    @Query(sort: \Item.lastDone) private var items: [Item]
    @State private var selectedID: UUID?
    @State private var editor: EditorRequest?
    @State private var doneCount = 0

    var body: some View {
        // Side-by-side on wide screens (iPhone Fold opened, Pro Max in landscape),
        // a single pushed stack on every other iPhone screen.
        NavigationSplitView {
            list
                .navigationTitle("Last Time")
                .toolbar {
                    ToolbarItem(placement: .primaryAction) {
                        Button {
                            editor = EditorRequest(mode: .add(name: "", emoji: "✅"))
                        } label: {
                            Label("Add", systemImage: "plus")
                        }
                    }
                }
        } detail: {
            if let item = items.first(where: { $0.uuid == selectedID }) {
                ItemDetailView(item: item)
            } else {
                ContentUnavailableView(
                    "Pick something",
                    systemImage: "clock.arrow.circlepath",
                    description: Text("Choose an item to see its history.")
                )
            }
        }
        .sheet(item: $editor) { request in
            ItemEditor(mode: request.mode)
        }
        .sensoryFeedback(.success, trigger: doneCount)
    }

    private var list: some View {
        let now = Date.now
        let overdue = items.filter { $0.isOverdue(now) }.byUrgency(now: now)
        let others = items.filter { !$0.isOverdue(now) }

        return List(selection: $selectedID) {
            if !overdue.isEmpty {
                Section("Overdue") {
                    ForEach(overdue) { row(for: $0) }
                }
            }
            if !others.isEmpty {
                Section {
                    ForEach(others) { row(for: $0) }
                } header: {
                    if !overdue.isEmpty {
                        Text("Everything else")
                    }
                }
            }
        }
        .overlay {
            if items.isEmpty {
                EmptyStateView { suggestion in
                    editor = EditorRequest(mode: .add(name: suggestion.name, emoji: suggestion.emoji))
                }
            }
        }
    }

    private func row(for item: Item) -> some View {
        ItemRow(item: item) { markDone(item) }
            .tag(item.uuid)
            .swipeActions(edge: .leading) {
                Button {
                    markDone(item)
                } label: {
                    Label("Done", systemImage: "checkmark")
                }
                .tint(.green)
            }
            .swipeActions(edge: .trailing) {
                Button(role: .destructive) {
                    delete(item)
                } label: {
                    Label("Delete", systemImage: "trash")
                }
            }
            .contextMenu {
                Button { markDone(item) } label: { Label("Mark as Done", systemImage: "checkmark") }
                Button { editor = EditorRequest(mode: .edit(item)) } label: { Label("Edit", systemImage: "pencil") }
                if item.history.count > 1 {
                    Button { Store.undoLastDone(item) } label: { Label("Undo last", systemImage: "arrow.uturn.backward") }
                }
                Button(role: .destructive) { delete(item) } label: { Label("Delete", systemImage: "trash") }
            }
    }

    private func markDone(_ item: Item) {
        Store.markDone(item)
        doneCount += 1
    }

    private func delete(_ item: Item) {
        if selectedID == item.uuid { selectedID = nil }
        Store.delete(item)
    }
}

struct EditorRequest: Identifiable {
    let id = UUID()
    let mode: ItemEditor.Mode
}

struct ItemRow: View {
    let item: Item
    let onDone: () -> Void

    var body: some View {
        let days = item.daysSince()
        HStack(spacing: 12) {
            Text(item.emoji)
                .font(.title2)
                .frame(width: 44, height: 44)
                .background(.quaternary, in: .circle)

            VStack(alignment: .leading, spacing: 2) {
                Text(item.name)
                    .font(.headline)
                    .lineLimit(2)
                DaysAgoText(days: days)
                    .font(.subheadline)
                    .foregroundStyle(item.isOverdue() ? Color.orange : Color.secondary)
                if item.hasReminder {
                    Text("Every \(item.remindAfterDays) days")
                        .font(.caption)
                        .foregroundStyle(.tertiary)
                }
            }

            Spacer(minLength: 8)

            Button(action: onDone) {
                Image(systemName: days == 0 ? "checkmark.circle.fill" : "checkmark.circle")
                    .font(.title)
                    .foregroundStyle(days == 0 ? Color.green : Color.accentColor)
            }
            .buttonStyle(.borderless)
            .accessibilityLabel(Text("Mark as Done"))
        }
        .padding(.vertical, 4)
    }
}

struct Suggestion: Identifiable {
    let id = UUID()
    let emoji: String
    let name: String

    static var all: [Suggestion] {
        [
            Suggestion(emoji: "🪥", name: String(localized: "Changed toothbrush")),
            Suggestion(emoji: "📞", name: String(localized: "Called Mom")),
            Suggestion(emoji: "🪴", name: String(localized: "Watered the plants")),
            Suggestion(emoji: "🛏️", name: String(localized: "Changed bed sheets")),
            Suggestion(emoji: "🚗", name: String(localized: "Car oil change")),
            Suggestion(emoji: "💈", name: String(localized: "Haircut")),
        ]
    }
}

struct EmptyStateView: View {
    let onPick: (Suggestion) -> Void

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                ContentUnavailableView(
                    "Nothing tracked yet",
                    systemImage: "clock.arrow.circlepath",
                    description: Text("Track the last time you did the little things.")
                )
                .frame(minHeight: 260)

                Text("Try one of these:")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                LazyVGrid(columns: [GridItem(.adaptive(minimum: 150), spacing: 12)], spacing: 12) {
                    ForEach(Suggestion.all) { suggestion in
                        Button {
                            onPick(suggestion)
                        } label: {
                            HStack {
                                Text(suggestion.emoji)
                                Text(suggestion.name)
                                    .lineLimit(1)
                                    .minimumScaleFactor(0.8)
                                Spacer(minLength: 0)
                            }
                            .padding(12)
                            .frame(maxWidth: .infinity)
                            .background(.quaternary, in: .rect(cornerRadius: 12))
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal)
            }
            .frame(maxWidth: 600)
            .frame(maxWidth: .infinity)
        }
    }
}

#Preview {
    ContentView()
        .modelContainer(for: Item.self, inMemory: true)
}
