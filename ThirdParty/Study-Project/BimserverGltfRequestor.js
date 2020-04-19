/**
 *
 * @summary Stores class which enables download of glTF models from BIMserver
 * @author Tobias Krauth <tobias.krauth@tum.de>
 *
 * Last modified  : 2020-02-25 15:31:40
 */

import { BimServerClient } from '../../node_modules/BIMserver-JavaScript-API-master/bimserverclient.js';

/**
 * Class for connecting and downloading glTF models from BIMServer
 */
class BimserverGltfRequestor {
    constructor () {
        this.bimServerApi = null;
        this.addModelToMap = null;
        this.projects = new Map();
        this.query = {
            type: {
                name: "IfcWall",
                includeAllSubTypes: true
            }
       };
        this.topicId;
        this.downloadURL = null;
        this.modelPosition = null;
        // Makes sure that a "Done prparing" is not processed multiple times
        this.prepareReceived = false;
    }
    /**
     * log in to BIMserver. Executed from script.js when pushing login button
     * @param {string} baseurl BIMserver url
     * @param {string} user username
     * @param {string} pw password
     * @param {function} addFunc callback function for adding the gltf model to the map
     * @returns message of BIMserver if login was successful or not
     */
    login(baseurl, user, pw, addFunc) {
        this.addModelToMap = addFunc;
        this.bimServerApi = new BimServerClient(baseurl);
        const loginSuccessfull = new Promise((resolve, reject)=>{
            this.bimServerApi.login(user, pw, 
                () => {resolve()}, () => {reject()}
            );
        });
        return loginSuccessfull;
    }
    /**
     * Logout from BIMserver
     */
    logout(){
        this.bimServerApi.logout();
        this.bimServerApi = null;
    }

    // ()=>function() ist das gleiche wie ()=>{return function()}
    /**
     * returns download URL for glTF model of latest revision of input project
     * @param {string} projectName name of project
     * @param {array} position array of WGS84 coordinates where the model should be placed
     * @returns {string} download URL
     */
    getGltf(projectName, position) {
        this.modelPosition = position;
        return this.getLastRevisionId(projectName)
        .then((revisionId) => this.initDownload(revisionId, this.query))
        .then((topicId) => this.bimServerApi.registerProgressHandler(topicId, this.progressHandler.bind(this)))
        .then(()=>this.downloadURL)
        .catch(()=>Error('Problems at getGltf'));
    }
    /**
     * gets last revision id for input project
     * @param {string} projectName name of project
     * @returns {string} last revision id
     */
    getLastRevisionId(projectName) {
        // Checks if project name was already looked up before
        if (this.projects.has(projectName)){
            console.log("returning revisionId from Map");
            return this.projects.get(projectName);
        } else {
            let promise = new Promise((resolve, reject) => {
                this.bimServerApi.call("ServiceInterface", "getProjectsByName", { name: projectName }, (projects) => {
                    if (projects[0]) {
                        resolve(projects[0].lastRevisionId);
                    } else if (projects[0] == undefined) {
                        reject(Error('There is no project called ' + projectName));
                    }
                });
            });
            // this.projects.set(projectName, promise); // funktioniert nicht, da promise === Promise('fulfilled') un nicht eigentlicher Wert
            console.log("returning revisionId from promise");
            return promise;
        }
    }
    /**
     * Initializes the download for a given roid
     * @param {number} roid revision id
     * @param {Object} query BIMServer query as object
     * @returns {number} topicId for download
     */
    initDownload(roid, query) {
        const parameters = {
            roids: [roid], 
            query: query,
            serializerOid: 917542, // 1441830 "name": "Binary glTF Serializer 2" // 1310758 ->".. 1"
            sync: false
        };
        let promise = new Promise((resolve, reject) => {
            this.bimServerApi.call("ServiceInterface", "download", parameters, (data) => {
                this.topicId = parseInt(data);
                console.log(this.topicId);
                resolve(this.topicId)
            }, (error) => {
                this.afterDownload();
                reject(Error('download fehlgeschlagen mit folgender nachricht: ' + error.message));
            });
        });
        console.log("returning topicId from Promise");
        return promise;
    }
    /**
     * Processes the state, handed in by the websocket
     * -- Function mainly adopted from BIMview
     * @param {number} topicId topicId of the download
     * @param {string} state current state of the download
     */
    progressHandler(topicId, state) {
        if (state.errors != null && state.errors.length > 0) {
            this.afterDownload();
            state.errors.map(function(error){
                Error('download während progressHandler fehlgeschlagen mit folgendem Fehler: ' + error);
            });
        } else {
            if (state.title == "Starting download") {
                console.log("starting the download yeew");
            } else if (state.title == "Done preparing") {
                if (!this.prepareReceived) {
                    this.prepareReceived = true;
                    if (state.warnings.length > 0) {
                        state.warnings.map(function(warning){
                            Error('following warnings from Done preparing: ' + warning);
                        });
                    }
                    if (state.errors != null && state.errors.length > 0) {
                        this.prepareReceived = false;
                        this.topicId = null;
                        state.errors.map(function(error){
                            Error('error from Done preparing: ' + error);
                        });
                    } else {
                        const url = this.bimServerApi.generateRevisionDownloadUrl({
                            topicId: topicId,
                            zip: false
                        })
                        this.downloadURL = url;
                        console.log(this.downloadURL);
                        this.addModelToMap(this.downloadURL, this.modelPosition);
                    }
                }
            } else if (state.state == "FINISHED" && this.topicId != null) {
                console.log(state.state);
                // somehow the prepareReceived a few lines down doesn't work
                this.prepareReceived = false;
                this.bimServerApi.unregisterProgressHandler(this.topicId, this.progressHandler, function(){
                    console.log('download completed, unregister progressHandler');
                    if (this.topicId != null) {
                        this.bimServerApi.call("ServiceInterface", "cleanupLongAction", {topicId: this.topicId}, function(){});
                    }
                    
                    // Setting topicId to null to make sure that cancelling at this moment won't try to termintate something that's already done		
                    this.topicId = null;
                    this.downloadURL = null;
                    this.modelPosition = null;
                    this.prepareReceived = false; // hat aus irgend einem grund keine wirkung ..
                });
            }
        }
    }
    /**
     * function that can be used either if the download has an error or the download was successfull
     */
    afterDownload() {
        this.bimServerApi.unregisterProgressHandler(this.topicId, this.progressHandler, () => {
            this.topicId = null;
        });
    }
    /**
     * To varify if written query is valid JSON
     * @param {object} query JSON query object for BIMserver
     */
    verifyQuery(query) {
        if (typeof query !== "string") { 
            return false; 
        } 
        try { 
            JSON.parse(query); 
            return true; 
        } catch (error) { 
            return false; 
        } 
    }
}

// creates singleton
export const bimRequestor = new BimserverGltfRequestor;