import SwiftUI
import CoreLocation

public struct CaregiverProfileView: View {
    public let caregiver: Caregiver
    public var onSwitchRole: () -> Void
    public var onLogout: () -> Void
    
    @ObservedObject private var locationManager = CaregiverLocationManager.shared
    
    // Editable settings state
    @State private var phoneText: String
    @State private var alternatePhoneText: String = "+91 98765 11111"
    @State private var emailText: String
    @State private var addressText: String
    @State private var bankName: String = "HDFC Bank (Tirupati Branch)"
    @State private var accountNumber: String = "•••• •••• •••• 4519"
    @State private var ifscCode: String = "HDFC0001824"
    @State private var upiId: String = "anitha.care@okhdfcbank"
    @State private var highAccuracyGps: Bool = true
    @State private var dispatchNotifications: Bool = true
    @State private var emergencyAudibleAlerts: Bool = true
    @State private var isEditingPersonal: Bool = false
    @State private var showSavedAlert: Bool = false
    
    public init(caregiver: Caregiver, onSwitchRole: @escaping () -> Void, onLogout: @escaping () -> Void) {
        self.caregiver = caregiver
        self.onSwitchRole = onSwitchRole
        self.onLogout = onLogout
        self._phoneText = State(initialValue: caregiver.phone)
        self._emailText = State(initialValue: caregiver.email ?? "anitha.care@example.com")
        self._addressText = State(initialValue: caregiver.address ?? "#12-4-56, T.T.D. Colony, Tirupati - 517501")
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 20) {
                // 1. IDENTITY & BADGES CARD
                identityHeaderCard
                
                // 2. LIVE LOCATION & DISPATCH GPS PERMISSION
                gpsSettingsCard
                
                // 3. PERSONAL & CONTACT INFORMATION
                personalInfoCard
                
                // 4. BANK & DIRECT PAYROLL ACCOUNT
                bankPayrollCard
                
                // 5. WORK & SHIFT PREFERENCES
                workPreferencesCard
                
                // 6. STATUTORY & POLICE VERIFICATIONS
                statutoryVerificationsCard
                
                // 7. APP & DISPATCH NOTIFICATION SETTINGS
                appSettingsCard
                
                // 8. 24/7 OPERATIONS HELPDESK
                operationsHelpdeskCard
                
                // 9. ROLE SWITCH & SIGN OUT
                roleSwitchAndLogoutSection
            }
            .padding(16)
            .padding(.bottom, 60)
        }
        .background(Color(hex: "F8FAF9").ignoresSafeArea())
        .alert("Settings Updated", isPresented: $showSavedAlert) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Your caregiver staff profile details and app preferences have been successfully updated.")
        }
    }
    
    // MARK: - Identity Header Card
    private var identityHeaderCard: some View {
        VStack(spacing: 16) {
            HStack(spacing: 16) {
                if let uiImage = UIImage(named: "avatar_caregiver_anitha") {
                    Image(uiImage: uiImage)
                        .resizable()
                        .scaledToFill()
                        .frame(width: 72, height: 72)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color(hex: "16A34A"), lineWidth: 3))
                } else {
                    Circle()
                        .fill(Color(hex: "DCFCE7"))
                        .frame(width: 72, height: 72)
                        .overlay(
                            Text(String(caregiver.fullName.prefix(1)))
                                .font(.system(size: 28, weight: .black))
                                .foregroundColor(Color(hex: "0B5D3B"))
                        )
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 6) {
                        Text(caregiver.fullName)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "1B382B"))
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "16A34A"))
                    }
                    
                    Text("Staff Ref: \(caregiver.refNumber) • \(caregiver.employmentType)")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(hex: "166534"))
                    
                    HStack(spacing: 6) {
                        HStack(spacing: 3) {
                            Image(systemName: "star.fill")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "F59E0B"))
                            Text(String(format: "%.1f", caregiver.rating))
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "1B382B"))
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Color(hex: "FEF3C7"))
                        .cornerRadius(8)
                        
                        Text("(\(caregiver.ratingReviewsCount) Beneficiary Reviews)")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "688273"))
                    }
                }
                
                Spacer()
            }
            
            Divider()
            
            // Zone & Experience Row
            HStack(spacing: 12) {
                statBox(title: "SERVICE ZONE", value: caregiver.zone)
                statBox(title: "EXPERIENCE", value: "\(caregiver.experienceYears ?? 6) Years")
                statBox(title: "SHIFTS TODAY", value: "3 Assigned")
            }
            
            // Certified Skills pills
            VStack(alignment: .leading, spacing: 8) {
                Text("CERTIFIED CLINICAL SKILLS")
                    .font(.system(size: 10, weight: .black))
                    .foregroundColor(Color(hex: "688273"))
                
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 140))], spacing: 8) {
                    ForEach(caregiver.skills, id: \.self) { skill in
                        HStack(spacing: 5) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "16A34A"))
                            Text(skill)
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(Color(hex: "1E293B"))
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(hex: "F1F5F9"))
                        .cornerRadius(8)
                    }
                }
            }
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    // MARK: - GPS Settings Card
    private var gpsSettingsCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                HStack(spacing: 6) {
                    Image(systemName: "location.fill")
                        .foregroundColor(Color(hex: "0284C7"))
                    Text("Live GPS & Location Transmission")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "1B382B"))
                }
                
                Spacer()
                
                let isAuthorized = locationManager.authorizationStatus == .authorizedWhenInUse || locationManager.authorizationStatus == .authorizedAlways
                Text(isAuthorized ? "Active" : "Disabled")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(Color(hex: isAuthorized ? "166534" : "991B1B"))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color(hex: isAuthorized ? "DCFCE7" : "FEE2E2"))
                    .cornerRadius(8)
            }
            
            Text("Continuous GPS coordinates are transmitted to family dashboards and operations dispatch when you are On Duty to calculate live ETAs and verify arrivals.")
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "64748B"))
                .lineSpacing(2)
            
            if locationManager.authorizationStatus != .authorizedWhenInUse && locationManager.authorizationStatus != .authorizedAlways {
                Button(action: {
                    locationManager.requestPermission()
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: "location.circle.fill")
                        Text("Grant Location Permission")
                            .font(.system(size: 13, weight: .bold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 40)
                    .background(Color(hex: "0284C7"))
                    .cornerRadius(10)
                }
            } else if let loc = locationManager.userLocation {
                HStack(spacing: 8) {
                    Circle()
                        .fill(Color(hex: "16A34A"))
                        .frame(width: 8, height: 8)
                    Text(String(format: "Current Fix: %.4f° N, %.4f° E (High Accuracy)", loc.latitude, loc.longitude))
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color(hex: "065F46"))
                }
                .padding(8)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(hex: "ECFDF5"))
                .cornerRadius(8)
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    // MARK: - Personal Information Card
    private var personalInfoCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Personal & Contact Details")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Color(hex: "1B382B"))
                
                Spacer()
                
                Button(action: {
                    if isEditingPersonal {
                        showSavedAlert = true
                    }
                    isEditingPersonal.toggle()
                }) {
                    Text(isEditingPersonal ? "Save Changes" : "Edit Details")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "0B5D3B"))
                }
            }
            
            VStack(spacing: 10) {
                editableRow(label: "Primary Mobile", value: $phoneText, icon: "phone.fill", isEditable: isEditingPersonal)
                editableRow(label: "Alternate Contact", value: $alternatePhoneText, icon: "phone.badge.plus", isEditable: isEditingPersonal)
                editableRow(label: "Email Address", value: $emailText, icon: "envelope.fill", isEditable: isEditingPersonal)
                editableRow(label: "Residence Address", value: $addressText, icon: "house.fill", isEditable: isEditingPersonal)
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    // MARK: - Bank & Direct Payroll Card
    private var bankPayrollCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                HStack(spacing: 6) {
                    Image(systemName: "indianrupeesign.circle.fill")
                        .foregroundColor(Color(hex: "0B5D3B"))
                    Text("Salary Disbursement & Bank Account")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "1B382B"))
                }
                
                Spacer()
                
                Text("Verified")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: "166534"))
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color(hex: "DCFCE7"))
                    .cornerRadius(6)
            }
            
            VStack(spacing: 8) {
                infoRow(label: "Bank Name", value: bankName)
                infoRow(label: "Account Number", value: accountNumber)
                infoRow(label: "IFSC Code", value: ifscCode)
                infoRow(label: "Primary UPI VPA", value: upiId)
                infoRow(label: "Guaranteed Base Salary", value: "₹22,000 / month")
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    // MARK: - Work Preferences Card
    private var workPreferencesCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Work & Shift Preferences")
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(Color(hex: "1B382B"))
            
            VStack(spacing: 8) {
                infoRow(label: "Assigned Shift", value: caregiver.workingShift ?? "Morning (08:00 AM - 02:00 PM)")
                infoRow(label: "Service Zone", value: caregiver.zone)
                infoRow(label: "Maximum Shifts/Day", value: "3 Care Visits")
                infoRow(label: "Languages Spoken", value: (caregiver.languages ?? ["Telugu", "English", "Hindi"]).joined(separator: ", "))
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    // MARK: - Statutory Verifications Card
    private var statutoryVerificationsCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 6) {
                Image(systemName: "shield.checkmark.fill")
                    .foregroundColor(Color(hex: "0B5D3B"))
                Text("Statutory & Police Verifications")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Color(hex: "1B382B"))
            }
            
            VStack(spacing: 10) {
                verificationRow(title: "Aadhaar Identity Verification", subtitle: caregiver.aadhaarNumber ?? "XXXX-XXXX-4589")
                verificationRow(title: "Police Clearance Certificate", subtitle: "Clearance by Tirupati SP Office")
                verificationRow(title: "Medical Fitness Certificate", subtitle: "Valid for 2026-2027")
                verificationRow(title: "Thodu Geriatric Certification", subtitle: "Level 3 Specialist Attendant")
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    // MARK: - App Settings Card
    private var appSettingsCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("App & Operational Settings")
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(Color(hex: "1B382B"))
            
            VStack(spacing: 12) {
                Toggle(isOn: $highAccuracyGps) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("High-Accuracy GPS Tracking")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(Color(hex: "1E293B"))
                        Text("Updates location every 10 meters on duty")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "64748B"))
                    }
                }
                .tint(Color(hex: "0B5D3B"))
                
                Divider()
                
                Toggle(isOn: $dispatchNotifications) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Instant Shift Dispatch Alerts")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(Color(hex: "1E293B"))
                        Text("Alerts when a new patient shift is assigned")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "64748B"))
                    }
                }
                .tint(Color(hex: "0B5D3B"))
                
                Divider()
                
                Toggle(isOn: $emergencyAudibleAlerts) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Emergency SOS Audible Alarms")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(Color(hex: "1E293B"))
                        Text("Play high-priority siren on elder emergency")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "64748B"))
                    }
                }
                .tint(Color(hex: "0B5D3B"))
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    // MARK: - Operations Helpdesk Card
    private var operationsHelpdeskCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Operations Command & Supervisor Desk")
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(Color(hex: "1B382B"))
            
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Tirupati Dispatch Coordinator")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "1B382B"))
                    Text("Direct Line: +91 98765 00001 • Available 24/7")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "688273"))
                }
                
                Spacer()
                
                if let url = URL(string: "tel://+919876500001") {
                    Link(destination: url) {
                        HStack(spacing: 4) {
                            Image(systemName: "phone.fill")
                            Text("Call")
                                .font(.system(size: 12, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Color(hex: "0B5D3B"))
                        .cornerRadius(8)
                    }
                }
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    // MARK: - Role Switch & Logout Section
    private var roleSwitchAndLogoutSection: some View {
        VStack(spacing: 12) {
            Button(action: onSwitchRole) {
                HStack(spacing: 6) {
                    Image(systemName: "arrow.triangle.2.circlepath")
                    Text("Switch to Family / Beneficiary Portal")
                        .font(.system(size: 14, weight: .bold))
                }
                .foregroundColor(Color(hex: "0B5D3B"))
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color(hex: "E8F5E9"))
                .cornerRadius(12)
            }
            
            Button(action: onLogout) {
                HStack(spacing: 6) {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                    Text("Sign Out of Staff Account")
                        .font(.system(size: 14, weight: .bold))
                }
                .foregroundColor(Color(hex: "DC2626"))
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color(hex: "FEE2E2"))
                .cornerRadius(12)
            }
        }
    }
    
    // MARK: - Helper Views
    private func statBox(title: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(title)
                .font(.system(size: 9, weight: .bold))
                .foregroundColor(Color(hex: "688273"))
            Text(value)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(Color(hex: "1B382B"))
        }
        .padding(10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(hex: "F8FAF9"))
        .cornerRadius(10)
    }
    
    private func editableRow(label: String, value: Binding<String>, icon: String, isEditable: Bool) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 5) {
                Image(systemName: icon)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "0B5D3B"))
                Text(label)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(Color(hex: "64748B"))
            }
            if isEditable {
                TextField(label, text: value)
                    .font(.system(size: 13, weight: .medium))
                    .padding(8)
                    .background(Color(hex: "F1F5F9"))
                    .cornerRadius(8)
            } else {
                Text(value.wrappedValue)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "1E293B"))
                    .padding(.vertical, 2)
            }
        }
        .padding(.vertical, 2)
    }
    
    private func infoRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "64748B"))
            Spacer()
            Text(value)
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(Color(hex: "1E293B"))
        }
        .padding(.vertical, 4)
    }
    
    private func verificationRow(title: String, subtitle: String) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(Color(hex: "1B382B"))
                Text(subtitle)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "688273"))
            }
            Spacer()
            HStack(spacing: 4) {
                Image(systemName: "checkmark")
                    .font(.system(size: 10, weight: .bold))
                Text("Verified")
                    .font(.system(size: 11, weight: .bold))
            }
            .foregroundColor(Color(hex: "166534"))
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(Color(hex: "DCFCE7"))
            .cornerRadius(6)
        }
        .padding(10)
        .background(Color(hex: "F8FAF9"))
        .cornerRadius(10)
    }
}
