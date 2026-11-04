import SwiftUI

public struct BottomTirupatiArtworkIOS: View {
    public init() {}
    
    public var body: some View {
        Canvas { context, size in
            let w = size.width
            let h = size.height
            
            // Background rolling green hill wave
            var backHill = Path()
            backHill.move(to: CGPoint(x: 0, y: h * 0.55))
            backHill.addCurve(
                to: CGPoint(x: w, y: h * 0.45),
                control1: CGPoint(x: w * 0.35, y: h * 0.40),
                control2: CGPoint(x: w * 0.70, y: h * 0.60)
            )
            backHill.addLine(to: CGPoint(x: w, y: h))
            backHill.addLine(to: CGPoint(x: 0, y: h))
            backHill.closeSubpath()
            context.fill(backHill, with: .color(Color(hex: "DCFCE7").opacity(0.65)))
            
            // Foreground lush hill wave
            var foreHill = Path()
            foreHill.move(to: CGPoint(x: 0, y: h * 0.70))
            foreHill.addCurve(
                to: CGPoint(x: w, y: h * 0.68),
                control1: CGPoint(x: w * 0.40, y: h * 0.62),
                control2: CGPoint(x: w * 0.75, y: h * 0.80)
            )
            foreHill.addLine(to: CGPoint(x: w, y: h))
            foreHill.addLine(to: CGPoint(x: 0, y: h))
            foreHill.closeSubpath()
            context.fill(foreHill, with: .color(Color(hex: "BBF7D0").opacity(0.85)))
            
            // Center Tirupati Gopuram silhouette
            let gopuramX = w * 0.50
            let gopuramBaseY = h * 0.80
            let templeColor = Color(hex: "86EFAC").opacity(0.60)
            
            context.fill(Path(CGRect(x: gopuramX - 22, y: gopuramBaseY - 20, width: 44, height: 20)), with: .color(templeColor))
            context.fill(Path(CGRect(x: gopuramX - 17, y: gopuramBaseY - 36, width: 34, height: 16)), with: .color(templeColor))
            context.fill(Path(CGRect(x: gopuramX - 12, y: gopuramBaseY - 50, width: 24, height: 14)), with: .color(templeColor))
            context.fill(Path(CGRect(x: gopuramX - 7, y: gopuramBaseY - 62, width: 14, height: 12)), with: .color(templeColor))
            
            // Caregiver escorting elder in wheelchair silhouette
            let silColor = Color(hex: "15803D").opacity(0.82)
            let chairX = w * 0.16
            let chairY = h * 0.78
            
            // Big wheelchair circle
            context.stroke(
                Path(ellipseIn: CGRect(x: chairX - 13, y: chairY - 13, width: 26, height: 26)),
                with: .color(silColor),
                lineWidth: 3
            )
            // Sitting elder head
            context.fill(Path(ellipseIn: CGRect(x: chairX - 8, y: chairY - 32, width: 12, height: 12)), with: .color(silColor))
            
            // Caregiver head & body
            let cgX = chairX - 22
            context.fill(Path(ellipseIn: CGRect(x: cgX - 6, y: chairY - 40, width: 12, height: 12)), with: .color(silColor))
            
            // Sacred Tree silhouette on the right
            let treeX = w * 0.86
            let treeY = h * 0.72
            let treeColor = Color(hex: "15803D").opacity(0.75)
            
            context.fill(Path(CGRect(x: treeX - 4, y: treeY, width: 8, height: 22)), with: .color(treeColor))
            context.fill(Path(ellipseIn: CGRect(x: treeX - 18, y: treeY - 26, width: 36, height: 36)), with: .color(treeColor))
            context.fill(Path(ellipseIn: CGRect(x: treeX - 26, y: treeY - 20, width: 28, height: 28)), with: .color(treeColor))
            context.fill(Path(ellipseIn: CGRect(x: treeX - 2, y: treeY - 20, width: 28, height: 28)), with: .color(treeColor))
        }
    }
}

