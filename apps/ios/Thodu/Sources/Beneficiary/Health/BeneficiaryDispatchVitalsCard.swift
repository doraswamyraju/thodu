import SwiftUI

public struct BeneficiaryDispatchVitalsCard: View {
    public let activeBooking: Booking?

    public init(activeBooking: Booking?) {
        self.activeBooking = activeBooking
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            HStack {
                Text("Today's Caregiver Dispatch & Vitals")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Text("• \(activeBooking?.status ?? "In Progress")")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(Color(hex: "15803D"))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color(hex: "DCFCE7"))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "86EFAC"), lineWidth: 1))
                    .cornerRadius(12)
            }

            // 4 Vitals Box Grid
            let vitals = activeBooking?.vitals ?? VitalsLog()
            HStack(spacing: 8) {
                VitalMetricBox(title: "Blood Pressure", value: vitals.bloodPressure ?? "124/82", unit: "mmHg", iconName: "heart.fill", color: Color(hex: "E11D48"))
                VitalMetricBox(title: "Heart Pulse", value: "\(vitals.pulseBpm ?? 74)", unit: "bpm", iconName: "waveform.path.ecg", color: Color(hex: "2563EB"))
                VitalMetricBox(title: "Oxygen SpO2", value: "\(vitals.oxygenSpo2 ?? 98)", unit: "%", iconName: "lungs.fill", color: Color(hex: "0D5C3A"))
                VitalMetricBox(title: "Blood Sugar", value: "\(vitals.bloodSugarMgDl ?? 110)", unit: "mg/dL", iconName: "drop.fill", color: Color(hex: "D97706"))
            }

            // Recorded At Timestamp
            HStack(spacing: 4) {
                Image(systemName: "clock")
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "64748B"))
                Text("Last recorded: \(vitals.recordedAt ?? "Today, 09:15 AM") by Anitha (Care Specialist)")
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "64748B"))
            }
        }
        .padding(16)
        .background(Color.white)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "E5E7EB"), lineWidth: 1))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
    }
}

public struct VitalMetricBox: View {
    public let title: String
    public let value: String
    public let unit: String
    public let iconName: String
    public let color: Color

    public var body: some View {
        VStack(spacing: 4) {
            Image(systemName: iconName)
                .font(.system(size: 14))
                .foregroundColor(color)

            Text(value)
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(Color(hex: "0F172A"))

            Text(unit)
                .font(.system(size: 9))
                .foregroundColor(Color(hex: "64748B"))

            Text(title)
                .font(.system(size: 8.5, weight: .medium))
                .foregroundColor(Color(hex: "475569"))
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .padding(.horizontal, 2)
        .background(Color(hex: "F8FAFC"))
        .cornerRadius(10)
    }
}
