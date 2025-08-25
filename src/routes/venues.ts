import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { city, venueType = "restaurant" } = req.body;
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key" });
    }

    // Define venue type queries
    const venueQueries: { [key: string]: string } = {
      restaurant: `restaurants in ${city}`,
      cafe: `cafes in ${city}`,
      park: `parks in ${city}`,
      museum: `museums in ${city}`,
      cinema: `movie theaters in ${city}`,
      mall: `shopping malls in ${city}`,
      arcade: `gaming arcades in ${city}`,
      bowling: `bowling alleys in ${city}`,
      minigolf: `mini golf in ${city}`,
      adventure: `adventure activities in ${city}`,
      all: `date spots restaurants cafes parks in ${city}`
    };

    const query = venueQueries[venueType] || venueQueries.restaurant;
    
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json() as {
      results?: Array<{
        name: string;
        formatted_address: string;
        place_id: string;
        rating?: number;
        price_level?: number;
        types?: string[];
        photos?: Array<{ photo_reference: string }>;
      }>;
    };

    const venues = (data.results || []).map((item: any) => {
      const photoReference = item.photos?.[0]?.photo_reference;
      const photoUrl = photoReference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`
        : null;

      // Determine venue category based on types
      let category = "Other";
      if (item.types?.includes("restaurant") || item.types?.includes("food")) {
        category = "Restaurant";
      } else if (item.types?.includes("cafe")) {
        category = "Cafe";
      } else if (item.types?.includes("park")) {
        category = "Park";
      } else if (item.types?.includes("museum")) {
        category = "Museum";
      } else if (item.types?.includes("movie_theater")) {
        category = "Cinema";
      } else if (item.types?.includes("shopping_mall")) {
        category = "Shopping";
      } else if (item.types?.includes("amusement_park")) {
        category = "Entertainment";
      }

      return {
        name: item.name,
        address: item.formatted_address,
        imageUrl: photoUrl,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${item.place_id}`,
        rating: item.rating || null,
        priceLevel: item.price_level || null,
        category,
        types: item.types || []
      };
    });

    return res.json({ venues });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;