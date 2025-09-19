import type { Request, Response } from "express";
import validator from "validator";

export async function encodeLocation(req: Request, res: Response) {
    try {
        const { lat, lon } = req.query;

        if (
            typeof lat !== "string" ||
            typeof lon !== "string" ||
            !validator.isFloat(lat) ||
            !validator.isFloat(lon)
        ) {
            return res.status(400).json({ error: "Invalid latitude or longitude" });
        }

        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "MyApp/1.0"
            }
        });
        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch location data" });
        }

        const data = await response.json();
        return res.json({ location: data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
