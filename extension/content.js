fetch("http://localhost:5000/process-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sample: "data" })
  })
  .then(response => response.json())
  .then(data => console.log("Response from Flask:", data))
  .catch(error => console.error("Error:", error));
  