import SwiftUI
import SwiftData

@main
struct LastTimeApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
        }
    }
}

/// Gives the screens a fresh database context each time the app comes back,
/// so taps made on the widget while the app was in the background show up.
struct RootView: View {
    @Environment(\.scenePhase) private var scenePhase
    @State private var context = ModelContext(SharedStore.shared)

    var body: some View {
        ContentView()
            .environment(\.modelContext, context)
            .onChange(of: scenePhase) { oldPhase, newPhase in
                if newPhase == .active && oldPhase == .background {
                    context = ModelContext(SharedStore.shared)
                }
            }
    }
}
