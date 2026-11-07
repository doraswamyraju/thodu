import SwiftUI

public struct CaregiverBottomNavBar: View {
    @Binding public var activeTab: CaregiverNavTab
    public var hasActiveShift: Bool
    
    public init(activeTab: Binding<CaregiverNavTab>, hasActiveShift: Bool = false) {
        self._activeTab = activeTab
        self.hasActiveShift = hasActiveShift
    }
    
    public var body: some View {
        HStack(spacing: 0) {
            ForEach(CaregiverNavTab.allCases) { tab in
                Button(action: {
                    activeTab = tab
                }) {
                    VStack(spacing: 4) {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: tab.iconName)
                                .font(.system(size: 19, weight: activeTab == tab ? .bold : .regular))
                                .foregroundColor(activeTab == tab ? Color(hex: "0B5D3B") : Color(hex: "64748B"))
                                .frame(height: 24)
                            
                            // Live indicator for active duty tab
                            if tab == .duty && hasActiveShift {
                                Circle()
                                    .fill(Color(hex: "16A34A"))
                                    .frame(width: 8, height: 8)
                                    .offset(x: 4, y: -2)
                            }
                        }
                        
                        Text(tab.rawValue)
                            .font(.system(size: 10, weight: activeTab == tab ? .bold : .medium))
                            .foregroundColor(activeTab == tab ? Color(hex: "0B5D3B") : Color(hex: "64748B"))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .padding(.horizontal, 4)
        .padding(.bottom, 12)
        .background(
            Color.white
                .shadow(color: Color.black.opacity(0.06), radius: 10, x: 0, y: -3)
        )
    }
}

