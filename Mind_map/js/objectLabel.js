
//--------------------------------------ADD SPHERES'SLABEL------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------

function addSphereLabel(sphere, nameLabel ){ 
    
    if (typeof nameLabel == "undefined") {         //if nameLabel is undefined, the sphere doesn't already have a label 
        nameLabel = fruits[sphere.name][0];        //an example of label will be suggest (at the beginning for example)
	}
    if (typeof(sphere.label[0]) != "undefined"){   //if the sphere's label is not undefined, the sphere already have a label (we have to delete it)
        var indexsphere = findIndexSphere(sphere.label[0].name); //index of the sphere which have a label
        world.remove(sphere.label[0]);              //the label of the sphere is deleted    
    }else{                                          
        var indexsphere = listSpheres2.length-1;    
    }
    listSpheres2[indexsphere].label=[];             //property label of the sphere must be empty to add another
	var loader = new THREE.FontLoader();            //loading of the font
    let font = loader.parse(fontJSON);              //fontJSON is define in police.js (it's the font used to created labels)
                                                    //JSON.parse function parses a character string (contents of the file police.js) in JSON format and constructs the JavaScript value of the object described by this string.
    var geometry = new THREE.TextGeometry(nameLabel, {font: font, size: 1, height: 0.1, material: 0, bevelThickness: 1, extrudeMaterial: 1});  //TextGeometry(text, parameters)
    var material = new THREE.MeshLambertMaterial({color: 0xF3FFE2}); //material of labels (color, ...)
    label1 = new THREE.Mesh(geometry, material);    //creation of the sphere's label
    label1.position.z = sphere.position.z ;         //set the position of the label near its sphere
    label1.position.y = sphere.position.y +1.5;
    label1.position.x = sphere.position.x -1;
    label1.name = nameLabel;
    listSpheres2[indexsphere].label.push(label1);   //add the label to each sphere is connected with  
    label1.lookAt( camera.position );               //Rotates the object to face the camera position
	world.add(label1);                              //add label to mind map ('world')
}


//-------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------ADD LINK LABEL------------------------------------------------------------
function addLinkLabel(link, nameLabel){ 
    if (typeof nameLabel == "undefined") {         //if nameLabel is not undefined, the sphere already have a label (we have to delete it)
        nameLabel = preexistinglinks[0];           //an example of label will be suggest (at the beginning for example)
	}
    if (typeof(link.label[0]) != "undefined"){     //the rest of this function works in the same way of the function addSphereLabel 
        world.remove(link.label[0]);
    }  
    for(let i=0; i<listLink.length; i++){          //for loop to search to number of the link by knowing its name
        if (listLink[i].name == link.name){
            indexLink = i;
        }
    }                                              
	var loader = new THREE.FontLoader();           //loading of the font
    let font = loader.parse(fontJSON);             //fontJSON is define in police.js (it's the font used to created labels)
    var geometry = new THREE.TextGeometry(nameLabel, {font: font, size: 0.8, height: 0.1, material: 0, bevelThickness: 1, extrudeMaterial: 1});  //TextGeometry(text, parameters)
    var material = new THREE.MeshLambertMaterial({color: 0xD588E0});//material of labels (color, ...)
    linkLabel = new THREE.Mesh(geometry, material);//creation of the link's label
    linkLabel.position.z = link.middleposition[2]; //set the position of the label in the middle of the link
    linkLabel.position.y = link.middleposition[1];
    linkLabel.position.x = link.middleposition[0];
    linkLabel.name = nameLabel;                     
    world.add(linkLabel);
    linkLabel.lookAt( camera.position );            //Rotates the object to face the camera position
    listLink[indexLink].label.push(linkLabel);      //add the label objet in the poperty 'label' of the link 
    if(listLink[indexLink].label.length>1){         
        listLink[indexLink].label.splice(0,1);      //deletes the old label of the link if it has one before
    }  
}