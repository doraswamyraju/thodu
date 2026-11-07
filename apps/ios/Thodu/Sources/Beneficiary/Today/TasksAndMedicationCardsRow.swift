import SwiftUI

public struct TasksAndMedicationCardsRow: View {
    public let completedTasksCount: Int
    public let totalTasksCount: Int
    public let dueMedicationsCount: Int
    public let onDailyTasksClick: () -> Void
    public let onMedicationClick: () -> Void

    public init(
        completedTasksCount: Int = 3,
        totalTasksCount: Int = 5,
        dueMedicationsCount: Int = 2,
        onDailyTasksClick: @escaping () -> Void = {},
        onMedicationClick: @escaping () -> Void = {}
    ) {
        self.completedTasksCount = completedTasksCount
        self.totalTasksCount = totalTasksCount
        self.dueMedicationsCount = dueMedicationsCount
        self.onDailyTasksClick = onDailyTasksClick
        self.onMedicationClick = onMedicationClick
    }

    public var body: some View {
        HStack(spacing: 10) {
            // Left Card: Daily Tasks
            Button(action: onDailyTasksClick) {
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        HStack(spacing: 8) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color(hex: "FEF3C7"))
                                    .frame(width: 32, height: 32)
                                Image(systemName: "checklist")
                                    .font(.system(size: 16))
                                    .foregroundColor(Color(hex: "D97706"))
                            }

                            VStack(alignment: .leading, spacing: 1) {
                                Text("Daily Tasks")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(Color(hex: "1E293B"))
                                Text("\(completedTasksCount) of \(totalTasksCount) Completed")
                                    .font(.system(size: 10))
                                    .foregroundColor(Color(hex: "64748B"))
                            }
                        }

                        Spacer()

                        Image(systemName: "chevron.right")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }

                    // Green Progress Bar
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 3)
                                .fill(Color(hex: "E2E8F0"))
                                .frame(height: 6)

                            RoundedRectangle(cornerRadius: 3)
                                .fill(Color(hex: "16A34A"))
                                .frame(width: geo.size.width * CGFloat(completedTasksCount) / CGFloat(max(1, totalTasksCount)), height: 6)
                        }
                    }
                    .frame(height: 6)
                }
                .padding(12)
                .background(Color(hex: "FFFBEB"))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "FDE68A"), lineWidth: 1))
                .cornerRadius(16)
                .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
            }
            .buttonStyle(PlainButtonStyle())

            // Right Card: Medication Notification
            Button(action: onMedicationClick) {
                HStack {
                    HStack(spacing: 8) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 8)
                                .fill(Color(hex: "FFE4E6"))
                                .frame(width: 32, height: 32)
                            Image(systemName: "pills.fill")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "E11D48"))
                        }

                        VStack(alignment: .leading, spacing: 1) {
                            Text("Medication")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hex: "1E293B"))
                            Text("Notification")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "1E293B"))
                            Text("\(dueMedicationsCount) Medications Due")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "E11D48"))
                                .padding(.top, 1)
                        }
                    }

                    Spacer()

                    Image(systemName: "chevron.right")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "94A3B8"))
                }
                .padding(12)
                .frame(maxHeight: .infinity)
                .background(Color(hex: "FFF1F2"))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "FECDD3"), lineWidth: 1))
                .cornerRadius(16)
                .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
            }
            .buttonStyle(PlainButtonStyle())
        }
        .frame(height: 78)
    }
}
