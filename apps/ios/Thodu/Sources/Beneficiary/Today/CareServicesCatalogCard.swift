import SwiftUI

public struct ServiceVisualItem: Identifiable {
    public let id: String
    public let title: String
    public let iconName: String
    public let bgColor: Color
    public let tintColor: Color

    public init(id: String, title: String, iconName: String, bgColor: Color, tintColor: Color) {
        self.id = id
        self.title = title
        self.iconName = iconName
        self.bgColor = bgColor
        self.tintColor = tintColor
    }
}

public struct CareServicesCatalogCard: View {
    public let services: [CareService]
    public let onSelectServiceToBook: (CareService?) -> Void

    public init(
        services: [CareService],
        onSelectServiceToBook: @escaping (CareService?) -> Void
    ) {
        self.services = services
        self.onSelectServiceToBook = onSelectServiceToBook
    }

    private let defaultServices = [
        ServiceVisualItem(id: "srv-1", title: "Personal Care", iconName: "figure.walk", bgColor: Color(hex: "E8F5E9"), tintColor: Color(hex: "16A34A")),
        ServiceVisualItem(id: "srv-2", title: "Health Monitor", iconName: "heart.fill", bgColor: Color(hex: "FFEBEE"), tintColor: Color(hex: "E11D48")),
        ServiceVisualItem(id: "srv-3", title: "Medication Help", iconName: "pills.fill", bgColor: Color(hex: "FEE2E2"), tintColor: Color(hex: "EF4444")),
        ServiceVisualItem(id: "srv-4", title: "Meals & Nutrition", iconName: "fork.knife", bgColor: Color(hex: "FEF3C7"), tintColor: Color(hex: "D97706")),
        ServiceVisualItem(id: "srv-5", title: "Physio Support", iconName: "figure.cross.training", bgColor: Color(hex: "F3E8FF"), tintColor: Color(hex: "9333EA")),
        ServiceVisualItem(id: "srv-6", title: "Doctor Consult", iconName: "stethoscope", bgColor: Color(hex: "E0F2FE"), tintColor: Color(hex: "0284C7")),
        ServiceVisualItem(id: "srv-7", title: "Lab Samples", iconName: "testtube.2", bgColor: Color(hex: "EDE9FE"), tintColor: Color(hex: "7C3AED")),
        ServiceVisualItem(id: "srv-8", title: "More Services", iconName: "ellipsis", bgColor: Color(hex: "E0F7FA"), tintColor: Color(hex: "00897B"))
    ]

    private var displayItems: [ServiceVisualItem] {
        if !services.isEmpty {
            let active = services.filter { $0.isActive }
            if !active.isEmpty {
                return active.prefix(8).enumerated().map { idx, srv in
                    let fallback = defaultServices[safe: idx] ?? defaultServices[0]
                    let (icon, bgCol, tintCol) = mapNameToVisual(srv.name, fallback: fallback)
                    let words = srv.name.split(separator: " ").prefix(2).joined(separator: " ")
                    return ServiceVisualItem(id: srv.id, title: words, iconName: icon, bgColor: bgCol, tintColor: tintCol)
                }
            }
        }
        return defaultServices
    }

    public var body: some View {
        VStack(spacing: 12) {
            // Section Header
            HStack {
                Text("Our Services")
                    .font(.system(size: 17, weight: .bold))
                    .foregroundColor(Color(hex: "143627"))

                Spacer()

                Button(action: { onSelectServiceToBook(nil) }) {
                    HStack(spacing: 3) {
                        Text("Book a Service")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "0D5C3A"))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "0D5C3A"))
                    }
                    .padding(4)
                }
            }

            // Grid of 8 Services (2 rows of 4)
            let columns = [
                GridItem(.flexible(), spacing: 8),
                GridItem(.flexible(), spacing: 8),
                GridItem(.flexible(), spacing: 8),
                GridItem(.flexible(), spacing: 8)
            ]

            LazyVGrid(columns: columns, spacing: 8) {
                ForEach(displayItems) { item in
                    Button(action: {
                        let match = services.first { $0.id == item.id || $0.name.localizedCaseInsensitiveContains(item.title) }
                        onSelectServiceToBook(match)
                    }) {
                        VStack(spacing: 6) {
                            ZStack {
                                Circle()
                                    .fill(item.tintColor.opacity(0.15))
                                    .frame(width: 36, height: 36)
                                Image(systemName: item.iconName)
                                    .font(.system(size: 17))
                                    .foregroundColor(item.tintColor)
                            }

                            Text(item.title)
                                .font(.system(size: 10.5, weight: .bold))
                                .foregroundColor(Color(hex: "1F2937"))
                                .multilineTextAlignment(.center)
                                .lineLimit(2)
                                .minimumScaleFactor(0.8)
                                .frame(height: 28)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .padding(.horizontal, 4)
                        .background(item.bgColor)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.white, lineWidth: 1)
                        )
                        .cornerRadius(16)
                        .shadow(color: Color.black.opacity(0.04), radius: 2, x: 0, y: 1)
                    }
                }
            }
        }
    }

    private func mapNameToVisual(_ name: String, fallback: ServiceVisualItem) -> (String, Color, Color) {
        let n = name.lowercased()
        if n.contains("household") || n.contains("meal") || n.contains("cooking") {
            return ("fork.knife", Color(hex: "FEF3C7"), Color(hex: "D97706"))
        } else if n.contains("bedside") || n.contains("mobility") || n.contains("wheelchair") {
            return ("figure.walk", Color(hex: "E8F5E9"), Color(hex: "16A34A"))
        } else if n.contains("medication") || n.contains("vitals") {
            return ("pills.fill", Color(hex: "FEE2E2"), Color(hex: "EF4444"))
        } else if n.contains("companion") || n.contains("walking") {
            return ("figure.walk.motion", Color(hex: "F0FDF4"), Color(hex: "047857"))
        } else if n.contains("physio") || n.contains("rehab") {
            return ("figure.cross.training", Color(hex: "F3E8FF"), Color(hex: "9333EA"))
        } else if n.contains("live-in") || n.contains("critical") {
            return ("heart.fill", Color(hex: "FFEBEE"), Color(hex: "E11D48"))
        } else if n.contains("palliative") || n.contains("nursing") {
            return ("cross.case.fill", Color(hex: "E0F2FE"), Color(hex: "0284C7"))
        } else {
            return (fallback.iconName, fallback.bgColor, fallback.tintColor)
        }
    }
}

extension Collection {
    subscript(safe index: Index) -> Element? {
        return indices.contains(index) ? self[index] : nil
    }
}

