import React from "react";
import { Link } from "react-router-dom";

export default function SampleBox({sampleName,sampleDetail}) {
    
    
    return (
        <>
        <div class="sample-box">

            <div class="sample-left-box">
                    <h3 class="sample-box-name">{sampleName}</h3>
                    <p class="sample-box-detail">{sampleDetail}</p>
            </div>

            <ul class="button-ul">
                <li class="sample-box-button">
                    <Link to="/share" >
                        Share
                    </Link>
                </li>
                <li class="sample-box-button" onClick={Preview()}>
                        Preview
                </li>
                <li class="sample-box-button">
                    <Link to="/edit" >
                        Edit
                    </Link>
                </li>
            </ul>
        </div>
            
        </>
    );

}

function Preview(){
    console.log("Start Previewing.");
}