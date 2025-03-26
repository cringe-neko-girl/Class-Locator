const canvas = document.getElementById("floorCanvas");
const ctx = canvas.getContext("2d");

// Building data
const building = {
    latitude: 39.1705148,
    longitude: -86.5130371,
    floors: {
        "1": {
            image_url: "floor_1.png",
            rooms: {
                "110": {
                    x: 5406, // Updated Room 110 x-coordinate in the image
                    y: 3489, // Updated Room 110 y-coordinate in the image
                    label: "Room 110",
                    latitude: 39.1706973,
                    longitude: -86.5130489
                }
            }
        }
    }
};

// Room 110 data
const room110 = building.floors["1"].rooms["110"];

// Load floor plan image
const img = new Image();
img.src = building.floors["1"].image_url;

img.onload = () => {
    // Image loaded successfully
    drawFloorPlan();
};

img.onerror = () => {
    // Image failed to load
    alert("Error: Floor plan image not found.");
};

function drawFloorPlan(userX = null, userY = null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Check if image is loaded before drawing
    if (img.complete) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
        console.error("Floor plan image not available");
        return;
    }

    // Draw bounding lines around the image (floor plan)
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height); // Rectangle around the entire image area
    ctx.lineWidth = 5; // Line thickness
    ctx.strokeStyle = "black"; // Line color
    ctx.stroke();

    // Draw transparent radius around Room 110
    ctx.beginPath();
    ctx.arc(room110.x, room110.y, 30, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.fill();

    // Draw Room 110 marker
    ctx.beginPath();
    ctx.arc(room110.x, room110.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    // Draw user position if available
    if (userX !== null && userY !== null) {
        ctx.beginPath();
        ctx.arc(userX, userY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();

        // Draw path from user to Room 110
        ctx.beginPath();
        ctx.moveTo(userX, userY);
        ctx.lineTo(room110.x, room110.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

// Function to convert real-world lat/lon to canvas coordinates
function convertToCanvasCoords(userLat, userLon) {
    // Latitude and longitude of the reference point (Room 110)
    const refLat = room110.latitude;
    const refLon = room110.longitude;

    // Calculate the differences in lat and lon
    const latDiff = userLat - refLat;
    const lonDiff = userLon - refLon;

    // Set scale factors based on the image size and the known Room 110 coordinates
    const scaleX = canvas.width / (building.longitude - room110.longitude); // Scaling longitude to canvas width
    const scaleY = canvas.height / (building.latitude - room110.latitude); // Scaling latitude to canvas height

    // Convert lat/lon differences into canvas coordinates
    const userX = room110.x + lonDiff * scaleX;
    const userY = room110.y - latDiff * scaleY;

    return { userX, userY };
}

// Check if geolocation is supported by the browser
if ("geolocation" in navigator) {
    console.log("Geolocation is supported");
} else {
    console.error("Geolocation is not supported by this browser");
}

// Get user's real-time location
navigator.geolocation.watchPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        const { userX, userY } = convertToCanvasCoords(latitude, longitude);
        drawFloorPlan(userX, userY);
    },
    (error) => {
        // Handle different error cases
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.error("Location access denied by user.");
                alert("Location access denied. Please enable location permissions.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.error("Location request timed out.");
                break;
            default:
                console.error("An unknown error occurred.");
        }
    },
    { enableHighAccuracy: true }
);
