import React from "react";
import './home-page.styles.css';
import { useEffect } from "react";
import { useState } from "react";
import environments from "../../enviroments/enviroments";

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [fileState, setFileState] = useState(null);
    const [listState, setListState] = useState(null);

    var AWS = require('aws-sdk');

    AWS.config.update({
        accessKeyId: environments.ACCESS,
        secretAccessKey: environments.SECRET,
    });

    var s3 = new AWS.S3();

    const getBucket = async () => {
        var params = {
            Bucket: environments.BUCKET_NAME, 
        };
        s3.listObjects(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
            setListState(data.Contents);
            }
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    useEffect(() => {
        getBucket();
    }, [])

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileState(file);
    };

    const uploadToBucket = async () => {
        var params = {
            Body: fileState, 
            Bucket: environments.BUCKET_NAME, 
            Key: fileState.name
            };
        s3.putObject(params, function(err, fileState) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(fileState);           // successful response
        });

        getBucket();
    };

    const deleteImage = async (event) => {
        const key = event.currentTarget.id;

        var params = {
            Bucket: environments.BUCKET_NAME, 
            Key: key
           };
        s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });

        const filteredArray = listState.filter(item => {return (item.Key !== key)});
        setListState(filteredArray);
    }

    return isLoading ? (
        null
    ) : (
    <div>
        <input className="file-input" type="file" onChange={handleFileChange}></input>
        <button className="upload-btn" onClick={uploadToBucket}>Upload to bucket</button>

        <div className='files-container'>
            {listState.map((file) => {
                var params = {Bucket: 'shovi21', Key: file.Key};
                var url = s3.getSignedUrl('getObject', params);
                console.log(url);
                return (
                    <div key={file.Key} className="card">
                        <img src={url} alt="bla" className="card-img" width="250" height="250"/>
                        <div class="button-container">
                            <button id={file.Key} className="delete-btn" onClick={deleteImage}>Delete</button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
    )
};

export default HomePage;