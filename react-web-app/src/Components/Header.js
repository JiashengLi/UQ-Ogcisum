import React from "react";
import { Link } from "react-router-dom";

export default function Header({showArrow}) {
    
    
    return (//use the showArrow boolean to judge if show or hide the <- icon.
        <header className="page-header">
            {/* <Link to="/" class="back-arrow" id="back-arrow">
                <h1>←</h1>
            </Link> */}
            <Link to="/" class="web-logo">
                
                <h1 >{showArrow?"<-":""}Ogcisum</h1>
            </Link>
            <p class="header-text">Create & Share Samples, Listen in Mobile App!</p>
        </header>
    );

}