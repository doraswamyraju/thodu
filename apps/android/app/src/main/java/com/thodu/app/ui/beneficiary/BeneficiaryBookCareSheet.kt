package com.thodu.app.ui.beneficiary

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.api.ApiClient
import com.thodu.app.data.model.Beneficiary
import com.thodu.app.data.model.CareService
import com.thodu.app.data.model.CreateBookingRequest
import com.thodu.app.ui.theme.ThoduGreen
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BeneficiaryBookCareSheet(
    beneficiary: Beneficiary,
    services: List<CareService>,
    onDismiss: () -> Unit,
    onBookingCreated: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    var selectedService by remember { mutableStateOf(services.firstOrNull()) }
    var serviceExpanded by remember { mutableStateOf(false) }
    var fundingMode by remember { mutableStateOf("SUBSIDY") } // SUBSIDY or DIRECT
    var instructions by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    fun submitBooking() {
        if (selectedService == null) {
            errorMessage = "Please select a care service"
            return
        }

        isSubmitting = true
        errorMessage = null
        coroutineScope.launch {
            try {
                val req = CreateBookingRequest(
                    beneficiaryId = beneficiary.id,
                    beneficiaryName = beneficiary.fullName,
                    serviceName = selectedService!!.name,
                    scheduledDate = "Today, " + java.text.SimpleDateFormat("MMM dd, yyyy", java.util.Locale.getDefault()).format(java.util.Date()),
                    scheduledTimeSlot = "10:00 AM - 12:00 PM",
                    serviceAddress = beneficiary.address,
                    guardianPhone = beneficiary.primaryContact,
                    specialInstructions = instructions.ifEmpty { null },
                    fundingTier = if (fundingMode == "SUBSIDY") "100% Trust Covered" else "Direct Family Pay"
                )

                val res = ApiClient.apiService.createBooking(req)
                if (res.success) {
                    onBookingCreated()
                    onDismiss()
                } else {
                    errorMessage = res.message ?: "Failed to dispatch booking"
                }
            } catch (e: Exception) {
                errorMessage = "Network error: ${e.localizedMessage ?: "Unable to contact server"}"
            } finally {
                isSubmitting = false
            }
        }
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp)
                .padding(bottom = 36.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Schedule Caregiver Visit",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF111827)
                    )
                    Text(
                        text = "For loved one: ${beneficiary.fullName}",
                        fontSize = 12.sp,
                        color = Color(0xFF6B7280)
                    )
                }

                IconButton(onClick = onDismiss) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Field: Care Service Required
            Text(
                text = "Care Service Required",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF374151)
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Service Selector Dropdown
            Box {
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, Color(0xFFD1D5DB)),
                    color = Color.White,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { serviceExpanded = true }
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = if (selectedService != null) {
                                val priceStr = if (selectedService!!.pricingType == "FIXED_PRICE") "₹${(selectedService!!.pricePaise ?: 0) / 100} / ${selectedService!!.durationHours ?: 2} hrs" else "Custom Enquiry"
                                "${selectedService!!.name} ($priceStr)"
                            } else "Select Service",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF1F2937)
                        )
                        Text(text = "▼", fontSize = 11.sp, color = Color.Gray)
                    }
                }

                DropdownMenu(
                    expanded = serviceExpanded,
                    onDismissRequest = { serviceExpanded = false },
                    modifier = Modifier.fillMaxWidth(0.85f).background(Color.White)
                ) {
                    services.forEach { srv ->
                        val priceLabel = if (srv.pricingType == "FIXED_PRICE") "₹${(srv.pricePaise ?: 0) / 100} / ${srv.durationHours ?: 2} hrs" else "Custom Enquiry"
                        DropdownMenuItem(
                            text = {
                                Column {
                                    Text(
                                        text = "${srv.name} ($priceLabel)",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp
                                    )
                                    Text(
                                        text = srv.description,
                                        fontSize = 11.sp,
                                        color = Color.Gray,
                                        maxLines = 1
                                    )
                                }
                            },
                            onClick = {
                                selectedService = srv
                                serviceExpanded = false
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Funding Option Choice: Partner Subsidy vs Direct Pay
            Text(
                text = "Payment & Funding Mode",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF374151)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Partner Subsidy Option
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (fundingMode == "SUBSIDY") Color(0xFFF0FDF4) else Color.White,
                    border = BorderStroke(
                        width = if (fundingMode == "SUBSIDY") 2.dp else 1.dp,
                        color = if (fundingMode == "SUBSIDY") ThoduGreen else Color(0xFFE5E7EB)
                    ),
                    modifier = Modifier
                        .weight(1f)
                        .clickable { fundingMode = "SUBSIDY" }
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(
                            text = "Partner Subsidy Grant",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (fundingMode == "SUBSIDY") Color(0xFF14532D) else Color(0xFF1F2937)
                        )
                        Text(
                            text = "100% covered (Sri Divyang Seva Kendram Trust)",
                            fontSize = 10.sp,
                            color = Color(0xFF15803D),
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }
                }

                // Direct Family Pay Option
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (fundingMode == "DIRECT") Color(0xFFF0FDF4) else Color.White,
                    border = BorderStroke(
                        width = if (fundingMode == "DIRECT") 2.dp else 1.dp,
                        color = if (fundingMode == "DIRECT") ThoduGreen else Color(0xFFE5E7EB)
                    ),
                    modifier = Modifier
                        .weight(1f)
                        .clickable { fundingMode = "DIRECT" }
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(
                            text = "Direct Family Pay",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (fundingMode == "DIRECT") Color(0xFF14532D) else Color(0xFF1F2937)
                        )
                        Text(
                            text = "Pay digitally via UPI or Card",
                            fontSize = 10.sp,
                            color = Color(0xFF6B7280),
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Field: Caregiver Instructions
            Text(
                text = "Caregiver Instructions / Dietary Needs",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF374151)
            )

            Spacer(modifier = Modifier.height(6.dp))

            OutlinedTextField(
                value = instructions,
                onValueChange = { instructions = it },
                placeholder = { Text("e.g. Ensure blood pressure is recorded before meal.", fontSize = 12.sp, color = Color.Gray) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp),
                shape = RoundedCornerShape(10.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ThoduGreen,
                    unfocusedBorderColor = Color(0xFFD1D5DB)
                )
            )

            Spacer(modifier = Modifier.height(20.dp))

            if (errorMessage != null) {
                Text(
                    text = errorMessage!!,
                    color = Color.Red,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(bottom = 10.dp)
                )
            }

            // Submit Button
            Button(
                onClick = { submitBooking() },
                enabled = !isSubmitting,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF0D5C3A),
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                if (isSubmitting) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        strokeWidth = 2.dp,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Dispatching...", fontWeight = FontWeight.Bold)
                } else {
                    Text("Confirm & Dispatch Booking →", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        }
    }
}

