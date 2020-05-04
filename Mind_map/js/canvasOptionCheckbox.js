
//-------------------------------------------SHOW GRID HELPER-----------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//The "Grid" functionality allows the user to add a grid to better visualize his concept map in three dimensions. 

function showGridHelper() { 
    var x = document.getElementById("myCheck");	       //the id 'myCheck' refers to the 'Grid' checkbox	in Mind_map.html
    if(x.checked==true){                               //if checkbox 'Grid' is checked, the value will be of x.checked will be true.
        gridHelper.visible = true;                     //show the grid
    }else{                                             //if checkbox 'Grid' is not checked, the value will be of x.checked will be false.
        gridHelper.visible = false ;                   //to make the grid invisible 
    }
    render();                                          //to view the changes in the three-dimensional concept map editor
}


//-------------------------------------------SHOW SPHERES'S label-----------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------
//The “Label” functionality allows the user to add legends from all the spheres of the concept map. It can also make them invisible.

function showLabel() { 
    var x = document.getElementById("label");  	       //the id 'label' refers to the 'Label' checkbox in Mind_map.html	
    if(x.checked==true){                               //if checkbox 'Label' is checked, the value will be of x.checked will be true.
        for(let i=0;i<listSpheres2.length;i++){       
            listSpheres2[i].label[0].visible = true;   //show spheres's label of listSphere2 
        }
        
    }else{                                             //if checkbox 'label' is not checked, the value will be of x.checked will be false.
        for(let i=0;i<listSpheres2.length;i++){
            listSpheres2[i].label[0].visible = false;  //to make spheres's label of listSphere2 invisible
        }
    }
    render();                                           //to view the changes in the three-dimensional concept map editor
  }

//-----------------------------------------AUTO-ROTATE-------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
//these two functions allow the user to be able to observe his concept map from all these angles without having to move his mouse

function autoRotate(){
    var x = document.getElementById("autoRotate");		
    if(x.checked==true){                               //if checkbox 'autoRotate' is checked, the value will be of x.checked will be true.
        rotateworld();                                 // so we call the rotateworld function 
    }
}

function rotateworld() {
    requestAnimationFrame(render);                     //the positions according to the X, Y and Z axes of the “World” object 
    world.rotation.x -= 0.007 * 2;                     //are modified every 25 milliseconds 
    world.rotation.y += 0.007;                         //thanks to changes in property values world.rotate.x, 
    world.rotation.z -= 0.007 * 3;                     //world.rotate.y and world.rotate.z
    for(let i=0;i<listSpheres2.length;i++){
        listSpheres2[i].label[0].lookAt( camera.position );  //The program forces spheres's label to stay towards the camera (ie towards the user) 
                                                             //so that they remain clearly visible in function of the position of the camera.
    }
    for(let j=0;j<listLink.length;j++){
        listLink[j].label[0].lookAt( camera.position );       //the same for the links's label
    }

    renderer.render(scene, camera);                     //to view the changes in the three-dimensional concept map editor
    setTimeout(() => {autoRotate();  }, 25);            //The autoRotate () function is called every 25 milliseconds thanks to the setTimeout function as long as the checkbox is checked
}


