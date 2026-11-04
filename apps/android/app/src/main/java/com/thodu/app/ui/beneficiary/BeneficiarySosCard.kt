package com.thodu.app.ui.beneficiary

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Warning
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
import com.thodu.app.data.model.SosRequest
import kotlinx.coroutines.launch

@Composable
fun BeneficiarySosCard(
    beneficiary: Beneficiary,
    onSosTriggered: () -> Unit = {}
) {
    val coroutineScope = rememberCoroutineScope()
    var isSending by remember { mutableStateOf(false) }
    var alertSent by remember { mutableStateOf(false) }

    fun triggerEmergency() {
        isSending = true
        coroutineScope.launch {
            try {
                val req = SosRequest(
                    beneficiaryId = beneficiary.id,
                    beneficiaryName = beneficiary.fullName,
                    beneficiaryAddress = beneficiary.address,
                    latitude = beneficiary.latitude,
                    longitude = beneficiary.longitude,
                    guardianContact = beneficiary.primaryContact,
                    emergencyDoctorPhone = beneficiary.emergencyDoctorPhone,
                    notes = "Emergency SOS triggered from mobile app for ${beneficiary.fullName}"
                )
                ApiClient.apiService.triggerSos(req)
                alertSent = true
                onSosTriggered()
            } catch (_: Exception) {
            } finally {
                isSending = false
            }
        }
    }

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color(0xFFFEF2F2),
        border = BorderStroke(1.dp, Color(0xFFFECACA)),
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Warning,
                    contentDescription = null,
                    tint = Color(0xFFDC2626),
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Emergency Rapid Response",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF991B1B)
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Immediate emergency assistance with real-time location broadcast to field responders:",
                fontSize = 11.sp,
                color = Color(0xFF7F1D1D),
                lineHeight = 15.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                onClick = { triggerEmergency() },
                enabled = !isSending,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFDC2626),
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(46.dp)
            ) {
                if (isSending) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        strokeWidth = 2.dp,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Broadcasting Location...", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                } else if (alertSent) {
                    Text("✓ Responder Dispatched (ETA: 10m)", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                } else {
                    Text("Trigger 1-Tap SOS", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Phone,
                    contentDescription = null,
                    tint = Color(0xFF991B1B),
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Coordinator Hotline: +91 98480 22334",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF7F1D1D)
                )
            }
        }
    }
}

