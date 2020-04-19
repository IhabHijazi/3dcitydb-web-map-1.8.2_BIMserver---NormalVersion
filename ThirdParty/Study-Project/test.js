function splitBboxString(bboxString){
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
    // should return objects with all the lat longs
    // than use this function with .map -->> array.map((bbox)->splitBboxString)
}

function getCenter(BBOX) {
    let bbox = BBOX;
    bbox = bbox.replace(/[{()}]/g, '')  // removes () at start and end
                .split(' ')                         // splits into coord sets
                .map((set) =>                       // splits every coord set and converts into numbers
                    set.split(',')
                    .map(Number)
                );
    const lowerLeft = {
        x: bbox[0][0],
        y: bbox[0][1],
        z: bbox[0][2]
    };
    const upperRight = {
        x: bbox[2][0],
        y: bbox[2][1],
        z: bbox[2][2]
    };
    const center = [
        lowerLeft.x + (upperRight.x - lowerLeft.x) / 2, 
        lowerLeft.y + (upperRight.y - lowerLeft.y) / 2,
        (upperRight.z - lowerLeft.z) / 2         // height relative to ground
    ];
    return center;
}

const bboxString = '(1.2,4.3,5 1.3,4.5,5 1.4,4.2,6 1.7,4.6,6 1.2,4.3,5)';



const bboxes = [
    {lowerLeft: {x:0.1, y:10, z:13}, upperRight: {x:60, y:7, z:15}},
    {lowerLeft: {x:13, y:14, z:11}, upperRight: {x:7, y:18, z:6}},
    {lowerLeft: {x:12, y:13, z:11}, upperRight: {x:15, y:6, z:9}},
    {lowerLeft: {x:4, y:0.17, z:13}, upperRight: {x:6, y:7, z:15}},
    {lowerLeft: {x:13, y:50, z:11}, upperRight: {x:7, y:18, z:6}},
    {lowerLeft: {x:12, y:13, z:1}, upperRight: {x:15, y:6, z:9}},
    {lowerLeft: {x:4, y:10, z:13}, upperRight: {x:6, y:70, z:15}},
    {lowerLeft: {x:13, y:4, z:0.11}, upperRight: {x:7, y:18, z:6}},
    {lowerLeft: {x:12, y:13, z:1}, upperRight: {x:15, y:6, z:90}},
];




const coords = ['x','y','z'];
const edges = ['lowerLeft', 'upperRight'];
const maxBox = {lowerLeft: {}, upperRight: {}};

for (coord of coords) {
    for (edge of edges) {
        edge === 'lowerLeft' ?
        maxBox[edge][coord] = Math.min(...bboxes.map((bboxObject) => bboxObject[edge][coord])) :
        maxBox[edge][coord] = Math.max(...bboxes.map((bboxObject) => bboxObject[edge][coord]));
    }    
}


let array = ['kjnasd', 'kjnafr', 'kjntzjd', 'kjnasasdd'];

let relatedGmlIds = {};
array.forEach(gmlId => {
    relatedGmlIds[gmlId] = 'gelbgruenblau';    
});

let object = {
    id123: 'green',
    id234: 'red',
    id345: 'yellow'
};

for (var id in object) {
    console.log(object[id]);
}