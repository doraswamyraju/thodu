import SwiftUI

public struct CaregiverProfileView: View {
    public let caregiver: Caregiver
    public var onSwitchRole: () -> Void
    public var onLogout: () -> Void
    
    public init(caregiver: Caregiver, onSwitchRole: @escaping () -> Void, onLogout: @escaping () -> Void) {
        self.caregiver = caregiver
        self.onSwitchRole = onSwitchRole
        self.onLogout = onLogout
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 20) {
                // 1. IDENTITY & CREDENTIALS CARD
                VStack(spacing: 16) {
                    HStack(spacing: 16) {
                        if let uiImage = UIImage(named: "avatar_caregiver_anitha") {
                            Image(uiImage: uiImage)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 68, height: 68)
                                .clipShape(Circle())
                                .overlay(Circle().stroke(Color(hex: "16A34A"), lineWidth: 2))
                        } else {
                            Circle()
                                .fill(Color(hex: "DCFCE7"))
                                .frame(width: 68, height: 68)
                                .overlay(
                                    Text(String(caregiver.fullName.prefix(1)))
                                        .font(.system(size: 26, weight: .black))
                                        .foregroundColor(Color(hex: "0B5D3B"))
                                )
                        }
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text(caregiver.fullName)
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(Color(hex: "1B382B"))
                            
                            Text("Staff Ref: \(caregiver.refNumber) • \(caregiver.employmentType)")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(Color(hex: "166534"))
                            
                            HStack(spacing: 4) {
                                Image(systemName: "star.fill")
                                    .font(.system(size: 11))
                                    .foregroundColor(Color(hex: "F59E0B"))
                                Text(String(format: "%.1f", caregiver.rating))
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: "1B382B"))
                                Text("(\(caregiver.ratingReviewsCount) Reviews)")
                                    .font(.system(size: 11))
                                    .foregroundColor(Color(hex: "688273"))
                            }
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color(hex: "FEF3C7"))
                            .cornerRadius(10)
                        }
                        
                        Spacer()
                    }
                    
                    Divider()
                    
                    // Zone & Experience Row
                    HStack(spacing: 12) {
                        statBox(title: "SERVICE ZONE", value: caregiver.zone)
                        statBox(title: "EXPERIENCE", value: "\(caregiver.experienceYears ?? 5) Years")
                    }
                    
                    // Skills pills
                    VStack(alignment: .leading, spacing: 8) {
                        Text("CERTIFIED CARE SKILLS")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "688273"))
                        
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 140))], spacing: 8) {
                            ForEach(caregiver.skills, id: \.self) { skill in
                                Text(skill)
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(Color(hex: "1E293B"))
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
                
                // 2. STATUTORY VERIFICATIONS
                VStack(alignment: .leading, spacing: 14) {
                    HStack(spacing: 6) {
                        Image(systemName: "shield.checkmark.fill")
                            .foregroundColor(Color(hex: "0B5D3B"))
                            .font(.system(size: 16))
                        Text("Statutory & Police Verifications")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(Color(hex: "1B382B"))
                    }
                    
                    VStack(spacing: 10) {
                        verificationRow(title: "Aadhaar Identity Verification", subtitle: caregiver.aadhaarNumber ?? "XXXX-XXXX-4589", isVerified: true)
                        verificationRow(title: "Police Clearance Certificate", subtitle: "Clearance by Tirupati SP Office", isVerified: true)
                        verificationRow(title: "Medical Fitness Certificate", subtitle: "Valid for 2026-2027", isVerified: true)
                        verificationRow(title: "Thodu Geriatric Care Certification", subtitle: "Credential Level: Specialist Attendant", isVerified: true)
                    }
                }
                .padding(20)
                .background(Color.white)
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
                )
                
                // 3. CONTACT & SUPERVISOR SUPPORT
                VStack(alignment: .leading, spacing: 14) {
                    Text("Operations & Dispatch Helpline")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "1B382B"))
                    
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Thodu Dispatch Coordinator")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hex: "1B382B"))
                            Text("24/7 Priority Attendant Desk")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "688273"))
                        }
                        
                        Spacer()
                        
                        if let url = URL(string: "tel://+919876500001") {
                            Link(destination: url) {
                                HStack(spacing: 4) {
                                    Image(systemName: "phone.fill")
                                    Text("Call Desk")
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
                .padding(20)
                .background(Color.white)
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
                )
                
                // 4. ROLE SWITCH / LOGOUT
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
                            Text("Sign Out")
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
            .padding(16)
            .padding(.bottom, 60)
        }
        .background(Color(hex: "F8FAF9").ignoresSafeArea())
    }
    
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
    
    private func verificationRow(title: String, subtitle: String, isVerified: Bool) -> some View {
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
