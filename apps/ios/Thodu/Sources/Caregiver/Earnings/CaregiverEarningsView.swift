import SwiftUI

public struct CaregiverEarningsView: View {
    public let caregiver: Caregiver
    public let completedVisitsCount: Int
    
    private var baseSalary: Int { caregiver.monthlySalaryInr ?? 22000 }
    private var shiftIncentive: Int { completedVisitsCount * 150 }
    private var totalPayable: Int { baseSalary + shiftIncentive }
    
    @State private var selectedSlip: SalarySlipItem? = nil
    
    private let slips: [SalarySlipItem] = [
        SalarySlipItem(month: "October 2026", amount: "₹23,500", status: "Disbursed", date: "01 Nov 2026", accountMasked: "HDFC Bank •••• 4519"),
        SalarySlipItem(month: "September 2026", amount: "₹22,800", status: "Disbursed", date: "01 Oct 2026", accountMasked: "HDFC Bank •••• 4519"),
        SalarySlipItem(month: "August 2026", amount: "₹22,000", status: "Disbursed", date: "01 Sep 2026", accountMasked: "HDFC Bank •••• 4519")
    ]
    
    public init(caregiver: Caregiver, completedVisitsCount: Int) {
        self.caregiver = caregiver
        self.completedVisitsCount = completedVisitsCount
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 20) {
                // 1. MONTHLY SALARY SUMMARY CARD
                VStack(alignment: .leading, spacing: 14) {
                    HStack {
                        Text("● REGULAR STAFF PAYROLL")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "166534"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color(hex: "DCFCE7"))
                            .cornerRadius(10)
                        
                        Spacer()
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Current Month Compensation")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "1B382B"))
                        Text("Pay Period: November 1 - 30, 2026 • Bank Transfer on 1st")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "688273"))
                    }
                    
                    Divider()
                    
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("NET ESTIMATED SALARY")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "688273"))
                            Text("₹\(totalPayable)")
                                .font(.system(size: 28, weight: .black))
                                .foregroundColor(Color(hex: "0B5D3B"))
                        }
                        
                        Spacer()
                        
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("DISBURSEMENT")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "688273"))
                            Text("Direct Bank NEFT")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "1B382B"))
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
                
                // 2. BREAKDOWN TILES
                VStack(spacing: 12) {
                    salaryTile(
                        title: "Base Staff Pay",
                        amount: "₹\(baseSalary)",
                        subtitle: "Guaranteed Monthly Salary",
                        icon: "briefcase.fill",
                        color: "0B5D3B"
                    )
                    
                    salaryTile(
                        title: "Shift Performance Bonus",
                        amount: "+ ₹\(shiftIncentive)",
                        subtitle: "\(completedVisitsCount) completed care visits this cycle",
                        icon: "star.fill",
                        color: "16A34A"
                    )
                    
                    salaryTile(
                        title: "PF & ESIC Insurance",
                        amount: "Covered (100%)",
                        subtitle: "Health & Accidental Protection Active",
                        icon: "shield.checkerboard",
                        color: "0284C7"
                    )
                }
                
                // 3. OFFICIAL SALARY SLIPS
                VStack(alignment: .leading, spacing: 14) {
                    Text("Official Salary Slips")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "1B382B"))
                    
                    VStack(spacing: 10) {
                        ForEach(slips) { slip in
                            Button(action: {
                                selectedSlip = slip
                            }) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 3) {
                                        Text("Payslip — \(slip.month)")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(Color(hex: "1B382B"))
                                        Text("Disbursed on \(slip.date) • \(slip.accountMasked)")
                                            .font(.system(size: 11))
                                            .foregroundColor(Color(hex: "688273"))
                                    }
                                    
                                    Spacer()
                                    
                                    HStack(spacing: 8) {
                                        Text(slip.amount)
                                            .font(.system(size: 15, weight: .black))
                                            .foregroundColor(Color(hex: "0B5D3B"))
                                        Image(systemName: "arrow.down.doc.fill")
                                            .font(.system(size: 13))
                                            .foregroundColor(Color(hex: "0B5D3B"))
                                    }
                                }
                                .padding(14)
                                .background(Color(hex: "F8FAF9"))
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
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
            .padding(16)
            .padding(.bottom, 60)
        }
        .background(Color(hex: "F8FAF9").ignoresSafeArea())
        .sheet(item: $selectedSlip) { slip in
            payslipModal(slip: slip)
        }
    }
    
    private func salaryTile(title: String, amount: String, subtitle: String, icon: String, color: String) -> some View {
        HStack(spacing: 14) {
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: color).opacity(0.12))
                    .frame(width: 44, height: 44)
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: color))
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "64748B"))
                Text(amount)
                    .font(.system(size: 18, weight: .black))
                    .foregroundColor(Color(hex: "1B382B"))
                Text(subtitle)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "688273"))
            }
            
            Spacer()
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    private func payslipModal(slip: SalarySlipItem) -> some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "16A34A"))
                    .padding(.top, 10)
                
                Text("Salary Slip Verified")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "1B382B"))
                
                VStack(spacing: 12) {
                    HStack {
                        Text("Pay Period")
                            .foregroundColor(Color(hex: "64748B"))
                        Spacer()
                        Text(slip.month)
                            .fontWeight(.bold)
                    }
                    HStack {
                        Text("Disbursed Amount")
                            .foregroundColor(Color(hex: "64748B"))
                        Spacer()
                        Text(slip.amount)
                            .fontWeight(.black)
                            .foregroundColor(Color(hex: "0B5D3B"))
                    }
                    HStack {
                        Text("Transfer Mode")
                            .foregroundColor(Color(hex: "64748B"))
                        Spacer()
                        Text("NEFT / Direct Deposit")
                            .fontWeight(.medium)
                    }
                    HStack {
                        Text("Beneficiary Account")
                            .foregroundColor(Color(hex: "64748B"))
                        Spacer()
                        Text(slip.accountMasked)
                            .fontWeight(.medium)
                    }
                    HStack {
                        Text("Status")
                            .foregroundColor(Color(hex: "64748B"))
                        Spacer()
                        Text(slip.status)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "166534"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color(hex: "DCFCE7"))
                            .cornerRadius(8)
                    }
                }
                .font(.system(size: 14))
                .padding(18)
                .background(Color(hex: "F8FAF9"))
                .cornerRadius(14)
                
                Spacer()
                
                Button(action: {
                    selectedSlip = nil
                }) {
                    Text("Close")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color(hex: "0B5D3B"))
                        .cornerRadius(12)
                }
            }
            .padding(20)
            .navigationTitle("Payslip Details")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
