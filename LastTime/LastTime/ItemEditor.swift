import SwiftUI
import SwiftData

struct ItemEditor: View {
    enum Mode {
        case add(name: String, emoji: String)
        case edit(Item)
    }

    let mode: Mode

    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var context
    @State private var name = ""
    @State private var emoji = "✅"
    @State private var lastDone = Date.now
    @State private var remindAfterDays = 0
    @FocusState private var nameFocused: Bool

    private static let reminderOptions = [0, 1, 2, 3, 7, 14, 30, 60, 90, 180, 365]
    private static let emojiChoices = [
        "✅", "🪥", "📞", "🪴", "🛏️", "🚗", "💈", "💊",
        "🧹", "🐶", "💧", "🏃", "📚", "🧺", "🦷", "❤️",
    ]

    private var isAdding: Bool {
        if case .add = mode { return true }
        return false
    }

    private var trimmedName: String {
        name.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Name") {
                    TextField("What do you want to track?", text: $name)
                        .focused($nameFocused)
                        .submitLabel(.done)
                }

                Section("Icon") {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 44), spacing: 8)], spacing: 8) {
                        ForEach(Self.emojiChoices, id: \.self) { choice in
                            Button {
                                emoji = choice
                            } label: {
                                Text(choice)
                                    .font(.title2)
                                    .frame(width: 44, height: 44)
                                    .background(
                                        emoji == choice ? AnyShapeStyle(Color.accentColor.opacity(0.25)) : AnyShapeStyle(.quaternary),
                                        in: .circle
                                    )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.vertical, 4)
                    TextField("Or type any emoji", text: $emoji)
                        .onChange(of: emoji) { _, newValue in
                            // Keep a single character (an emoji is one character in Swift).
                            if newValue.count > 1, let last = newValue.last {
                                emoji = String(last)
                            }
                        }
                }

                if isAdding {
                    Section {
                        DatePicker("Last done", selection: $lastDone, in: ...Date.now, displayedComponents: .date)
                    }
                }

                Section {
                    Picker("Remind me", selection: $remindAfterDays) {
                        ForEach(Self.reminderOptions, id: \.self) { days in
                            if days == 0 {
                                Text("Off").tag(days)
                            } else {
                                Text("Every \(days) days").tag(days)
                            }
                        }
                    }
                } footer: {
                    Text("You'll get a notification when it's been this long.")
                }
            }
            .navigationTitle(isAdding ? Text("New Item") : Text("Edit Item"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                        .disabled(trimmedName.isEmpty)
                }
            }
            .onAppear(perform: load)
        }
    }

    private func load() {
        switch mode {
        case let .add(suggestedName, suggestedEmoji):
            name = suggestedName
            emoji = suggestedEmoji
            nameFocused = suggestedName.isEmpty
        case let .edit(item):
            name = item.name
            emoji = item.emoji
            remindAfterDays = item.remindAfterDays
        }
    }

    private func save() {
        let finalEmoji = emoji.isEmpty ? "✅" : emoji
        let item: Item
        switch mode {
        case .add:
            item = Item(name: trimmedName, emoji: finalEmoji, lastDone: lastDone, remindAfterDays: remindAfterDays)
            context.insert(item)
        case let .edit(existing):
            item = existing
            item.name = trimmedName
            item.emoji = finalEmoji
            item.remindAfterDays = remindAfterDays
        }
        Store.commit(item)

        if item.hasReminder {
            Task {
                if await Reminders.requestPermission() {
                    Reminders.schedule(for: item)
                }
            }
        } else {
            Reminders.cancel(for: item)
        }
        dismiss()
    }
}
