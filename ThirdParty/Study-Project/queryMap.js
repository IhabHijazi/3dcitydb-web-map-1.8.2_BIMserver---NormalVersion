const queryMap = new Map();
queryMap.set('allObjects',
    {
        type: {
            name: "IfcProduct",
            includeAllSubTypes: true
        }
    }
);
queryMap.set('walls',
    {
        type: {
            name: "IfcWall",
            includeAllSubTypes: true
        }
    }
);
queryMap.set('wallsWindows',
    {
        type: {
            name: "IfcWall",
            includeAllSubTypes: true
        },
        include: {
            type: "IfcWall",
            field: "HasOpenings",
            include: {
                type: "IfcRelVoidsElement",
                field: "RelatedOpeningElement",
                include: {
                    type: "IfcOpeningElement",
                    field: "HasFillings",
                    include: {
                        type: "IfcRelFillsElement",
                        field: "RelatedBuildingElement",
                        outputType: "IfcWindow"
                    }
                }
            }
        }
    }
);
queryMap.set('wallsWindowsDoors',
    {
        type: {
            name: "IfcWall",
            includeAllSubTypes: true
        },
        include: {
            type: "IfcWall",
            field: "HasOpenings",
            include: {
                type: "IfcRelVoidsElement",
                field: "RelatedOpeningElement",
                include: {
                    type: "IfcOpeningElement",
                    field: "HasFillings",
                    include: {
                        type: "IfcRelFillsElement",
                        field: "RelatedBuildingElement"
                    }
                }
            }
        }
    }
);

export default queryMap;