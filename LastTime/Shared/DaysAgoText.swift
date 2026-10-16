import SwiftUI

/// "Today", "Yesterday" or "12 days ago", translated with correct plurals.
struct DaysAgoText: View {
    let days: Int

    var body: some View {
        switch days {
        case 0: Text("Today")
        case 1: Text("Yesterday")
        default: Text("\(days) days ago")
        }
    }
}
