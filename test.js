import axios from "axios";
import * as fs from "fs";

/*
	To run the script: execute "npx ts-node test.js".
	Check the outputs (output.pdf and qrcode.png) to ensure the functionality works as expected.
*/
const runTests = async () => {
  const baseURL = "http://localhost:3000";
  const dummyJSON = JSON.parse(fs.readFileSync("dummy-fabric-canvas.json", "utf-8"));

  try {
    /*
     	Test PDF Preview.
     	Alternatively:
     	curl -X POST http://localhost:3000/preview \
        -H "Content-Type: application/json" \
        -d @dummyCanvas.json
	 	  Expected Behavior:
	 	  The browser opens a canvas with the blue rectangle, red circle, and green text.
	  */
    console.log("Testing /preview...");
    const previewResponse = await axios.post(`${baseURL}/preview`, { json: dummyJSON });
    console.log("Preview Response: Success");

    /*
      Test save to Fabric JSON.
      Alternatively:
      curl -X POST http://localhost:3000/save-json \
        -H "Content-Type: application/json" \
        -d '{
          "id": "example-id",
          "json": {
            "version": "5.2.4",
            "objects": [
              {
                "type": "rect",
                "left": 100,
                "top": 100,
                "width": 200,
                "height": 200,
                "fill": "blue",
                "angle": 0
              }
            ]
          }
        }'
      Expected Response:
      {
        "message": "JSON saved successfully!"
      }
    */
    console.log("Testing /save-json...");
    const saveResponse = await axios.post(`${baseURL}/save-json`, {
      id: "test-canvas",
      json: dummyJSON
    });
    console.log("Save Response:", saveResponse.data);

    /*
      Test get Fabric JSON.
      Alternatively:
      curl -X GET http://localhost:3000/get-json/example-id
      Expected Response:
      {
        "json": {
          "version": "5.2.4",
          "objects": [
            {
              "type": "rect",
              "left": 100,
              "top": 100,
              "width": 200,
              "height": 200,
              "fill": "blue",
              "angle": 0
            }
          ]
        }
      }
    */
    console.log("Testing /get-json...");
    const getResponse = await axios.get(`${baseURL}/get-json/test-canvas`);
    console.log("Get Response:", getResponse.data);

    /*
      Test save to PDF.
      Alternatively:
      curl -X GET http://localhost:3000/get-json/example-id
      Expected Response:
      {
        "json": {
          "version": "5.2.4",
          "objects": [
            {
              "type": "rect",
              "left": 100,
              "top": 100,
              "width": 200,
              "height": 200,
              "fill": "blue",
              "angle": 0
            }
          ]
        }
      }
    */
    console.log("Testing /save-pdf...");
    const pdfResponse = await axios.post(`${baseURL}/save-pdf`, { json: dummyJSON }, { responseType: "arraybuffer" });
    fs.writeFileSync("output.pdf", pdfResponse.data);
    console.log("PDF saved as output.pdf");

    /*
      Test generate QR Code.
      curl -X POST http://localhost:3000/generate-qr \
        -H "Content-Type: application/json" \
        -d '{"url": "http://localhost:3000/preview"}' --output qrcode.png
      Expected Behavior:
      A qrcode.png file is created in your directory. When scanned, it should direct to http://localhost:3000/preview.
    */
    console.log("Testing /generate-qr...");
    const qrResponse = await axios.post(
      `${baseURL}/generate-qr`,
      { url: `${baseURL}/preview` },
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync("qrcode.png", qrResponse.data);
    console.log("QR Code saved as qrcode.png");

    console.log("All tests passed successfully!");
  } catch (error) {
    console.error("Test failed:", error.response ? error.response.data : error.message);
  }
};

runTests();
