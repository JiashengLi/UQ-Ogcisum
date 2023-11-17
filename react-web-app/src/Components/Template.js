import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";

function Template({ title, children,showArrow}) {
    return (
        <>
            <Header showArrow={showArrow}></Header>
            <main class="main">
                <h1 class="template-title">{title}</h1>
                
                {children}
                
            </main>
            <Footer></Footer>
        </>
    );
}

Template.propTypes = {
    title: PropTypes.string.isRequired,
};

export default Template;