import React from "react";

const PictureCard = (url) => {
    return <div className="card">
        <img src={url} alt="bla" width="150" height="230"/>
        <button className="delete-btn">Delete</button>
    </div>
};

export default PictureCard;