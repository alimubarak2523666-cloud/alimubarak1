import Foundation
import SwiftData

/// One database shared by the app and its widget through an App Group.
enum SharedStore {
    static let appGroupID = "group.com.alimubarak1.lasttime"

    static let shared: ModelContainer = makeContainer()

    private static func makeContainer() -> ModelContainer {
        let schema = Schema([Item.self])
        let configuration: ModelConfiguration
        if FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupID) != nil {
            configuration = ModelConfiguration(schema: schema, groupContainer: .identifier(appGroupID), cloudKitDatabase: .none)
        } else {
            // App Group not provisioned yet (no signing team): keep data inside the app.
            configuration = ModelConfiguration(schema: schema, groupContainer: .none, cloudKitDatabase: .none)
        }
        do {
            return try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            fatalError("Could not open the Last Time database: \(error)")
        }
    }
}
