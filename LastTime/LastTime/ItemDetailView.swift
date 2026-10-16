import SwiftUI
import SwiftData

struct ItemDetailView: View {
    let item: Item
    @State private var editing = false
    @State private var doneCount = 0

    var body: some View {
        let days = item.daysSince()
        List {
            Section {
                VStack(spacing: 12) {
                    Text(item.emoji)
                        .font(.system(size: 64))
                    Text(item.name)
                        .font(.title2.bold())
                        .multilineTextAlignment(.center)
                    DaysAgoText(days: days)
                        .font(.title3)
                        .foregroundStyle(item.isOverdue() ? Color.orange : Color.secondary)
                    Button {
                        Store.markDone(item)
                        doneCount += 1
                    } label: {
                        Label("I did it today", systemImage: "checkmark")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                    .padding(.top, 4)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
                .listRowBackground(Color.clear)
            }

            Section("Reminder") {
                if item.hasReminder {
                    Text("Every \(item.remindAfterDays) days")
                    if let next = item.nextReminderDate, next > .now {
                        Text("Next reminder: \(next, format: .dateTime.weekday(.wide).day().month(.wide))")
                            .foregroundStyle(.secondary)
                    }
                } else {
                    Text("No reminder")
                        .foregroundStyle(.secondary)
                }
            }

            Section("History") {
                if let average = item.averageGapDays {
                    Text("On average every \(average) days")
                        .foregroundStyle(.secondary)
                }
                ForEach(item.history, id: \.self) { date in
                    Text(date, format: .dateTime.weekday(.wide).day().month(.wide).year())
                }
            }
        }
        .frame(maxWidth: 700)
        .frame(maxWidth: .infinity)
        .navigationTitle(item.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    Button { editing = true } label: { Label("Edit", systemImage: "pencil") }
                    if item.history.count > 1 {
                        Button { Store.undoLastDone(item) } label: { Label("Undo last", systemImage: "arrow.uturn.backward") }
                    }
                } label: {
                    Label("Edit", systemImage: "ellipsis.circle")
                }
            }
        }
        .sheet(isPresented: $editing) {
            ItemEditor(mode: .edit(item))
        }
        .sensoryFeedback(.success, trigger: doneCount)
    }
}
