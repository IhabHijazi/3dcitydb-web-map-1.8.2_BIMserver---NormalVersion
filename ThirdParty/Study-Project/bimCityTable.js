// Wenn Map verwendet wird, anstatt generische Attribute, werden unnötige Infos
// in den Attributen die den User verwirren vermieden
// - better maintance

// ich könnte in die Tabelle noch 2 "Spalten" machen:
//      - 'hide': 
//      - 'position': Wenn angegeben, wird diese verwendet. Wenn null, dann wird abschätzung
//                    verwendet ...


const bimCityTable = [
    {model: 'Mensa', relatedGmlIds: ['GEDE21345', 'GEDE21346', 'GEDE21347']},
    {model: 'Building1', relatedGmlIds: ['DEBY_LOD2_4959457']},
    {model: 'Building2', relatedGmlIds: ['DEBY_LOD2_4906970', 'DEBY_LOD2_4906972', 'DEBY_LOD2_4906973', 'DEBY_LOD2_4906974', 'DEBY_LOD2_4906976', 'DEBY_LOD2_4906977', 'DEBY_LOD2_4906981', 'DEBY_LOD2_4906978', 'DEBY_LOD2_4906979', 'DEBY_LOD2_4906980']},
    {model: 'Building3', relatedGmlIds: ['DEBY_LOD2_4906965']},
    {model: 'Building4', relatedGmlIds: ['GEDE21353', 'GEDE21354', 'GEDE21355']},
    {model: 'Building5', relatedGmlIds: ['DEBY_LOD2_60042']},
    {model: 'Building6', relatedGmlIds: ['DEBY_LOD2_4959458']},
];

export default bimCityTable;


// function checkContainment(clickedGmlId, map) {
//     let projectName;
//     let relatedGmlIds;
//     function checkExistance() {
//         for (let [key, value] of map) {
//             if (value.includes(clickedGmlId)) {
//                 projectName = key;
//                 relatedGmlIds = value;
//                 return true;
//             }
//         }
//         return false;
//     }
//     if (checkExistance()) {
//         console.log('TRUUEEEE: ' + projectName + ' asd ' + relatedGmlIds);
//     } else {
//         console.log('No BIM-Model for selected building in BIM-Server');
//     }
// }

// checkContainment('GEDE21353', bimCityMap);


// const clickedGmlId = selectedBuildings[0];
// let projectName;
// let relatedGmlIds;
// function checkExistance(map) {
//     for (let [key, value] of map) {
//         if (value.includes(clickedGmlId)) {
//             projectName = key;
//             relatedGmlIds = value;
//             return true;
//         }
//     }
//     return false;
// }
// if (!checkExistance(bimCityMap)) {
//     throw new Error('No BIM-Model for selected building in BIM-Server');
// } else if (checkExistance(bimCityMap)) {
//     if (relatedGmlIds.length === 1) {
//         fetchDataFromGoogleFusionTable(clickedGmlId, thematicDataUrl).then((thematicData) => {
//             const bbox = thematicData.BBOX;
//             let center = getCenter(bbox);
//             proj4.defs("EPSG:31468","+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs");
//             center = proj4('EPSG:31468').inverse([center[0], center[1]]);
//             // center = [11.567595, 48.148115, 8];
//             flyToCameraPosition({
//                 longitude: center[0],
//                 latitude: center[1],
//                 height: 100,
//                 heading: 0,
//                 pitch: -90,
//                 roll: 0
//             });
//             // names of subprojects: "Mensa", "Building2"
//             bimConverter.getGltf(projectName, center);
//             hideSelectedObjects();
//         }) 
//     } else if (relatedGmlIds.length > 1) {
//         for (let gmlId of relatedGmlIds) {
//             fetchDataFromGoogleFusionTable(gmlId, thematicDataUrl).then
//         }
//         // getCenter sollte man einfach lower left, upper rigth, lowest, highest übergeben
//     }
// } else { throw new Error('somethings wrong with the relatedGmlIds') }



