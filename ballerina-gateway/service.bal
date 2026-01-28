import ballerina/http;
import ballerina/io;
import ballerina/websocket;

// --- Configuration ---
configurable string pythonServiceUrl = "http://localhost:8000";

// --- Clients ---
final http:Client pythonClient = check new (pythonServiceUrl);

// --- State Management ---
// In-memory store for active frontend clients to broadcast messages
// Key: Session ID (or a simple list for prototype), Value: Caller
map<websocket:Caller> webClients = {};

// --- Service Definition ---

// 1. WebSocket Service for Twilio Media Streams
service /streams on new websocket:Listener(9090) {

    resource function get .(http:Request req) returns websocket:Service|websocket:UpgradeError {
        return new TwilioStreamService();
    }
}

service class TwilioStreamService {
    *websocket:Service;

    remote function onOpen(websocket:Caller caller) {
        io:println("Twilio Stream Connected: ", caller.getConnectionId());
    }

    remote function onMessage(websocket:Caller caller, anydata data) returns error? {
        // Twilio sends JSON messages. We look for 'media' event.
        json|error msg = data.ensureType();
        if msg is json {
            string event = (check msg.event).toString();
            
            if event == "media" {
                // Extract Audio Payload (Base64)
                json media = check msg.media;
                string payload = (check media.payload).toString();
                
                // --- Call Python AI Engine ---
                // In production, this might be gRPC or async. Here we use HTTP POST.
                json requestBody = {
                    "session_id": "session-123", // logical mapping needed
                    "audio_base64": payload
                };
                
                http:Response|error response = pythonClient->post("/transcribe", requestBody);
                
                if response is http:Response {
                    json|error responseJson = response.getJsonPayload();
                    if responseJson is json {
                        // --- Broadcast to Frontend ---
                        string sanitizedText = (check responseJson.sanitized_text).toString();
                        broadcastToFrontend(sanitizedText);
                    }
                }
            }
        }
    }
    
    remote function onClose(websocket:Caller caller, int statusCode, string reason) {
        io:println("Twilio Stream Closed");
    }
}

// 2. WebSocket Service for React Frontend
service /dashboard on new websocket:Listener(9091) {
    resource function get .(http:Request req) returns websocket:Service|websocket:UpgradeError {
        return new DashboardService();
    }
}

service class DashboardService {
    *websocket:Service;

    remote function onOpen(websocket:Caller caller) {
        io:println("Frontend Client Connected: ", caller.getConnectionId());
        // Store client
        webClients[caller.getConnectionId().toString()] = caller;
    }

    remote function onClose(websocket:Caller caller, int statusCode, string reason) {
        // Remove client
        string id = caller.getConnectionId().toString();
        _ = webClients.remove(id);
        io:println("Frontend Client Disconnected");
    }
}

// --- Helper Functions ---

function broadcastToFrontend(string message) {
    foreach var caller in webClients {
        json msg = {"type": "transcription", "text": message};
        var err = caller->writeMessage(msg);
        if err is error {
            io:println("Error broadcasting to client: ", err);
        }
    }
}
