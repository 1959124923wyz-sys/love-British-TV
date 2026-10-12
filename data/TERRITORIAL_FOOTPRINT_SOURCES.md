# Territorial footprint geometry: source and reuse information

This directory's `territorial-footprints-1497-1519.geojson` deliberately separates **historic political status** from **modern shoreline reference geometry**.

## Modern coastal polygons (geographic reference only)

Source: [georgique/world-geojson](https://github.com/georgique/world-geojson), version 3.2.1, [GPL-3.0-or-later](https://github.com/georgique/world-geojson/blob/master/LICENSE), based on OpenStreetMap and manual geographic work. The five derived feature geometries for Isle of Man, Jersey, Guernsey, Orkney and Shetland retain GPL-3.0-or-later terms, and this derived geometry layer is provided under the same license. All other independently developed historical research data and website code retain their own original terms.

Original geometry paths:
- `areas/united_kingdom/isle_of_man.json`
- `areas/united_kingdom/jersey.json`
- `areas/united_kingdom/guernsey.json`
- `countries/united_kingdom.json` (select five polygon groups representing Orkney and five representing Shetland; longitude/latitude selection documented below).

Shapes are simplified outlines of **present-day islands**. For 1497–1519 they serve as land footprints only; political identity, date and legal classification come from independent historical research and sources. Coastline movement and local administrative boundaries are not reconstructed.

UK feature selection:
- Orkney: components entirely between latitudes 58.60–59.50, longitudes -3.7 to -2.15.
- Shetland: components entirely between latitudes 59.50–61.00, longitudes -2.5 to 0.00.
- Coordinates copied from the corresponding source features and rounded to 5 decimal degrees for rendering.

## Historical research-derived approximate polygons

**Calais Pale:** `data/geography-1500-hypotheses.geojson` feature `calais-1500-attested-sites-hull-only`. Mathematically encloses ten geocoded historic settlements; not a 1510 surveyed border. A fuller outline cannot be declared without evidence. Historical discussions: Arthur S. Sandeman, *Calais under English Rule*; Society of Antiquaries of London, *Calais and the Pale* (1893, DOI:10.1017/S0261340900005932), which explains changes to the marches.

**Eastern Ireland Pale:** `data/geography-1500-hypotheses.geojson` feature `irish-pale-1500-presentation-envelope` reconstructed from 1488 statute place names; represents geographical context of royal administration, not an exact contiguous English-held land tract.

**Tournai/Tournaisis:** separate `data/geography-1510-1519-hypotheses.geojson` research hull (1513–1518); military-administered urban core has a dated site marker, not an independently verified 1513 wall polygon.

## Visual semantics

- Sourced historical city presence + modern island coastlines: solid or hatched polygon indicating **different kinds of political relationship**.
- Indeterminate historical territorial frontier (Calais Pale, Irish Pale): translucent fill and clearly dashed border.
- A legal or historical *claim* is never silently converted into actual territorial occupation.
- Exclude all schematic feature geometry from historic control area totals and profit calculations.
