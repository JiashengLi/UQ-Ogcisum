import { Link } from "react-router-dom";
import Template from "../Components/Template";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { synth, guitar,piano ,french_horn,drums } from "../data/instruments";

//declare global variable
let GlobalRecordData = [];
let GlobalType = "";
let KeyArray = ["B","A","G","F","E","D","C"];
let GlobalSequence = new Array(16);

//declare global constance
const readSampleURL = "http://wmp.interaction.courses/api/v1/?apiKey=kwjkbKI2&mode=read&endpoint=samples";
const readSamplestoLocationsURL = "http://wmp.interaction.courses/api/v1/?apiKey=kwjkbKI2&mode=read&endpoint=samples_to_locations";
const readLocationsURL = "http://wmp.interaction.courses/api/v1/?apiKey=kwjkbKI2&mode=read&endpoint=locations";

  /**
     * this function will create the sample's information box.
     * @param {string} sampleid - the sample's id.
     * @param {string} sampleName - the sample's name.
     * @param {string} sampleDatetime - the sample's date & time.
     * @param {Tone} toneObject - the Tone.js plugin data.
     * @param {Tone} toneTransport - the Tone.js plugin data.
     * @param {Tone} tonePart - the Tone.js plugin data.
     * @returns {outerHTML} - the function will return a sample box's html code which will used in APP().
     */
function SampleBox({sampleid,sampleName,sampleDatetime,toneObject,toneTransport,tonePart}) {
  const initialpreview = false;
  const [previewing, setpreview] = useState(initialpreview);
    
  return (
      <>
      <div class="sample-box">

          <div class="sample-left-box">
                  <h3 class="sample-box-name">{sampleName}</h3>
                  <p class="sample-box-detail">{sampleDatetime}</p>
          </div>

          <ul class="button-ul share-ul">
              <li class="sample-box-button sample-box-preview" >
                <Preview previewing={previewing} setpreview={setpreview} toneObject={toneObject} toneTransport={toneTransport}/>
              </li>
          </ul>
      </div>
          
      </>
  );

}

/**
     * this function is going to create the preview button within Tonejs playing function.
     * @param {boolean} previewing - the status for whether preview button clicked.
     * @param {void} setpreview - the function to remote the previewing variable.
     * @param {Tone} toneObject - the Tone.js plugin data.
     * @param {Tone} toneTransport - the Tone.js plugin data.
     * @param {Tone} tonePart - the Tone.js plugin data.
     * @param {string} Sampleid - this sample's id.
     * @param {string} sampleRecord - this sample's recording data.
     * @param {string} sampleType - this sample's instrument type.
     * @returns {outerHTML} an preview button with functionality.
     */
function Preview({ previewing, setpreview, toneObject, toneTransport,tonePart, Sampleid }){
  

  /**
     * this function will control the preview status, which also use Tone.js function to play the music.
     * @param {} - this function doesn't require an argument.
     * @returns {} - this function returns nothing.
     */
  function SwitchPreviewStatus(){
    toneObject.start();
    toneTransport.stop();
      if(previewing) {
          setpreview(false);
          //alert("Preview stopped manually.");

      }
      else {                                      
          setpreview(true);
          const now = toneObject.now();
          const sequence = GlobalSequence;
          //alert("Preview started.");
          
         
          sequence.forEach((note, time) => {
            //console.log(time)
           
              if (GlobalType == "guitar"){
                guitar.triggerAttackRelease(note, "8n", now + (time/2) ); 
              }else if(GlobalType == "french_horn"){
                french_horn.triggerAttackRelease(note, "8n", now + (time/2)); 
              }else if(GlobalType == "piano"){
                piano.triggerAttackRelease(note, "8n", now + (time/2) ); 
              }else if(GlobalType == "drums"){
                drums.triggerAttackRelease(note, "8n", now + (time/2) ); 
              }
            
            
        });
      }
  }

  return <button onClick={() =>SwitchPreviewStatus()}>{previewing? "Stop" : "Preview"}</button>

}



/**
   * this function will create a share table, which contains the share & unshare function into different buttons.
   * @param {} - this function doesn't require an argument.
   * @returns {outerHTML} - this function returns the share table which contains the locations fetched in location API.
   */
function ShareTable(){
  let { id } = useParams();
  const initialLocation =[];
  const [locations, setLocation] = useState(initialLocation);

  const initialSampleToLocationData = []
  const [sampleToLocationData, setsampleToLocationData] = useState(initialSampleToLocationData)
  useEffect(() => {
    getLocations();
  }, []);

  /**
     * this function will fetch the location's data through the API and parse it into useful pieces.
     * @param {} - this function doesn't require an argument. 
     * @returns {} - the function will return nothing.
     */
  async function getLocations() {
    const location_response = await fetch(readLocationsURL);
    const location_json = await location_response.json();
    const locationData = location_json.locations;
    setLocation(locationData);


    const stl_response = await fetch(readSamplestoLocationsURL);
    const stl_json = await stl_response.json();
    const sampleToLocationData = stl_json.samples_to_locations;
    setsampleToLocationData(sampleToLocationData);
  }

  /**
     * this function will share the location through the sample id and location id to complete the API get request.
     * also, the button's style will changed after the successful request.
     * @param {string} locationid - the location's id which this sample will create a share link to.
     * @returns {} - the function will return nothing.
     */
  async function shareLocation(locationid){
    const ShareURL = `http://wmp.interaction.courses/api/v1/?apiKey=kwjkbKI2&mode=create&endpoint=samples_to_locations&sampleID=${id}&locationID=${locationid}`
    
    const res = await fetch(`${ShareURL}`, {
      method: "get",
    });
    if (res.ok){
      //alert(`Shared this sample to the location.`);
    }
    document.getElementById(`share-${locationid}`).style.background="var(--fgColor)";
    document.getElementById(`share-${locationid}`).style.color="var(--bgColor)";
    document.getElementById(`unshare-${locationid}`).style.background="var(--bgColor)";
    document.getElementById(`unshare-${locationid}`).style.color="var(--fgColor)";
  }

  /**
     * this function will unshare the location through the sample id and location id to complete the API get request.
     * also, the button's style will changed after the successful request.
     * @param {string} locationid - the location's id which this sample will create a unshare link to.
     * @returns {} - the function will return nothing.
     */
  async function unshareLocation(locationid){

    const stl_response = await fetch(readSamplestoLocationsURL);
    const stl_json = await stl_response.json();
    const sampleToLocationData = stl_json.samples_to_locations;
    setsampleToLocationData(sampleToLocationData);

    const targetIds = [];
    const targetData = sampleToLocationData.filter((data) =>{
      return ((data.locations_id == locationid) && (data.samples_id == id));
    })
    targetData.map((data) =>{
      targetIds.push(data.id);
    })
    //console.log(targetIds);

    for(let i=0;i<targetIds.length;i++){
      const UnshareURL = `http://wmp.interaction.courses/api/v1/?apiKey=kwjkbKI2&mode=delete&endpoint=samples_to_locations&id=${targetIds[i]}`
      //console.log(UnshareURL);
      const res = await fetch(`${UnshareURL}`, {
      method: "get",
      });
      if (res.ok){
        //console.log(`deleted ${targetIds[i]}`);
        //alert(`Unshared this sample to the location.`);
      }
    }
    document.getElementById(`unshare-${locationid}`).style.background="var(--fgColor)";
    document.getElementById(`unshare-${locationid}`).style.color="var(--bgColor)";
    document.getElementById(`share-${locationid}`).style.background="var(--bgColor)";
    document.getElementById(`share-${locationid}`).style.color="var(--fgColor)";
  }
  
  //console.table(locations);

    return(
      <>
        <table id="shareTable" class="shareTable">
        {locations.map((location) => (
            <tr class="location-info">
              <td class="location-name">
                  {location.location}
              </td>
              <td class="location-options">
                  <ul id={`${location.id}`}>
                    <li className="unshared-btn" id={`unshare-${location.id}`} onClick={() => unshareLocation(location.id)}>
                        Not Shared
                    </li>
                    <li className="shared-btn" id={`share-${location.id}`} onClick={() => shareLocation(location.id)}>
                        Shared
                    </li>
                  </ul>
              </td>
            </tr>                 
        ))}



        </table>
      </>
    )
     
}


/**
   * this function will parse the recording data from API or freshBtn() function, and get a parsed array which is useable for Tone.js play function.
   * @param {} - this function doesn't require an argument. 
   * @returns {} - the function will return nothing - the data will storaged by the useState method.
   */
function ShareSample({toneObject,toneTransport,tonePart}) {
  let { id } = useParams();
  const initialSample =[];
  const [sample, setSample] = useState(initialSample);


  useEffect(() => {
    getSample();
  }, []);

  async function getSample() {
      const response = await fetch(readSampleURL);
      const json = await response.json();
      //console.log(json)
      const sample = (json.samples).filter((_sample) =>{
          return _sample.id == id;
      });
      setSample(sample[0]);
      GlobalRecordData = JSON.parse(sample[0].recording_data);
      // console.table(GlobalRecordData);
      GlobalType = sample[0].type;
      
      parseRecordtoSequence();
  }
  //console.table(sample)


  return (
    <Template title={`Sharing This Sample:`} showArrow={true}>
      <SampleBox sampleid={id} sampleName={sample.name} sampleDatetime={sample.datetime} toneObject={toneObject} toneTransport={toneTransport} tonePart={tonePart}></SampleBox>
      <ShareTable sampleid={id}></ShareTable>
    </Template>
  );
}

  /**
     * this function will parse the recording data from API or freshBtn() function, and get a parsed array which is useable for Tone.js play function.
     * @param {} - this function doesn't require an argument. 
     * @returns {} - the function will return nothing - the data will storaged by the useState method.
     */
function parseRecordtoSequence(){

  //console.log((GlobalRecordData[2])["G"]);
  //let KeyArray = ["B","A","G","F","E","D","C"];
  for (let i=0;i<GlobalRecordData.length;i++){
    //console.log(`${KeyArray[i]}`)
    //console.log(GlobalRecordData[i][`${KeyArray[i]}`])
    for (let index=0;index<16;index++){
      if(GlobalRecordData[i][`${KeyArray[i]}`][index] == true){

        //console.log(`the message is true on index ${index}`)
        GlobalSequence[index] = `${KeyArray[i]}3`;

      }
    }
  }
  //console.log(GlobalSequence);
}

export default ShareSample;
