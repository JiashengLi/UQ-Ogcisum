import { Link } from "react-router-dom";
import Template from "../Components/Template";
import { useState, useEffect } from "react";
import { synth, guitar,piano ,french_horn,drums } from "../data/instruments";


//declare global variable
let KeyArray = ["B","A","G","F","E","D","C"];
let GlobalSequence = new Array(16);

//declare global constance
const readSampleURL = "http://wmp.interaction.courses/api/v1/?apiKey=kwjkbKI2&mode=read&endpoint=samples"
const readSamplestoLocationsURL = "http://wmp.interaction.courses/api/v1/?apiKey=kwjkbKI2&mode=read&endpoint=samples_to_locations"


  /**
     * this function will create an sample's information box for each sample.
     * @param {string} sampleId - the sample's id.
     * @param {string} sampleType - the sample's instrument type.
     * @param {string} sampleName - the sample's name.
     * @param {string} sampleDetail - the sample's date & time.
     * @param {string} sampleRecord - the sample's recording data, in string type.
     * @param {Tone} toneObject - the Tone.js plugin data.
     * @param {Tone} toneTransport - the Tone.js plugin data.
     * @param {Tone} tonePart - the Tone.js plugin data.
     * @returns {outerHTML} - the function will return a sample box's html code which will used in APP().
     */
function SampleBox({sampleId,sampleType,sampleName,sampleDetail,sampleRecord,toneObject,toneTransport,tonePart}) {
  const initialpreview = false;
  const [previewing, setpreview] = useState(initialpreview);

  const initialshareStatus = []
  const [shareStatus, setshareStatus] = useState(initialshareStatus);

  useEffect(() => {
    getShareStatus(sampleId);
  }, []);

    /**
     * this function will fetch the sample_to_location data via the sample id.
     * then this function will judge if the sample_to_location data is empty, which will change the "share" button's text.
     * @param {string} sampleid - this sample's id
     * @returns {} - this function returns nothing.
     */
  async function getShareStatus(sampleid){
    const stl_response = await fetch(readSamplestoLocationsURL);  
    const stl_json = await stl_response.json();
    const shareStatus = stl_json.samples_to_locations;
    const filtedshareStatus = shareStatus.filter((data) =>{
      return (data.samples_id == sampleid)
    })
    setshareStatus(filtedshareStatus);
  }

  //console.log(`the share status of ${sampleId}:`)
  //console.log(shareStatus);
  return (
      <>
      <div class="sample-box">

          <div class="sample-left-box">
                  <h3 class="sample-box-name">{sampleName}</h3>
                  <p class="sample-box-detail">{sampleDetail}</p>
          </div>

          <ul class="button-ul">
              <li class="sample-box-button">
                  <Link to={`/share/${sampleId}`} >
                      {shareStatus.length == 0?"Share":"Shared"}
                  </Link>
              </li>
              <li class="sample-box-button sample-box-preview" >
                  <Preview previewing={previewing} setpreview={setpreview} sampleType={sampleType} sampleRecord={sampleRecord} toneObject={toneObject} toneTransport={toneTransport} tonePart={tonePart}/>
              </li>
              <li class="sample-box-button edit-btn">
                  <Link to={`/edit/${sampleId}`} >
                      Edit
                  </Link>
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
function Preview({ previewing, setpreview, toneObject, toneTransport,tonePart, Sampleid ,sampleRecord,sampleType}){
  const recordinBox = JSON.parse(sampleRecord);
  const typeinBox = sampleType;

    /**
     * this function will control the preview status, which also use Tone.js function to play the music.
     * @param {} - this function doesn't require an argument.
     * @returns {} - this function returns nothing.
     */
  function SwitchPreviewStatus(){
    //console.log(recordinBox)
    parseRecordtoSequence(recordinBox);
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
           
              if (typeinBox == "guitar"){
                guitar.triggerAttackRelease(note, "8n", now + (time/2) ); 
              }else if(typeinBox == "french_horn"){
                french_horn.triggerAttackRelease(note, "8n", now + (time/2)); 
              }else if(typeinBox == "piano"){
                piano.triggerAttackRelease(note, "8n", now + (time/2) ); 
              }else if(typeinBox == "drums"){
                drums.triggerAttackRelease(note, "8n", now + (time/2) ); 
              }
            
            
        });
      }
  }

  return <button onClick={() =>SwitchPreviewStatus()}>{previewing? "Stop" : "Preview"}</button>
}


  /**
     * this function will create the whole webpage which also be the export elements.
     * @param {Tone} toneObject - the Tone.js plugin data.
     * @param {Tone} toneTransport - the Tone.js plugin data.
     * @param {Tone} tonePart - the Tone.js plugin data.
     * @returns {outerHTML} - the whole webpage's HTML code.
     */
function App({toneObject,toneTransport,tonePart}) {

        const initialSample =[];
        const [samples, setSample] = useState(initialSample);

        
        useEffect(() => {
          getSample();
        }, []);

        /**
           * this function will fetch the sample's data through the API and parse it into useful pieces.
           * @param {} - this function doesn't require an argument. 
           * @returns {} - the function will return nothing - the data will storaged by the useState method.
           */
        async function getSample() {
            const response = await fetch(readSampleURL);
            const json = await response.json();
            //console.log(json);
            const data = json.samples;
            let samples = []
            data.map((sample) =>{
              samples.push({id:sample.id,type:sample.type,name:sample.name,datetime:sample.datetime,recording_data:sample.recording_data})
            })
            setSample(samples);
        }
        //console.log(samples);

  return (
    <Template title="Sample You've Created" showArrow={false}>
      <div class="sample-container">
            {samples.map((sample) =>(
              <SampleBox key={sample.id} sampleId={sample.id} sampleType={sample.type} sampleName={sample.name} sampleDetail={sample.datetime} sampleRecord={sample.recording_data} toneObject={toneObject} toneTransport={toneTransport} tonePart={tonePart}></SampleBox>
            ))}
            
            <div class="sample-creator">
                <Link to={`/create`} class="creator-button">
                  Create Sample
                </Link>
            </div>
            
      </div>
            
    </Template>
  );
}


/**
   * this function will parse the recording data from API or freshBtn() function, and get a parsed array which is useable for Tone.js play function.
   * @param {} - this function doesn't require an argument. 
   * @returns {} - the function will return nothing - the data will storaged by the useState method.
   */
function parseRecordtoSequence(Record){

  //console.log((GlobalRecordData[2])["G"]);
  //let KeyArray = ["B","A","G","F","E","D","C"];
  for (let i=0;i<Record.length;i++){
    //console.log(`${KeyArray[i]}`)
    //console.log(GlobalRecordData[i][`${KeyArray[i]}`])
    for (let index=0;index<16;index++){
      if(Record[i][`${KeyArray[i]}`][index] == true){

        //console.log(`the message is true on index ${index}`)
        GlobalSequence[index] = `${KeyArray[i]}3`;

      }
    }
  }
  //console.log(GlobalSequence);
}

export default App;
