import SwiftUI

struct FamilyDashboardView: View {
    @State private var showingSOSAlert = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    // Header Greeting
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Good Morning,")
                                .font(.system(size: 13, weight: .regular))
                                .foregroundColor(.thoduTextMuted)
                            Text("Anita Sharma")
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(.thoduForestGreen)
                        }
                        Spacer()
                        Button(action: { showingSOSAlert = true }) {
                            HStack(spacing: 4) {
                                Image(systemName: "exclamationmark.triangle.fill")
                                Text("SOS")
                                    .fontWeight(.bold)
                            }
                            .font(.system(size: 13))
                            .foregroundColor(.white)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(Color.thoduDangerRed)
                            .clipShape(Capsule())
                        }
                    }

                    // Banner Card
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Better Care.")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(.white)
                        Text("Brighter Tomorrows.")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(.thoduAccentYellow)
                        Text("Sri Divyang Seva Kendram Trust is always by your side.")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.9))
                            .padding(.top, 2)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(18)
                    .background(Color.thoduForestGreen)
                    .cornerRadius(20)

                    // Quick Metrics
                    HStack(spacing: 10) {
                        MetricBox(number: "2", label: "Beneficiaries", color: .thoduForestGreen)
                        MetricBox(number: "3", label: "Upcoming Visits", color: .thoduAccentYellow)
                        MetricBox(number: "1", label: "Active Request", color: .thoduHighlightRose)
                    }

                    // Quick Actions
                    Text("Quick Actions")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.thoduForestGreen)

                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                        ActionBox(icon: "house.fill", title: "Book Service", color: .thoduForestGreen)
                        ActionBox(icon: "calendar", title: "My Bookings", color: .thoduForestGreen)
                        ActionBox(icon: "person.2.fill", title: "Care Team", color: .thoduForestGreen)
                        ActionBox(icon: "doc.text.fill", title: "Payments", color: .thoduForestGreen)
                        ActionBox(icon: "questionmark.circle.fill", title: "Support", color: .thoduForestGreen)
                        ActionBox(icon: "exclamationmark.shield.fill", title: "SOS Alert", color: .thoduDangerRed)
                    }
                }
                .padding(.horizontal, 18)
                .padding(.top, 10)
            }
            .background(Color.thoduWarmCream.ignoresSafeArea())
            .navigationBarTitleDisplayMode(.inline)
            .alert("SOS Triggered", isPresented: $showingSOSAlert) {
                Button("OK", role: .cancel) { }
            } message: {
                Text("Emergency contacts and Trust rapid responders have been alerted.")
            }
        }
    }
}

struct MetricBox: View {
    let number: String
    let label: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Text(number)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(color)
            Text(label)
                .font(.system(size: 11))
                .foregroundColor(.thoduTextMuted)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(Color.white)
        .cornerRadius(16)
    }
}

struct ActionBox: View {
    let icon: String
    let title: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 22))
                .foregroundColor(color)
            Text(title)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(.thoduTextPrimary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(Color.white)
        .cornerRadius(16)
    }
}

