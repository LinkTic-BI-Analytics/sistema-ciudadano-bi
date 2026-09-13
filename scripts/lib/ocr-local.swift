// OCR local con el framework Vision de macOS. No sale nada de la máquina.
// Uso: ocr-local <imagen> [imagen...]  → texto por salida estándar.

import Foundation
import Vision
import AppKit

guard CommandLine.arguments.count > 1 else {
    FileHandle.standardError.write("uso: ocr-local <imagen> [imagen...]\n".data(using: .utf8)!)
    exit(2)
}

for path in CommandLine.arguments.dropFirst() {
    guard let img = NSImage(contentsOf: URL(fileURLWithPath: path)),
          let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        FileHandle.standardError.write("no se pudo abrir: \(path)\n".data(using: .utf8)!)
        continue
    }
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.recognitionLanguages = ["es-ES", "en-US"]
    req.usesLanguageCorrection = true
    try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
    for obs in (req.results ?? []) {
        if let c = obs.topCandidates(1).first { print(c.string) }
    }
}
