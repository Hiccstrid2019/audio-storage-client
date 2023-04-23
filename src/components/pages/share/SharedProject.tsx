import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import classes from "./SharedProject.module.css";
import Audio from "../../ui/Audio/Audio";
import Poster from "../../ui/Poster/Poster";
import {ISharedProject} from "../../../models/IProject";
import ProjectService from "../../../services/ProjectService";
import Error from "../../ui/Error/Error";


const SharedProject = () => {
    const [project, setProject] = useState<ISharedProject>();
    const [error, setError] = useState();
    const {id} = useParams<string>();

    useEffect(() => {
        ProjectService.fetchSharedProject(id!)
            .then(project => setProject(project.data))
            .catch(error => setError(error.response.status));
    }, []);

    const refAudioContext = useRef<AudioContext>(new (window.AudioContext || window.webkitAudioContext)());
    const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}
    const timeCreated = new Date(project?.timeCreated!);
    const timeModified = new Date(project?.timeModified!);

    const [volumeLevel, setVolumeLevel] = useState(50);

    if (error) {
        return <Error error={error}/>
    }

    return (
        <div className={classes.page}>
            <div>
                {
                    (project?.posterUrl !== undefined && project?.posterUrl !== null) ?
                        <Poster posterUrl={project?.posterUrl} projectId={id!} editable={false} posterPosition={Number(project?.posterPosition!)}/>
                        :
                        <></>
                }
            </div>
            <div className={classes.container}>
                <div className={classes.info}>
                    <div className={classes.block}>
                        Category:&nbsp;
                        <div className={classes.italicBold}>
                            {project?.category}
                        </div>
                    </div>
                    <div className={classes.block}>
                        Created: {timeCreated.toLocaleString("ru-RU", options)}
                    </div>
                    <div className={classes.block}>
                        Last modified: {timeModified.toLocaleString("ru-RU", options)}
                    </div>
                    <div className={classes.block}>
                        Author: {project?.author}
                    </div>
                </div>
                <div className={classes.main}>
                    <div className={classes.title}>
                        {project?.title}
                    </div>
                    {
                        project?.audios?.map(audio => <Audio key={audio.id}
                                                                     audioUrl={audio.url}
                                                                     audioId={audio.id}
                                                                     audioContext={refAudioContext.current}
                                                                     volumeLevel={volumeLevel}
                                                                     setVolumeLevel={setVolumeLevel}/>)
                    }

                </div>
            </div>
        </div>
    );
};

export default SharedProject;
