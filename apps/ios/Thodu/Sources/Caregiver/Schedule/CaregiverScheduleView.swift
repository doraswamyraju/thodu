import SwiftUI

public struct CaregiverScheduleView: View {
    public let visits: [Booking]
    public var onSelectVisit: (Booking) -> Void
    
    @State private var selectedFilter: String = "ALL"
    @State private var searchText: String = ""
    @State private var activeDetailVisit: Booking? = nil
    
    public init(visits: [Booking], onSelectVisit: @escaping (Booking) -> Void) {
        self.visits = visits
        self.onSelectVisit = onSelectVisit
    }
    
    private var filteredVisits: [Booking] {
        visits.filter { v in
            let matchesFilter = selectedFilter == "ALL" || v.status == selectedFilter
            let matchesSearch = searchText.isEmpty ||
                v.beneficiaryName.localizedCaseInsensitiveContains(searchText) ||
                v.serviceName.localizedCaseInsensitiveContains(searchText) ||
                v.bookingNumber.localizedCaseInsensitiveContains(searchText)
            return matchesFilter && matchesSearch
        }
    }
    
    public var body: some View {
        VStack(spacing: 0) {
            // Header & Filter bar
            VStack(spacing: 12) {
                // Search bar
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(Color(hex: "94A3B8"))
                        .font(.system(size: 14))
                    TextField("Search by elder name, service or booking ref...", text: $searchText)
                        .font(.system(size: 13))
                }
                .padding(.horizontal, 12)
                .frame(height: 40)
                .background(Color(hex: "F1F5F9"))
                .cornerRadius(10)
                
                // Filter chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(["ALL", "In Progress", "Scheduled", "Completed"], id: \.self) { filter in
                            Button(action: { selectedFilter = filter }) {
                                Text(filter)
                                    .font(.system(size: 12, weight: selectedFilter == filter ? .bold : .medium))
                                    .foregroundColor(selectedFilter == filter ? .white : Color(hex: "4B5563"))
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 6)
                                    .background(selectedFilter == filter ? Color(hex: "0B5D3B") : Color(hex: "F3F4F6"))
                                    .cornerRadius(20)
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.white)
            
            Divider()
            
            // List of visits
            ScrollView(showsIndicators: false) {
                if filteredVisits.isEmpty {
                    VStack(spacing: 10) {
                        Image(systemName: "calendar.badge.exclamationmark")
                            .font(.system(size: 40))
                            .foregroundColor(Color(hex: "CBD5E1"))
                            .padding(.top, 40)
                        Text("No care shifts found matching criteria")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "64748B"))
                    }
                    .frame(maxWidth: .infinity)
                } else {
                    LazyVStack(spacing: 12) {
                        ForEach(filteredVisits) { visit in
                            Button(action: {
                                activeDetailVisit = visit
                            }) {
                                VStack(alignment: .leading, spacing: 10) {
                                    HStack {
                                        Text(visit.bookingNumber)
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundColor(Color(hex: "0B5D3B"))
                                            .padding(.horizontal, 6)
                                            .padding(.vertical, 2)
                                            .background(Color(hex: "E8F5E9"))
                                            .cornerRadius(6)
                                        
                                        Spacer()
                                        
                                        statusBadge(status: visit.status)
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(visit.beneficiaryName)
                                            .font(.system(size: 15, weight: .bold))
                                            .foregroundColor(Color(hex: "1B382B"))
                                        Text(visit.serviceName)
                                            .font(.system(size: 13))
                                            .foregroundColor(Color(hex: "4B5563"))
                                    }
                                    
                                    HStack(spacing: 16) {
                                        HStack(spacing: 4) {
                                            Image(systemName: "calendar")
                                                .font(.system(size: 11))
                                                .foregroundColor(Color(hex: "64748B"))
                                            Text(visit.scheduledDate)
                                                .font(.system(size: 11))
                                                .foregroundColor(Color(hex: "64748B"))
                                        }
                                        
                                        HStack(spacing: 4) {
                                            Image(systemName: "clock")
                                                .font(.system(size: 11))
                                                .foregroundColor(Color(hex: "64748B"))
                                            Text(visit.scheduledTimeSlot)
                                                .font(.system(size: 11))
                                                .foregroundColor(Color(hex: "64748B"))
                                        }
                                    }
                                }
                                .padding(14)
                                .background(Color.white)
                                .cornerRadius(14)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14)
                                        .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(16)
                    .padding(.bottom, 60)
                }
            }
        }
        .background(Color(hex: "F8FAF9").ignoresSafeArea())
        .sheet(item: $activeDetailVisit) { visit in
            shiftDetailSheet(visit: visit)
        }
    }
    
    private func statusBadge(status: String) -> some View {
        let (bg, fg) = { () -> (String, String) in
            switch status {
            case "Completed": return ("DCFCE7", "166534")
            case "In Progress": return ("E0F2FE", "0369A1")
            default: return ("FEF3C7", "92400E")
            }
        }()
        
        return Text(status)
            .font(.system(size: 10, weight: .bold))
            .foregroundColor(Color(hex: fg))
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(Color(hex: bg))
            .cornerRadius(10)
    }
    
    private func shiftDetailSheet(visit: Booking) -> some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 18) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(visit.beneficiaryName)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "1B382B"))
                        Text("Age: \(visit.beneficiaryAge) • \(visit.serviceName)")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "688273"))
                    }
                    Spacer()
                    statusBadge(status: visit.status)
                }
                
                Divider()
                
                VStack(spacing: 12) {
                    detailRow(title: "Booking Number", value: visit.bookingNumber)
                    detailRow(title: "Date & Time", value: "\(visit.scheduledDate) • \(visit.scheduledTimeSlot)")
                    detailRow(title: "Service Address", value: visit.serviceAddress)
                    detailRow(title: "Guardian Phone", value: visit.guardianPhone)
                    if let notes = visit.caregiverNotes, !notes.isEmpty {
                        detailRow(title: "Caregiver Notes", value: notes)
                    }
                }
                
                Spacer()
                
                if visit.status != "Completed" {
                    Button(action: {
                        activeDetailVisit = nil
                        onSelectVisit(visit)
                    }) {
                        Text(visit.status == "In Progress" ? "Open In Active Duty Workspace" : "Start This Shift Now")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(Color(hex: "0B5D3B"))
                            .cornerRadius(14)
                    }
                }
            }
            .padding(20)
            .navigationTitle("Shift Inspection")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private func detailRow(title: String, value: String) -> some View {
        HStack(alignment: .top) {
            Text(title)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "64748B"))
                .frame(width: 120, alignment: .leading)
            Text(value)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(Color(hex: "1E293B"))
            Spacer()
        }
    }
}
