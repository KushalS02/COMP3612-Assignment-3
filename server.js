/*
Author: Kushal Saini
Assignment: 3
Professor: Randy Connolly
Course: COMP-3612
Filename: server.js
*/

const express = require("express");
const app = express();
const paintings = require("./data/paintings-nested.json");
const artists = require("./data/artists.json");
const galleries = require("./data/galleries.json");

// returns JSON for all paintings
app.get("/api/paintings", (req, resp) => {
    return resp.json(paintings);
});

// returns JSON for the painting with the specified ID
app.get("/api/painting/:id", (req, resp) => {
    const id = parseInt(req.params.id);
    const painting = paintings.find(p => p.paintingID === id);

    // checks if painting found
    if (painting === undefined) {
        return resp.json({ ErrorMessage: `invalid painting ID: ${id}` });
    }

    return resp.json(painting);
});

// returns JSON for all paintings with the specified gallery ID
app.get("/api/painting/gallery/:id", (req, resp) => {
    const id = parseInt(req.params.id);
    const gallery = galleries.find(g => g.GalleryID === id);

    // checks if gallery ID is valid
    if (gallery === undefined) {
        return resp.json({ ErrorMessage: `invalid gallery ID: ${id}` })
    }

    const paintingsInGallery = paintings.filter(p => p.gallery.galleryID === id);

    // checks if paintings found
    if (paintingsInGallery.length === 0) {
        return resp.json({ ErrorMessage: `no paintings found in gallery ID: ${id}` });
    }

    resp.json(paintingsInGallery);
});

// returns JSON for all paintings with the specified artist ID
app.get("/api/painting/artist/:id", (req, resp) => {
    const id = parseInt(req.params.id);
    const artist = artists.find(a => parseInt(a.ArtistID) === id);

    // checks if artist ID is valid
    if (artist === undefined) {
        return resp.json({ ErrorMessage: `invalid artist ID: ${id}` });
    }

    const paintingsByArtist = paintings.filter(p => p.artist.artistID === id);

    // chekcs if paintings found
    if (paintingsByArtist.length === 0) {
        return resp.json({ ErrorMessage: `no paintings found for artist ID: ${id}` });
    }

    return resp.json(paintingsByArtist);
});

// returns JSON for all paintings from the specified year range (inclusive)
app.get("/api/painting/year/:min/:max", (req, resp) => {
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);
    const paintingsInRange = paintings.filter(p => p.yearOfWork >= min && p.yearOfWork <= max);

    // checks if paintings found
    if (paintingsInRange.length === 0) {
        return resp.json({ ErrorMessage: `no paintings found for year range min: ${min}, max: ${max}` });
    }

    return resp.json(paintingsInRange);
});

// returns JSON for all paintings which contain the specified text in their title (case insensitive)
app.get("/api/painting/title/:text", (req, resp) => {
    const text = req.params.text.toLowerCase();
    const paintingsWithText = paintings.filter(p => p.title.toLowerCase().includes(text));

    // checks if paintings found
    if (paintingsWithText.length === 0) {
        return resp.json({ ErrorMessage: `no paintings found with ${text} in title` });
    }
    return resp.json(paintingsWithText);
});

// Retrieve paintings by color name (case insensitive)
app.get("/api/painting/color/:name", (req, resp) => {
    const colour = req.params.name.toLowerCase();
    const paintingsWithColour = paintings.filter(
        p => p.details.annotation.dominantColors.some(
            c => c.name.toLowerCase() === colour
        )
    );

    // checks if paintings found
    if (paintingsWithColour.length === 0) {
        return resp.json({ ErrorMessage: `no paintings found with dominant color: ${colour}` });
    }

    return resp.json(paintingsWithColour);
});

// Returns JSON for all artists
app.get("/api/artists", (req, resp) => {
    return resp.json(artists);
});

// Returns JSON for all artists from specified country (case insensitive)
app.get("/api/artists/:country", (req, resp) => {
    const country = req.params.country.toLowerCase();
    const artistsFromCountry = artists.filter(a => a.Nationality.toLowerCase() === country);

    // checks if artists found
    if (artistsFromCountry.length === 0) {
        return resp.json({ ErrorMessage: `no artists found from country: ${country}` });
    }

    return resp.json(artistsFromCountry);
});

// Returns JSON for all galleries
app.get("/api/galleries", (req, resp) => {
    return resp.json(galleries);
});

app.get("/api/galleries/:country", (req, resp) => {
    const country = req.params.country.toLowerCase();
    const galleriesFromCountry = galleries.filter(g => g.GalleryCountry.toLowerCase() === country);

    // checks if galleries found
    if (galleriesFromCountry.length === 0) {
        return resp.json({ ErrorMessage: `no galleries found from country: ${country}` });
    }

    return resp.json(galleriesFromCountry);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})