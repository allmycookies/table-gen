<?php
// Fehler-Reporting für die Entwicklung (in Produktion entfernen)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// --- 1. Setup der Verzeichnisse ---
$layouts_dir = 'layouts';
$logo_dir = 'logos';
header('Content-Type: application/json');

// --- 2. Sicherstellen, dass Ordner existieren ---
if (!is_dir($layouts_dir)) {
    if (!mkdir($layouts_dir, 0775, true)) {
         http_response_code(500); 
         echo json_encode(['error' => 'Layout-Ordner konnte nicht erstellt werden.']);
         exit;
    }
}
// Logo-Ordner (optional, kann auch manuell erstellt werden)
if (!is_dir($logo_dir)) {
     mkdir($logo_dir, 0775, true);
}


// --- 3. API-Logik (Aktionen steuern) ---
$action = $_REQUEST['action'] ?? null;

try {
    switch ($action) {
        
        // Aktion: Alle Layouts auflisten (GET)
        case 'list':
            $files = scandir($layouts_dir);
            $layouts = [];
            foreach ($files as $file) {
                // Nur .json Dateien nehmen
                if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                    // Nur den Dateinamen ohne .json Endung hinzufügen
                    $layouts[] = pathinfo($file, PATHINFO_FILENAME);
                }
            }
            sort($layouts); // Alphabetisch sortieren
            echo json_encode($layouts); // Sendet: ["Layout A", "Layout B"]
            break;

        // Aktion: Ein Layout laden (GET)
        case 'load':
            $name = trim($_GET['name'] ?? '');
            if (empty($name)) throw new Exception('Kein Name angegeben.');
            
            // Security: Verhindern, dass Pfade (../) genutzt werden
            $safe_name = basename($name);
            if ($safe_name !== $name) throw new Exception('Ungültiger Name.');

            $file_path = $layouts_dir . '/' . $safe_name . '.json';
            
            if (file_exists($file_path)) {
                // WICHTIG: Den reinen JSON-Text der Datei senden.
                // app.js wird dies als Text lesen und selbst parsen.
                readfile($file_path);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Layout nicht gefunden']);
            }
            break;

        // Aktion: Ein Layout speichern (POST)
        case 'save':
            $name = trim($_POST['name'] ?? '');
            $config_json = $_POST['config_json'] ?? null;

            if (empty($name) || empty($config_json)) {
                throw new Exception('Name oder Konfiguration fehlt.');
            }

            // Security: Verhindern, dass Pfade (../) genutzt werden
            $safe_name = basename($name);
            if ($safe_name !== $name) throw new Exception('Ungültiger Name.');

            // Security: Prüfen, ob das empfangene JSON überhaupt gültig ist
            json_decode($config_json);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Ungültige JSON-Konfiguration empfangen.');
            }

            $file_path = $layouts_dir . '/' . $safe_name . '.json';

            if (file_put_contents($file_path, $config_json) === false) {
                 throw new Exception('Datei konnte nicht geschrieben werden (Berechtigungen prüfen?).');
            }
            
            // Erfolg melden (app.js erwartet eine JSON-Antwort)
            echo json_encode(['success' => true, 'name' => $name]);
            break;

        // Aktion: Ein Layout löschen (POST)
        case 'delete':
            $name = trim($_POST['name'] ?? '');
            if (empty($name)) throw new Exception('Kein Name angegeben.');

            // Security: Verhindern, dass Pfade (../) genutzt werden
            $safe_name = basename($name);
            if ($safe_name !== $name) throw new Exception('Ungültiger Name.');

            $file_path = $layouts_dir . '/' . $safe_name . '.json';

            if (file_exists($file_path)) {
                if (unlink($file_path)) {
                    echo json_encode(['success' => true, 'deleted_name' => $name]);
                } else {
                    throw new Exception('Datei konnte nicht gelöscht werden (Berechtigungen prüfen?).');
                }
            } else {
                 http_response_code(404);
                 echo json_encode(['error' => 'Datei zum Löschen nicht gefunden.']);
            }
            break;

        // ======================================================
        // NEUE FUNKTION: Logos aus dem Ordner "logos" auflisten
        // (Diese Funktion war bereits korrekt file-basiert)
        // ======================================================
        case 'list-logos':
            $allowed_extensions = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
            $logos = [];

            if (!is_dir($logo_dir)) {
                // Verzeichnis existiert nicht, leere Liste zurückgeben
                echo json_encode([]);
                break;
            }

            $files = scandir($logo_dir);
            foreach ($files as $file) {
                if ($file === '.' || $file === '..') {
                    continue;
                }
                
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($ext, $allowed_extensions)) {
                    $logos[] = $file; // Nur den Dateinamen zur Liste hinzufügen
                }
            }
            
            echo json_encode($logos);
            break;
        // ======================================================

        default:
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Unbekannte oder fehlende Aktion: ' . htmlspecialchars($action)]);
    }

} catch (Exception $e) {
    http_response_code(400); 
    echo json_encode(['error' => $e->getMessage()]);
}
?>