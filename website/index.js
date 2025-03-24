alert("hello")
const canvas = document.getElementById("floorCanvas");
const ctx = canvas.getContext("2d");

// Building data
const building = {
    latitude: 39.1705148,
    longitude: -86.5130371,
    floors: {
        "1": {
            image_url: "buildings/Teter_Quad/Rabb/floors/floor_1.png",
            rooms: {
                "110": {
                    x: 540,
                    y: 350,
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
img.onload = () => drawFloorPlan();

// Function to draw the floor plan
function drawFloorPlan(userX = null, userY = null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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
    const latDiff = userLat - building.latitude;
    const lonDiff = userLon - building.longitude;

    const scaleX = 100000; // Adjust this to map lat/lon properly
    const scaleY = 100000;

    const userX = 400 + lonDiff * scaleX;
    const userY = 400 - latDiff * scaleY;

    return { userX, userY };
}

// Get user's real-time location
navigator.geolocation.watchPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        const { userX, userY } = convertToCanvasCoords(latitude, longitude);
        drawFloorPlan(userX, userY);
    },
    (error) => console.error("Error getting location:", error),
    { enableHighAccuracy: true }
);
