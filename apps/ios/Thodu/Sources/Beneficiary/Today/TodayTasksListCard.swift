import SwiftUI

public struct TodayTasksListCard: View {
    public let onViewAllClick: () -> Void

    @State private var tasks: [TodayTaskItem] = [
        TodayTaskItem(title: "Morning Medication", scheduledTime: "8:00 AM", isCompleted: true),
        TodayTaskItem(title: "Blood Pressure Check", scheduledTime: "10:00 AM", isCompleted: true),
        TodayTaskItem(title: "Lunch & Hydration", scheduledTime: "1:00 PM", isCompleted: false),
        TodayTaskItem(title: "Evening Walk", scheduledTime: "5:00 PM", isCompleted: false),
        TodayTaskItem(title: "Night Medication", scheduledTime: "8:00 PM", isCompleted: false)
    ]

    public init(onViewAllClick: @escaping () -> Void = {}) {
        self.onViewAllClick = onViewAllClick
    }

    public var body: some View {
        VStack(spacing: 12) {
            // Header
            HStack {
                Text("Today's Tasks")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "0F172A"))

                Spacer()

                Button(action: onViewAllClick) {
                    HStack(spacing: 3) {
                        Text("View All")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "0D5C3A"))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "0D5C3A"))
                    }
                    .padding(4)
                }
            }

            // Task Rows
            VStack(spacing: 0) {
                ForEach(tasks.indices, id: \.self) { index in
                    HStack(spacing: 10) {
                        // Interactive Checkbox
                        Button(action: {
                            tasks[index].isCompleted.toggle()
                        }) {
                            Image(systemName: tasks[index].isCompleted ? "checkmark.circle.fill" : "circle")
                                .font(.system(size: 18))
                                .foregroundColor(tasks[index].isCompleted ? Color(hex: "16A34A") : Color(hex: "94A3B8"))
                        }
                        .buttonStyle(PlainButtonStyle())

                        // Task Title
                        Text(tasks[index].title)
                            .font(.system(size: 13, weight: tasks[index].isCompleted ? .semibold : .regular))
                            .foregroundColor(tasks[index].isCompleted ? Color(hex: "1E293B") : Color(hex: "334155"))
                            .strikethrough(tasks[index].isCompleted, color: Color(hex: "94A3B8"))

                        Spacer()

                        // Scheduled Time
                        Text(tasks[index].scheduledTime)
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "64748B"))

                        // Status Pill
                        Text(tasks[index].isCompleted ? "Completed" : "Pending")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(tasks[index].isCompleted ? Color(hex: "15803D") : Color(hex: "2563EB"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(tasks[index].isCompleted ? Color(hex: "DCFCE7") : Color(hex: "EFF6FF"))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(tasks[index].isCompleted ? Color(hex: "86EFAC") : Color(hex: "BFDBFE"), lineWidth: 1)
                            )
                            .cornerRadius(12)
                    }
                    .padding(.vertical, 9)

                    if index < tasks.count - 1 {
                        Divider()
                            .background(Color(hex: "F1F5F9"))
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "E2E8F0"), lineWidth: 1))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
    }
}

