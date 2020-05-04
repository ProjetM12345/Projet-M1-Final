
//-------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------READ THE FILE THAT THE USER WANTS TO LOAD ON HIS MAP------------------------------------------------------
//readSingleFile function allow to translate the JSON file into a variable using the json.parse () function.
function readSingleFile(evt) {     
    var f = evt.target.files[0];                    //The target property is the element that has been registered for the event                 
    if (f) {                                        //if the user load a readable file 
        var r = new FileReader();                   //The FileReader object is used to read the contents of files. It can read the content of File or Blob objects (which respectively represent a file or data).
        r.onload = function(e) {                    //when the object r is created, we can can read the content of the file 
            var contents = e.target.result;         //contents of the loaded file 
            try{                                    
                jsonFileLoader(JSON.parse(contents));   //JSON.parse function parses a character string (contents of the file) in JSON format and constructs the JavaScript value of the object described by this string.
            }catch(error){                          //if an error occurs in the try (with the JSON.parse function), the selected file isn't a json file 
                alert("Error, this is not json file");  //an alert modal to prevent the user that his selected file is not a JSON file. 
            }
        }
        r.readAsText(f);                            //the JSON file will be read as text
    } else { 
        alert("Failed to load file");               //if the file can't be read
    }
}
document.getElementById("jsonFileLoader").addEventListener('change', readSingleFile, false); //call the function readSingleFile when the user select a new file (to load it on mind map)


//-------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------ANALYSE OF THE JSON FILE'S CONTENT TO BUILD THA MIND MAP AFTER------------------------------------------------------
//The creation of the imported concept map is done object by object, first the spheres with their legend with the 
//jsonFileToMindMap() function and then the links, once the program has identified which spheres were connected. 
//However, you have to make sure that the program does not create the same link several times, for this the jsonFileLoader()
//function will fill a list of different links (without duplicates) then the jsonCreateLinks() function ends 
//the creation of the concept map with all the necessary links.
function jsonFileLoader(mindmap){ 
    //var mindmap;
    numSphere = 0;
    numLink=100;
    angle=0;
    //mindmap=jsonFileContents;
    sphereLinks=[];                                //list of links which have to be created with the JSON file
    let linkexist;
    linkNames =[];
    for(let i=0;i<mindmap["spheres"].length;i++){  //the first for loop to allows to access at all the sphere informations : mindmap["spheres"]= [object1],[object2],...
        for(let k=0;k<mindmap["spheres"][i][1]["connected sphere(s)"].length;k++){  //the second for loop allows to access at all the connected spheres informations (name of the sphere and name of the link) like that : mindmap["spheres"][i][1]["connected sphere(s)"] = [{sphere name: "Apple", link name: "red"},{sphere name: "Blueberry", link name: "blue"}]
            linkexist=1;                           //at first, we suppose that the link does not already exist in the list sphereLinks
            for(let j=0;j<sphereLinks.length;j++){ //the third for loop allows to know if the link already exist in the sphereLink list.  The aim of this loop is to build a list (sphereLinks) which contain the connected spheres only once like this : sphereLinks=[[name sphere1, name sphere2],[name sphere1,name sphere3]]
               if((sphereLinks[j][0]==mindmap["spheres"][i][1]["connected sphere(s)"][k]["sphere name"]) && (sphereLinks[j][1]==mindmap["spheres"][i][0]["sphere"]) && (linkexist==1)){ //condition to know if the link already exist
                    linkexist=2;                   //If a similary links already between two spheres, linkexist value will be 2 to significate that we do not need to push this link in sphereLinks because he already exist in this list.
                }
            }
            if(linkexist==1){                      //if linkexist=1, the links does not already exist in sphereLinks. So we can push in sphereLinks informations about the connected spheres to add the link between them
                sphereLinks.push([mindmap["spheres"][i][0]["sphere"],mindmap["spheres"][i][1]["connected sphere(s)"][k]["sphere name"]]);
                linkNames.push(mindmap["spheres"][i][1]["connected sphere(s)"][k]["link name"]);
            }
        }
        if(i==0){                                  //this condition allow to empty the world (the entire mindmap) before we add the first object in it. See the 'jsonFileToMindMap' function arguments and if conditions to understand how it work
            jsonFileToMindMap(mindmap["spheres"][i][0],"beginning"); //first call to the function jsonFileToMindMap
        }else{
            jsonFileToMindMap(mindmap["spheres"][i][0],"notthebeginning"); //other calls to the function jsonFileToMindMap (without empty the mind map)
        }    
    }
    jsonCreateLinks(sphereLinks, linkNames);       //call to function jsonCreateLinks to add one link between the connected spheres. 
}


//-------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------CREATION OF SPHERE (one by one) WITH THE JSON FILE'S CONTENT------------------------------------------------------
function jsonFileToMindMap(object1, arg){ 
    if(listSpheres2.length==0){                //if listSphere2 is empty (no objects in the mind map)
        var canvasIsEmpty="true";              
    }else{                                     //if listSphere2 is not empty (there are objects in the mind map)  
        var canvasIsEmpty="false";
    }
    if(canvasIsEmpty=="true" | arg=="notthebeginning"){  //if the canvas is empty or we already begin to create the mind map of the loaded file (so we don't have to empty the mind map again like in the "else" condition)
        canvasIsEmpty="false";                 //the mind map is no longer empty 
        addSphere(object1["position"]["x"],object1["position"]["y"],object1["position"]["z"],false,object1["sphere"]);  //add a sphere to the mind map (with its label)
    }else {
        if (window.confirm('Do you want to empty your mind map ?') ){ //a confirm modal appear on the window, it will ask if the user wants to delete the example from the scene to do his own map.If the user clicks on "Cancel" then the concept map he wanted to import will not be deleted and the existing concept map will not be deleted. However, if the user clicks on "OK" then the concept map will be deleted using the deleteObject () function.
            deleteObjects();                   //delete all the objects of the map if the user want it (with the modal)
            canvasIsEmpty="false";             //the mind map is no longer empty (a sphere will be addéed to the map)
            addSphere(object1["position"]["x"],object1["position"]["y"],object1["position"]["z"],false,object1["sphere"]);  //add a sphere to the mind map (with its label)
        }else{                                 //If the user clicks on "Cancel" then the concept map he wanted to import will not be deleted and the existing concept map will not be deleted.
                                               //we do nothing 
        }
    }
    rotateworld();                                 //one call to this function allow to make labels visible (lookAt camera)
}


//-------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------CREATION OF ALL THE LINKS WITH THE JSON FILE'S CONTENT------------------------------------------------------
function jsonCreateLinks(sphereLinks,linkNames){
    for(let i=0;i<sphereLinks.length; i++){        //sphereLinks contain only the links which have to be created (without duplicates) 
        var indexSphere1 = findIndexSphere(sphereLinks[i][0]);  //index of the sphere which will be connected by the link
        var indexSphere2 = findIndexSphere(sphereLinks[i][1]);
        listSpheres2[indexSphere1].connectedSphere.push(listSpheres2[indexSphere1].name);  //update of the property connectedSphere for each sphere concerned by the creation of this link
        listSpheres2[indexSphere2].connectedSphere.push(listSpheres2[indexSphere2].name);
        listSpheres2[indexSphere1].connectedSphereName.push(listSpheres2[indexSphere2].label[0].name); //update of the property connectedSphereName for each sphere concerned by the creation of this link
        listSpheres2[indexSphere2].connectedSphereName.push(listSpheres2[indexSphere1].label[0].name);
        addLink(sphereLinks[i][0],sphereLinks[i][1],0,linkNames[i]); //creation of the link       
    }
}


//-------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------DOWNLOAD MAP .JSON-------------------------------------------------------------------
function download_file() {                        //fill .json file (careful with json punctuation)
    var json_spheres_arr = {};                    //first array : spheres data
    var json_links_arr = {};                      //second array : spheres connected data
    var json_string='{ "spheres" : [';            //add a kind of title before sphere data
    var json_str_links = '{ "connected sphere(s)" : [';//add a kind of title before connected spheres data
    for(let i=0;i<listSpheres2.length;i++){
        json_spheres_arr["sphere"] = listSpheres2[i].label[0].name;//first item in the list : sphere's name
        json_spheres_arr["position"] = listSpheres2[i].position ;//second item in the list : sphere's position
        for(let j=0;j<listSpheres2[i].connectedSphereName.length;j++){
            json_links_arr["sphere name"] = listSpheres2[i].connectedSphereName[j];//first item in the list : connected sphere's name
            json_links_arr["link name"] = listSpheres2[i].linkName[j];//second item in the list : link's name
            if(j<listSpheres2[i].connectedSphereName.length-1){
                json_str_links = json_str_links + JSON.stringify(json_links_arr) +',' ;// ',' separation if it not the last item to add
            }
            else{
                json_str_links = json_str_links + JSON.stringify(json_links_arr);
            }  
        }
        if(i<listSpheres2.length-1){
            json_string =  json_string + '[' + JSON.stringify(json_spheres_arr) + ','+ json_str_links  +']}],'+"\n" ;
        }
        else{
            json_string =  json_string + '[' + JSON.stringify(json_spheres_arr)+ ','+ json_str_links + ']}]' ;
        }  
        json_str_links = '{ "connected sphere(s)" : [';
    } 
   json_string = json_string + ']}';
   console.log("texte json",json_string);          //chek json string is ok 
    var file;
    var properties = {type: 'json'};               // Specify the file's type, json here
    try {
        // Specify the filename using the File constructor
        file = new File([json_string], "MindMap.json", properties);
    } catch (e) {
        // fall back to the Blob constructor if that isn't supported
        file = new Blob([json_string], properties);
    }
    var url = URL.createObjectURL(file);           //create file and download
    document.getElementById('link').href = url;
  }
//------------------------------------------------------------------------------------------------------------------------------
  
  