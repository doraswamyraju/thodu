import Foundation
import CoreLocation
import Combine

public class CaregiverLocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    public static let shared = CaregiverLocationManager()
    
    private let manager = CLLocationManager()
    
    @Published public var userLocation: CLLocationCoordinate2D? = nil
    @Published public var authorizationStatus: CLAuthorizationStatus = .notDetermined
    @Published public var isTransmitting: Bool = false
    
    public override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.distanceFilter = 10 // meters
        self.authorizationStatus = manager.authorizationStatus
    }
    
    public func requestPermission() {
        if authorizationStatus == .notDetermined {
            manager.requestWhenInUseAuthorization()
        } else if authorizationStatus == .authorizedWhenInUse || authorizationStatus == .authorizedAlways {
            startTracking()
        }
    }
    
    public func startTracking() {
        manager.startUpdatingLocation()
        isTransmitting = true
    }
    
    public func stopTracking() {
        manager.stopUpdatingLocation()
        isTransmitting = false
    }
    
    public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        self.authorizationStatus = manager.authorizationStatus
        if authorizationStatus == .authorizedWhenInUse || authorizationStatus == .authorizedAlways {
            startTracking()
        }
    }
    
    public func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let latest = locations.last else { return }
        DispatchQueue.main.async {
            self.userLocation = latest.coordinate
        }
    }
    
    public func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("CaregiverLocationManager error: \(error.localizedDescription)")
    }
    
    public func distanceKm(to latitude: Double, longitude: Double) -> Double? {
        guard let current = userLocation else { return nil }
        let currentLoc = CLLocation(latitude: current.latitude, longitude: current.longitude)
        let targetLoc = CLLocation(latitude: latitude, longitude: longitude)
        return currentLoc.distance(from: targetLoc) / 1000.0
    }
}

