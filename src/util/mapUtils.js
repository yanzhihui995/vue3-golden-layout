export const getTurfIntersect = (coordinate1, coordinate2) => {
    let poly1 = {
        geometry: {
            coordinates: [coordinate1],
            type: "Polygon"
        },
        properties: {},
        type: "Feature"
    }
 
    let poly2 = {
        geometry: {
            coordinates: [coordinate2],
            type: "Polygon"
        },
        properties: {},
        type: "Feature"
    }
 
    let intersection = turf.intersect(turf.featureCollection([poly1, poly2]))
 
    return intersection
}