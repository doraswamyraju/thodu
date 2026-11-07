import SwiftUI
import CoreLocation

public struct CaregiverNavigationDrawer: View {
    public let caregiver: Caregiver
    public let activeTab: CaregiverNavTab
    public let hasActiveShift: Bool
    public let todaysCount: Int
    public let completedCount: Int
    public var onSelectTab: (CaregiverNavTab) -> Void
    public var onSwitchRole: () -> Void
    public var onLogout: () -> Void
    public var onClose: () -> Void
    
    @ObservedObject private var locationManager = CaregiverLocationManager.shared
    
    public init(
        caregiver: Caregiver,
        activeTab: CaregiverNavTab,
        hasActiveShift: Bool,
        todaysCount: Int,
        completedCount: Int,
        onSelectTab: @escaping (CaregiverNavTab) -> Void,
        onSwitchRole: @escaping () -> Void,
        onLogout: @escaping () -> Void,
        onClose: @escaping () -> Void
    ) {
        self.caregiver = caregiver
        self.activeTab = activeTab
        self.hasActiveShift = hasActiveShift
        self.todaysCount = todaysCount
        self.completedCount = completedCount
        self.onSelectTab = onSelectTab
        self.onSwitchRole = onSwitchRole
        self.onLogout = onLogout
        self.onClose = onClose
    }
    
    public var body: some View {
        ZStack(alignment: .leading) {
            Color(hex: "073D26").ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 18) {
                // 1. BRAND HEADER & CLOSE
                HStack(alignment: .center, spacing: 8) {
                    Image("thodu_topbar_logo")
                        .resizable()
                        .scaledToFit()
                        .frame(height: 28)
                    
                    Spacer()
                    
                    Button(action: onClose) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(.white.opacity(0.7))
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 24)
                
                // 2. CAREGIVER STAFF PROFILE CARD
                VStack(alignment: .leading, spacing: 10) {
                    HStack(spacing: 12) {
                        if let uiImage = UIImage(named: "avatar_caregiver_anitha") {
                            Image(uiImage: uiImage)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 48, height: 48)
                                .clipShape(Circle())
                                .overlay(Circle().stroke(Color(hex: "22C55E"), lineWidth: 2))
                        } else {
                            Circle()
                                .fill(Color.white.opacity(0.15))
                                .frame(width: 48, height: 48)
                                .overlay(
                                    Text(String(caregiver.fullName.prefix(1)))
                                        .font(.system(size: 20, weight: .bold))
                                        .foregroundColor(.white)
                                )
                        }
                        
                        VStack(alignment: .leading, spacing: 3) {
                            Text(caregiver.fullName)
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                            
                            HStack(spacing: 6) {
                                Text(caregiver.refNumber)
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(Color(hex: "A7F3D0"))
                                
                                Text("•")
                                    .foregroundColor(.white.opacity(0.4))
                                
                                HStack(spacing: 3) {
                                    Image(systemName: "star.fill")
                                        .font(.system(size: 9))
                                        .foregroundColor(Color(hex: "FDE047"))
                                    Text(String(format: "%.1f", caregiver.rating))
                                        .font(.system(size: 11, weight: .bold))
                                        .foregroundColor(.white)
                                }
                            }
                        }
                        
                        Spacer()
                    }
                    
                    // Live GPS Status Pill
                    HStack(spacing: 6) {
                        Circle()
                            .fill(locationManager.authorizationStatus == .authorizedWhenInUse || locationManager.authorizationStatus == .authorizedAlways ? Color(hex: "22C55E") : Color(hex: "F59E0B"))
                            .frame(width: 7, height: 7)
                        
                        Text(locationManager.authorizationStatus == .authorizedWhenInUse || locationManager.authorizationStatus == .authorizedAlways ? "GPS Active • Transmitting Location" : "GPS Inactive • Tap to Enable")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(Color.white.opacity(0.1))
                    .cornerRadius(8)
                    .onTapGesture {
                        locationManager.requestPermission()
                    }
                    
                    // Shift quick counters
                    HStack(spacing: 10) {
                        counterPill(title: "TODAY", count: "\(todaysCount)")
                        counterPill(title: "DONE", count: "\(completedCount)")
                        counterPill(title: "STATUS", count: caregiver.availability)
                    }
                }
                .padding(14)
                .background(Color.white.opacity(0.08))
                .cornerRadius(14)
                .padding(.horizontal, 16)
                
                // 3. NAVIGATION MENU ITEMS
                VStack(spacing: 6) {
                    ForEach(CaregiverNavTab.allCases) { tab in
                        let isSelected = activeTab == tab
                        Button(action: {
                            onSelectTab(tab)
                            onClose()
                        }) {
                            HStack(spacing: 12) {
                                Image(systemName: tab.iconName)
                                    .font(.system(size: 16, weight: isSelected ? .bold : .medium))
                                    .foregroundColor(isSelected ? Color(hex: "FDE047") : .white.opacity(0.85))
                                    .frame(width: 24)
                                
                                Text(tab.rawValue)
                                    .font(.system(size: 14, weight: isSelected ? .bold : .medium))
                                    .foregroundColor(isSelected ? Color(hex: "FDE047") : .white)
                                
                                Spacer()
                                
                                if tab == .duty && hasActiveShift {
                                    Text("LIVE")
                                        .font(.system(size: 9, weight: .black))
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(Color(hex: "16A34A"))
                                        .cornerRadius(4)
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 11)
                            .background(isSelected ? Color.white.opacity(0.12) : Color.clear)
                            .cornerRadius(10)
                        }
                        .padding(.horizontal, 12)
                    }
                }
                
                Spacer()
                
                // 4. EMERGENCY DISPATCH HELP
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 6) {
                        Image(systemName: "phone.badge.waveform.fill")
                            .foregroundColor(Color(hex: "FDE047"))
                        Text("24/7 Operations Command Desk")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.white)
                    }
                    if let url = URL(string: "tel://+919876500001") {
                        Link(destination: url) {
                            Text("Direct Line: +91 98765 00001")
                                .font(.system(size: 12, weight: .heavy))
                                .foregroundColor(Color(hex: "FDE047"))
                        }
                    }
                }
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.white.opacity(0.08))
                .cornerRadius(12)
                .padding(.horizontal, 16)
                
                // 5. SWITCH PORTAL & SIGN OUT
                VStack(spacing: 4) {
                    Button(action: {
                        onClose()
                        onSwitchRole()
                    }) {
                        HStack(spacing: 10) {
                            Image(systemName: "arrow.triangle.2.circlepath")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "A7F3D0"))
                            Text("Switch to Family Portal")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hex: "A7F3D0"))
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.system(size: 10))
                                .foregroundColor(Color(hex: "A7F3D0").opacity(0.6))
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                    }
                    .padding(.horizontal, 12)
                    
                    Button(action: {
                        onClose()
                        onLogout()
                    }) {
                        HStack(spacing: 10) {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "F87171"))
                            Text("Sign Out")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hex: "F87171"))
                            Spacer()
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                    }
                    .padding(.horizontal, 12)
                }
                .padding(.bottom, 24)
            }
        }
        .frame(width: 290)
    }
    
    private func counterPill(title: String, count: String) -> some View {
        VStack(spacing: 2) {
            Text(title)
                .font(.system(size: 8, weight: .bold))
                .foregroundColor(.white.opacity(0.6))
            Text(count)
                .font(.system(size: 12, weight: .black))
                .foregroundColor(.white)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 4)
        .background(Color.white.opacity(0.08))
        .cornerRadius(6)
    }
}

