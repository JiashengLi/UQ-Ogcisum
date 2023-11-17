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

//declare global constant
const readSampleURL = "http://wmp.interaction.courses/api/v1/?apiKey=kwjkbKI2&mode=read&endpoint=samples";


/**
     * this function is going to create the sample box with name input, preview and save button in the page.
     * @param {string} Sampleid - this sample's id.
     * @param {Tone} toneObject - the Tone.js plugin data.
     * @param {Tone} toneTransport - the Tone.js plugin data.
     * @param {Tone} tonePart - the Tone.js plugin data.
     * @returns {outerHTML} an formatted HTML code which spawn the editheader.
     */
function EditHeader({Sampleid,toneObject,toneTransport,tonePart}){

  const initialpreview = false;
  const [previewing, setpreview] = useState(initialpreview);


  return(
    <>
      <div class={"edit-header"} id={Sampleid}>

          <input id="name-input" class="dynapuff-text" type="text" placeholder="Enter the Sample Name..."></input>
          <Preview previewing={previewing} setpreview={setpreview} toneObject={toneObject} toneTransport={toneTransport}/>
          <Save Sampleid={Sampleid}></Save>
          
      </div>
    </>
  )
}


/**
     * this function is going to create the preview button within Tonejs playing function.
     * @param {boolean} previewing - the status for whether preview button clicked.
     * @param {void} setpreview - the function to remote the previewing variable.
     * @param {Tone} toneObject - the Tone.js plugin data.
     * @param {Tone} toneTransport - the Tone.js plugin data.
     * @param {Tone} tonePart - the Tone.js plugin data.
     * @param {string} Sampleid - this sample's id.
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

  return <button class="edit-header-preview" onClick={() =>SwitchPreviewStatus()}>{previewing? "Stop" : "Preview"}</button>
}


/**
     * this function is going to create the save button within node fetch & POST function.
     * @param {string} Sampleid - this sample's id.
     * @returns {outerHTML} an save button with functionality.
     */
function Save({Sampleid}){

  /**
     * this function will be a onClick function for this button. It will use POST method to upload the global variable onto API.
     * @param {}  - this function doesn't require an argument.
     * @returns {} - this function returns nothing.
     */
  async function postSample(){
    const postType = GlobalType;
    const postName = document.getElementById("name-input").value;
    const PostURL = `http://wmp.interaction.courses/api/v1/?apiKey=kwjkbKI2&mode=update&endpoint=samples&sampleType=${postType}&sampleName=${postName}&id=${Sampleid}`;
    //console.log(PostURL);

    const postData = GlobalRecordData;

    //console.log(postData);
    if(postName == ""){
      alert("Name cannot be blank. Try again.")
    }else{
      const res = await fetch(`${PostURL}`, {
        method: "post",
        body: JSON.stringify(postData),
      });
      if(res.ok){
        alert(`Updated ${postName} Successfully.`);
        window.location.href="/";
      }
    }

  }
  return <button class="edit-header-save" onClick={() =>postSample()}>Save</button>
}


/**
     * this function is going to create a 16*7 sequence editor with keys, as well as a instrument type selector
     * @param {}  - this function doesn't require an argument.
     * @returns {outerHTML} the whole sequence editor with a 7*16 keybar and a instrument type selector list.
     */
function SequenceEditor(){
  let { id } = useParams();
  const initialRecords =[];
  const [RecordData, setRecordData] = useState(initialRecords);

  GlobalRecordData = RecordData;
  
  useEffect(() => {
    parseRecordData();
  }, []);

  /**
     * this function is going to parse the data from API, using JSON.parse() to parse string to json format for further use.
     * @param {}  - this function doesn't require an argument.
     * @returns {} - this function returns nothing.
     */
  async function parseRecordData(){
      const response = await fetch(readSampleURL);
      const json = await response.json();
      const data = (json.samples).filter((_sample) =>{
        return _sample.id == id;
    });
    setRecordData(JSON.parse(data[0].recording_data));
  }

  //console.log(GlobalRecordData);


  /**
     * this function is going to change the instrument type by changing the global variable. 
     * Also the selector's css style will changed once user choose any type.
     * @param {string} type- the type name of selected instruemnt.
     * @returns {} - this function returns nothing.
     */
  function ChangeType(type){
      //console.log(type);
      GlobalType = type;
      freshBtn("instruments");
      document.getElementById(GlobalType+"-btn").style.background='var(--fgColor)';
      document.getElementById(GlobalType+"-btn").style.color='var(--bgColor)';
  }


  /**
     * this function is going to change the instrument recording data by clicking sequence keybar.
     * Also the keybar's css style will changed once user choose any key.
     * @param {int} index - the x coordinate of the keybar - that means the queue of the recording data.
     * @param {string} key - the y coordinate of the keybar - that decides the level of sequence.
     * @returns {} - this function returns nothing.
     */
  function EditRecordingData(index,Key){
    //console.log(`Editing-index:${index} Key:${Key} in index ${KeyArray.indexOf(`${Key}`)}`);
    freshBtn("keys",index);
    document.getElementById(Key+index).style.background='var(--fgColor)';

    freshBtn("data",index,Key);
    GlobalRecordData[KeyArray.indexOf(`${Key}`)][`${Key}`][index] = true;
    //console.log(GlobalRecordData[KeyArray.indexOf(`${Key}`)]);
    parseRecordtoSequence();
    //console.log(GlobalRecordData);
  }


  return(
    <>
    <div class="editor-container">
        <div class="instrument-selector">
              <h4 class="dynapuff-text">Type</h4>

              <div class="instrument-selections">
                  <button value="piano" id="piano-btn" onClick={() =>ChangeType("piano")}>Piano</button>
                  <button value="french_horn" id="french_horn-btn" onClick={() =>ChangeType("french_horn")}>French Horn</button>
                  <button value="guitar" id="guitar-btn" onClick={() =>ChangeType("guitar")}>Guitar</button>
                  <button value="drums" id="drums-btn" onClick={() =>ChangeType("drums")}>Drums</button>
              </div>
              
        </div>
        <div class="sequence-keys">
            {RecordData.map((key) =>(
              <>
                  <div class="key-selector">
                      <h4 class="dynapuff-text">{Object.keys(key)}</h4>
                      <div className="keys">
                        <div onClick={() =>EditRecordingData(0,Object.keys(key))} className={`key key-0`} id={`${Object.keys(key)}0`}></div>
                        <div onClick={() =>EditRecordingData(1,Object.keys(key))} className={`key key-1`} id={`${Object.keys(key)}1`}></div>
                        <div onClick={() =>EditRecordingData(2,Object.keys(key))} className={`key key-2`} id={`${Object.keys(key)}2`}></div>
                        <div onClick={() =>EditRecordingData(3,Object.keys(key))} className={`key key-3`} id={`${Object.keys(key)}3`}></div>
                        <div onClick={() =>EditRecordingData(4,Object.keys(key))} className={`key key-4`} id={`${Object.keys(key)}4`}></div>
                        <div onClick={() =>EditRecordingData(5,Object.keys(key))} className={`key key-5`} id={`${Object.keys(key)}5`}></div>
                        <div onClick={() =>EditRecordingData(6,Object.keys(key))} className={`key key-6`} id={`${Object.keys(key)}6`}></div>
                        <div onClick={() =>EditRecordingData(7,Object.keys(key))} className={`key key-7`} id={`${Object.keys(key)}7`}></div>
                        <div onClick={() =>EditRecordingData(8,Object.keys(key))} className={`key key-8`} id={`${Object.keys(key)}8`}></div>
                        <div onClick={() =>EditRecordingData(9,Object.keys(key))} className={`key key-9`} id={`${Object.keys(key)}9`}></div>
                        <div onClick={() =>EditRecordingData(10,Object.keys(key))} className={`key key-10`} id={`${Object.keys(key)}10`}></div>
                        <div onClick={() =>EditRecordingData(11,Object.keys(key))} className={`key key-11`} id={`${Object.keys(key)}11`}></div>
                        <div onClick={() =>EditRecordingData(12,Object.keys(key))} className={`key key-12`} id={`${Object.keys(key)}12`}></div>
                        <div onClick={() =>EditRecordingData(13,Object.keys(key))} className={`key key-13`} id={`${Object.keys(key)}13`}></div>
                        <div onClick={() =>EditRecordingData(14,Object.keys(key))} className={`key key-14`} id={`${Object.keys(key)}14`}></div>
                        <div onClick={() =>EditRecordingData(15,Object.keys(key))} className={`key key-15`} id={`${Object.keys(key)}15`}></div>
                      </div>
                      
                  </div>
                  
              </>
             
            ))}
            
        </div>
    </div>
    
    </>
  )
}



  /**
     * this function will create the whole webpage which also be the export elements.
     * @param {Tone} toneObject - the Tone.js plugin data.
     * @param {Tone} toneTransport - the Tone.js plugin data.
     * @param {Tone} tonePart - the Tone.js plugin data.
     * @returns {outerHTML} - the whole webpage's HTML code.
     */
export default function EditSample({toneObject,toneTransport,tonePart}) {
  let { id } = useParams();
  const initialSample =[];
  const [sample, setSample] = useState(initialSample);


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
      //console.log(json)
      const sample = (json.samples).filter((_sample) =>{
          return _sample.id == id;
      });
      setSample(sample[0]);
      GlobalRecordData = JSON.parse(sample[0].recording_data);
      //console.table(GlobalRecordData);
      GlobalType = sample[0].type;

      parseRecordtoSequence();
  }



  return (
    <Template title={`Editing This Sample:`} showArrow={true}>
            <EditHeader Sampleid={id} toneObject={toneObject} toneTransport={toneTransport} tonePart={tonePart}></EditHeader>
            <SequenceEditor></SequenceEditor>
            
    </Template>
  );
}


  /**
     * this function will active change the css style and global variables, in several situations.
     * @param {string} type - the type name of the usage situation.
     * @param {int} index - for keys situation, this parameter shows the index of selected key.
     * @returns {} - the function will return nothing - the data will storaged by the useState method.
     */
function freshBtn(type,index){
  if (type === "instruments"){
      document.getElementById("piano-btn").style.background='var(--bgColor)';
      document.getElementById("piano-btn").style.color='var(--fgColor)';
      document.getElementById("french_horn-btn").style.background='var(--bgColor)';
      document.getElementById("french_horn-btn").style.color='var(--fgColor)';
      document.getElementById("guitar-btn").style.background='var(--bgColor)';
      document.getElementById("guitar-btn").style.color='var(--fgColor)';
      document.getElementById("drums-btn").style.background='var(--bgColor)';
      document.getElementById("drums-btn").style.color='var(--fgColor)';
  }else if (type === "keys"){
    for(let i=0;i<7;i++){
      document.getElementsByClassName(`key-${index}`)[i].style.background="var(--bgColor)";
    }
  }else if (type === "data"){
    for(let i=0;i<7;i++){
      
      (GlobalRecordData[i][KeyArray[i]])[index] = false;
      //console.log(GlobalRecordData[i][KeyArray[i]][index])
    }
  }
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