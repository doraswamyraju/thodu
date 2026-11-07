import SwiftUI

public struct CaregiverActiveDutyView: View {
    public let caregiver: Caregiver
    public let activeVisit: Booking?
    public var onUpdateVisit: (String, UpdateBookingRequest) async -> Void
    public var onTriggerSos: (String) async -> Void
    public var onCompleteVisit: (Booking, [String: String], [CaregiverChecklistItem], String) async -> Void
    
    @State private var bp: String = "120/80"
    @State private var pulse: String = "74 bpm"
    @State private var spo2: String = "98%"
    @State private var sugar: String = "135 mg/dL"
    @State private var notes: String = ""
    @State private var isSaving: Bool = false
    @State private var showSavedToast: Bool = false
    @State private var showSosConfirmation: Bool = false
    @State private var showCompleteConfirmation: Bool = false
    
    @State private var tasks: [CaregiverChecklistItem] = [
        CaregiverChecklistItem(task: "Arrive at Home & Verify Elder Wellbeing", done: true, time: "10:00 AM"),
        CaregiverChecklistItem(task: "Record Clinical Vitals (BP, Pulse, SpO2, Blood Sugar)", done: true, time: "10:15 AM"),
        CaregiverChecklistItem(task: "Supervise Doctor-Prescribed Medication", done: false),
        CaregiverChecklistItem(task: "Assisted Walking / Gentle Mobility Exercise", done: false),
        CaregiverChecklistItem(task: "Nutritional Meal Preparation / Hydration Assistance", done: false),
        CaregiverChecklistItem(task: "Elder Comfort & Bedroom Safety Check", done: false)
    ]
    
    public init(
        caregiver: Caregiver,
        activeVisit: Booking?,
        onUpdateVisit: @escaping (String, UpdateBookingRequest) async -> Void,
        onTriggerSos: @escaping (String) async -> Void,
        onCompleteVisit: @escaping (Booking, [String: String], [CaregiverChecklistItem], String) async -> Void
    ) {
        self.caregiver = caregiver
        self.activeVisit = activeVisit
        self.onUpdateVisit = onUpdateVisit
        self.onTriggerSos = onTriggerSos
        self.onCompleteVisit = onCompleteVisit
    }
    
    public var body: some View {
        Group {
            if let visit = activeVisit {
                activeDutyContent(visit: visit)
            } else {
                emptyState
            }
        }
        .background(Color(hex: "F8FAF9").ignoresSafeArea())
    }
    
    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "cross.case")
                .font(.system(size: 48))
                .foregroundColor(Color(hex: "94A3B8"))
                .padding(.bottom, 8)
            
            Text("No Active Care Visit In-Progress")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(hex: "1B382B"))
            
            Text("You do not have an ongoing care shift right now. Check your shift roster or clock in when you arrive at the beneficiary's home.")
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "688273"))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
    
    private func activeDutyContent(visit: Booking) -> some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 20) {
                // 1. BENEFICIARY ON-DUTY HERO
                VStack(alignment: .leading, spacing: 14) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 4) {
                            HStack(spacing: 6) {
                                Circle()
                                    .fill(Color(hex: "16A34A"))
                                    .frame(width: 8, height: 8)
                                Text("ON-DUTY SHIFT IN-PROGRESS")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(Color(hex: "166534"))
                            }
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color(hex: "DCFCE7"))
                            .cornerRadius(12)
                            
                            Text(visit.beneficiaryName)
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(Color(hex: "1B382B"))
                            
                            Text("Age: \(visit.beneficiaryAge) Years • \(visit.serviceName)")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(Color(hex: "5A6E63"))
                        }
                        
                        Spacer()
                        
                        // Fast Action buttons (Call + Maps)
                        HStack(spacing: 10) {
                            if let url = URL(string: "tel://\(visit.guardianPhone)") {
                                Link(destination: url) {
                                    Image(systemName: "phone.fill")
                                        .font(.system(size: 14))
                                        .foregroundColor(Color(hex: "0B5D3B"))
                                        .frame(width: 40, height: 40)
                                        .background(Color(hex: "DCFCE7"))
                                        .clipShape(Circle())
                                }
                            }
                            
                            if let mapsUrl = URL(string: "http://maps.apple.com/?daddr=\(visit.beneficiaryLat),\(visit.beneficiaryLng)") {
                                Link(destination: mapsUrl) {
                                    Image(systemName: "location.fill")
                                        .font(.system(size: 14))
                                        .foregroundColor(Color(hex: "0369A1"))
                                        .frame(width: 40, height: 40)
                                        .background(Color(hex: "E0F2FE"))
                                        .clipShape(Circle())
                                }
                            }
                        }
                    }
                    
                    HStack(spacing: 6) {
                        Image(systemName: "mappin.circle.fill")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "16A34A"))
                        Text(visit.serviceAddress)
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "334155"))
                    }
                }
                .padding(18)
                .background(Color.white)
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
                )
                
                // 2. CLINICAL VISIT CHECKLIST
                VStack(alignment: .leading, spacing: 14) {
                    HStack {
                        Image(systemName: "checklist")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "0B5D3B"))
                        Text("Clinical Visit Protocol Checklist")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(Color(hex: "1B382B"))
                        Spacer()
                        let completedTasks = tasks.filter { $0.done }.count
                        Text("\(completedTasks)/\(tasks.count) Done")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "166534"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color(hex: "DCFCE7"))
                            .cornerRadius(10)
                    }
                    
                    VStack(spacing: 8) {
                        ForEach(Array(tasks.enumerated()), id: \.offset) { index, task in
                            Button(action: {
                                toggleTask(index: index)
                            }) {
                                HStack(alignment: .top, spacing: 12) {
                                    Image(systemName: task.done ? "checkmark.circle.fill" : "circle")
                                        .font(.system(size: 20))
                                        .foregroundColor(task.done ? Color(hex: "16A34A") : Color(hex: "94A3B8"))
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(task.task)
                                            .font(.system(size: 13, weight: task.done ? .semibold : .regular))
                                            .foregroundColor(task.done ? Color(hex: "1B382B") : Color(hex: "4B5563"))
                                            .strikethrough(task.done, color: Color(hex: "94A3B8"))
                                        
                                        if let t = task.time {
                                            Text("Completed at \(t)")
                                                .font(.system(size: 10))
                                                .foregroundColor(Color(hex: "166534"))
                                        }
                                    }
                                    Spacer()
                                }
                                .padding(12)
                                .background(task.done ? Color(hex: "F0FDF4") : Color(hex: "F8FAF9"))
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(task.done ? Color(hex: "BBF7D0") : Color(hex: "E5E9E6"), lineWidth: 1)
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
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
                
                // 3. CLINICAL VITALS RECORDER
                VStack(alignment: .leading, spacing: 14) {
                    HStack {
                        Image(systemName: "heart.text.square.fill")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "DC2626"))
                        Text("Record Elder Vitals (Live)")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(Color(hex: "1B382B"))
                    }
                    
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        vitalsInputCard(label: "Blood Pressure", value: $bp, placeholder: "120/80", unit: "mmHg", icon: "gauge.with.needle.fill", color: "DC2626")
                        vitalsInputCard(label: "Pulse Rate", value: $pulse, placeholder: "74", unit: "bpm", icon: "waveform.path.ecg", color: "EA580C")
                        vitalsInputCard(label: "Oxygen SpO2", value: $spo2, placeholder: "98", unit: "%", icon: "lungs.fill", color: "0284C7")
                        vitalsInputCard(label: "Blood Sugar", value: $sugar, placeholder: "135", unit: "mg/dL", icon: "drop.fill", color: "7C3AED")
                    }
                }
                .padding(18)
                .background(Color.white)
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
                )
                
                // 4. CAREGIVER CLINICAL NOTES
                VStack(alignment: .leading, spacing: 10) {
                    Text("Attendant Shift Notes & Observations")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(Color(hex: "1B382B"))
                    
                    TextField("Enter elder demeanor, appetite, mobility, or medication observations...", text: $notes, axis: .vertical)
                        .lineLimit(3...5)
                        .font(.system(size: 13))
                        .padding(12)
                        .background(Color(hex: "F8FAF9"))
                        .cornerRadius(10)
                        .overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
                        )
                }
                .padding(18)
                .background(Color.white)
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
                )
                
                // 5. ACTION BUTTONS (Save, SOS, Complete Shift)
                VStack(spacing: 12) {
                    // Save Progress Button
                    Button(action: {
                        Task {
                            isSaving = true
                            let vitalsMap = ["bp": bp, "pulse": pulse, "spo2": spo2, "sugar": sugar]
                            let req = UpdateBookingRequest(caregiverNotes: notes, vitals: vitalsMap, checklistCompleted: tasks)
                            await onUpdateVisit(visit.id, req)
                            isSaving = false
                            showSavedToast = true
                            try? await Task.sleep(nanoseconds: 2_000_000_000)
                            showSavedToast = false
                        }
                    }) {
                        HStack(spacing: 6) {
                            if isSaving {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Image(systemName: "checkmark.circle.fill")
                                Text(showSavedToast ? "Progress Saved!" : "Save Shift Vitals & Checklist")
                                    .font(.system(size: 14, weight: .bold))
                            }
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color(hex: showSavedToast ? "16A34A" : "0B5D3B"))
                        .cornerRadius(12)
                    }
                    .disabled(isSaving)
                    
                    // Mark Completed Button
                    Button(action: {
                        showCompleteConfirmation = true
                    }) {
                        HStack(spacing: 6) {
                            Image(systemName: "flag.checkered")
                            Text("Complete & Clock Out from Care Shift")
                                .font(.system(size: 14, weight: .bold))
                        }
                        .foregroundColor(Color(hex: "166534"))
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color(hex: "DCFCE7"))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "BBF7D0"), lineWidth: 1)
                        )
                    }
                    
                    // Caregiver Emergency Panic
                    Button(action: {
                        showSosConfirmation = true
                    }) {
                        HStack(spacing: 6) {
                            Image(systemName: "exclamationmark.triangle.fill")
                            Text("Emergency SOS Alarm (Elder in Distress)")
                                .font(.system(size: 13, weight: .bold))
                        }
                        .foregroundColor(Color(hex: "DC2626"))
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(Color(hex: "FEF2F2"))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "FECACA"), lineWidth: 1)
                        )
                    }
                }
            }
            .padding(16)
            .padding(.bottom, 60)
        }
        .alert("Complete Care Shift?", isPresented: $showCompleteConfirmation) {
            Button("Cancel", role: .cancel) {}
            Button("Confirm Complete", role: .none) {
                Task {
                    let vitalsMap = ["bp": bp, "pulse": pulse, "spo2": spo2, "sugar": sugar]
                    await onCompleteVisit(visit, vitalsMap, tasks, notes)
                }
            }
        } message: {
            Text("Confirm that all scheduled care protocols and medication duties for \(visit.beneficiaryName) have been completed successfully.")
        }
        .alert("TRIGGER EMERGENCY SOS?", isPresented: $showSosConfirmation) {
            Button("Cancel", role: .cancel) {}
            Button("TRIGGER SOS DISPATCH", role: .destructive) {
                Task {
                    await onTriggerSos("Caregiver \(caregiver.fullName) reported emergency at \(visit.beneficiaryName)'s home (\(visit.serviceAddress)).")
                }
            }
        } message: {
            Text("This will immediately sound a critical red alarm at the Thodu central emergency command dispatch.")
        }
    }
    
    private func toggleTask(index: Int) {
        tasks[index].done.toggle()
        if tasks[index].done {
            let formatter = DateFormatter()
            formatter.dateFormat = "hh:mm a"
            tasks[index].time = formatter.string(from: Date())
        } else {
            tasks[index].time = nil
        }
    }
    
    private func vitalsInputCard(label: String, value: Binding<String>, placeholder: String, unit: String, icon: String, color: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 5) {
                Image(systemName: icon)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: color))
                Text(label)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(Color(hex: "4B5563"))
            }
            
            HStack(spacing: 4) {
                TextField(placeholder, text: value)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Color(hex: "1B382B"))
                Text(unit)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "688273"))
            }
            .padding(10)
            .background(Color(hex: "F8FAF9"))
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
            )
        }
    }
}

