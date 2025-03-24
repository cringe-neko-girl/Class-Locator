alert("hello")
async function getFloorLevel(averageFloorHeight = 3) {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            try {
                const altitude = await getAltitudeFromOpenElevation(latitude, longitude);
                if (altitude !== null) {
                    const floorLevel = Math.round(altitude / averageFloorHeight);
                    document.getElementById("floor-output").textContent = `Floor Level: ${floorLevel - 83}`;
                } else {
                    alert("Unable to retrieve altitude.");
                }
            } catch (error) {
                alert("Error retrieving altitude data.");
            }
        },
        (error) => {
            alert("Error getting location: " + error.message);
        },
        { enableHighAccuracy: true }
    );
}

async function getAltitudeFromOpenElevation(lat, lon) {
    const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.results.length > 0) {
        return data.results[0].elevation;  // Return the altitude in meters
    } else {
        return null;
    }
}


function get_floor_level() {
    getFloorLevel();
}