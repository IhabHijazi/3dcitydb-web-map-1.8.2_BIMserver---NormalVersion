/**
 *
 * @summary Stores class for getting boundingbox attribute for CityGML buildings inside the 3D web client
 * @author Tobias Krauth <tobias.krauth@tum.de>
 *
 * Last modified  : 2020-02-25 15:31:40
 */

/**
 * Class for accessing bounding box attribute and calculating center of CityGML buildings
 * @param {function} fetchDataFunc fetchDataFromGoogleFusionTable function from script.js 
 */
export default class AttributeProcessor{
    constructor(activeLayer){
        this.activeLayer = activeLayer;
        this.initCrs();
    }
    /**
     * Defines Gauss Kruger Zone 4 CRS
     */
    initCrs(){
        // proj4 has to be added in index.html with script tag
        proj4.defs("EPSG:31468","+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs");
    }
    /**
     * Makes use of fetchDataFromGoogleFusionTable function of script.js to get the BBOX from the attributes
     * @param {Array} relatedGmlIds Array with GMLIDs contained in BIM-Model
     * @param {string} thematicDataUrl Array to thematic data of Layer
     * @returns {Array} Array with BBOXes - ['(1,2,3 3,2,5 ..)','(4,5,6 ..)','..']
     */
    async fetchAttributes(relatedGmlIds, thematicDataUrl) {
        let unresolvedBoundingBoxes = relatedGmlIds.map(async(gmlId)=>{
            let boundingBox = await this.fetchData(gmlId, thematicDataUrl);
            return boundingBox;
        });
        let boundingBoxes = await Promise.all(unresolvedBoundingBoxes);
        // console.log(boundingBoxes);
        return boundingBoxes;
    }

    /**
     * Rearranges BBOXes and calculates the Center
     * @param {Array} bboxStringArray Array with bboxes as strings from this.fetchAttributes
     * @returns {Array} Returns coordinates as array in WGS84
     */
    getCenter(bboxStringArray) {
        let bboxObjectArray = bboxStringArray.map((bboxString) => this.splitBboxString(bboxString));

        const coords = ['x', 'y', 'z'];
        const edges = ['lowerLeft', 'upperRight'];
        const maxBox = { lowerLeft: {}, upperRight: {} };

        for (let coord of coords) {
            for (let edge of edges) {
                edge === 'lowerLeft' ?
                    maxBox[edge][coord] = Math.min(...bboxObjectArray.map((bboxObject) => bboxObject[edge][coord])) :
                    maxBox[edge][coord] = Math.max(...bboxObjectArray.map((bboxObject) => bboxObject[edge][coord]));
            }
        }

        const center = [
            maxBox.lowerLeft.x + (maxBox.upperRight.x - maxBox.lowerLeft.x) / 2, 
            maxBox.lowerLeft.y + (maxBox.upperRight.y - maxBox.lowerLeft.y) / 2,
            (maxBox.upperRight.z - maxBox.lowerLeft.z) / 2         // height relative to ground
        ];
        let centerWgs84 = proj4('EPSG:31468').inverse([center[0], center[1]]);
        centerWgs84[2] = center[2];
        return centerWgs84;
    }
    /**
     * 
     * @param {string} bboxString string of bbox - '(1,2,3 3,2,5 ..)'
     * @returns {Object} Object with lower left and upper right corner
     */
    splitBboxString(bboxString){
        const bboxArray = bboxString.replace(/[{()}]/g, '')  // removes () at start and end
                    .split(' ')                         // splits into coord sets
                    .map((set) =>                       // splits every coord set and converts into numbers
                        set.split(',')
                        .map(Number)
                    );
        
        let bbox = {}
        bbox.lowerLeft = {
            x: bboxArray[0][0],
            y: bboxArray[0][1],
            z: bboxArray[0][2]
        };
        bbox.upperRight = {
            x: bboxArray[2][0],
            y: bboxArray[2][1],
            z: bboxArray[2][2]
        };
        return bbox;
    }

}