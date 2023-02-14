import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import classes from "./ProjectPage.module.css";
import Audio from "../../ui/Audio/Audio";
import MicIcon from "./icons/mic.svg"
import MicIconFrame1 from "./icons/mic1.svg"
import MicIconFrame2 from "./icons/mic2.svg"
import MicIconFrame3 from "./icons/mic3.svg"
import EditIcon from "./icons/edit.svg"
import ApplyIcon from "./icons/apply.svg"
import PosterIcon from "./icons/image.svg"
import Button from "../../ui/Button/Button";
import {useAppDispatch, useAppSelector} from "../../../hoc/redux";
import {addAudio, addPoster, fetchProject, updateProject} from "../../../store/reducers/ProjectActions";
import Input from "../../ui/Input/Input";
import {useInput} from "../../../hoc/useInput";
import Poster from "../../ui/Poster/Poster";
import Modal from "../../ui/Modal/Modal";

const icons = [
    MicIcon,
    MicIconFrame1,
    MicIconFrame2,
    MicIconFrame3,
]

const ProjectPage = () => {
    const {projects} = useAppSelector(state => state.projectReducer);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (!projects.length) {
            dispatch(fetchProject(id!));
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Your browser does not support recording!');
        }
    }, []);
    const {id} = useParams<string>();
    const mediaRecorderRef = useRef<MediaRecorder>();
    const refAudioContext = useRef<AudioContext>(new (window.AudioContext || window.webkitAudioContext)());
    const [chunks, setChunks] = useState<BlobPart[]>([]);
    const [start, setStart] = useState(false);
    const [recording, setRecording] = useState(false);
    const [index, setIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timer>();
    const [isEditingTitle, setEditingTitle] = useState(false);
    const [isEditingCategory, setEditingCategory] = useState(false);
    const project = projects.find(project => project.id === id);
    const title = useInput(project?.title!, {checkEmpty: true, minLength: 4, fieldName: 'title', maxLength: 40});
    const category = useInput(project?.category!, {checkEmpty: true, minLength: 2, fieldName: 'category', maxLength: 20});
    const [widthTitle, setWidthTitle] = useState(0);
    const [widthCategory, setWidthCategory] = useState(0);
    const titleRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}
    const timeCreated = new Date(project?.timeCreated!);
    const timeModified = new Date(project?.timeModified!);
    const [active, setActive] = useState(false);

    useEffect(() => {
        title.setValue(project?.title!);
        category.setValue(project?.category!);
    }, [project]);
    const handleRecord = () => {
        setRecording(recording => !recording);
        if (timerRef.current == undefined) {
            const timerId = setInterval(() => {
                setIndex(index => index + 1);
            }, 500);
            timerRef.current = timerId;
        } else {
            clearInterval(timerRef.current);
            setIndex(0);
            timerRef.current = undefined;
        }

        if (mediaRecorderRef.current == null) {
            navigator.mediaDevices.getUserMedia({audio: true})
                .then((stream) => {
                    const newRecorder =  new MediaRecorder(stream);
                    newRecorder.start();
                    newRecorder.onstop = stopRecording;
                    newRecorder.ondataavailable = (e) => {
                        chunks.push(e.data);
                        setChunks(chunks => [...chunks, e.data]);
                    };
                    mediaRecorderRef.current = newRecorder;
                })
                .catch((err) => {
                    console.error(err);
                })
        } else {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = undefined;
            setRecording(false);
            setStart(false);
        }
    }

    const stopRecording = () => {
        const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus;" });
        dispatch(addAudio({blob, lessonId: id+''}));
        setChunks([]);
    }

    useEffect(() => {
        if (titleRef.current?.offsetWidth !== 0)
            setWidthTitle(titleRef.current?.offsetWidth!);
    },[title]);

    useEffect(() => {
        if (categoryRef.current?.offsetWidth !== 0)
            setWidthCategory(categoryRef.current?.offsetWidth!);
    },[category]);


    const editInfo = () => {
        if (category.isValid() && title.isValid()) {
            dispatch(updateProject({id: project!.id, title: title.value, category: category.value}))
            setEditingTitle(false);
            setEditingCategory(false);
        } else {
            title.displayErrors();
            category.displayErrors();
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        if (!e.target.files) return;

        dispatch(addPoster({projectId: project?.id!, fileImg: e.target.files[0]}));
        setActive(false);
    }

    return (
        <div className={classes.page}>
            <div>
                {
                    (project?.posterUrl !== undefined && project?.posterUrl !== null) ?
                    <Poster posterUrl={project?.posterUrl} projectId={id!} posterPosition={Number(project?.posterPosition!)}/>
                        :
                        <></>
                }
            </div>
            <div className={classes.container}>
                <div className={classes.info}>
                    <div className={classes.block}>
                        Category:&nbsp;
                        {
                            !isEditingCategory ? (
                                <>
                                    <div ref={categoryRef} className={classes.italicBold}>
                                        {category.value}
                                    </div>
                                    <img src={EditIcon} className={classes.editIcon} onClick={() => setEditingCategory(true)}/>
                                </>
                            ) : (
                                <>
                                    <div ref={categoryRef} style={{position: "absolute", opacity: "0", left: "-99999px"}}>{category.value}</div>
                                    <Input defaultValue={category.value}
                                           className={classes.categoryEdit}
                                           style={{width: widthCategory}}
                                           onChange={category.onChange}
                                           onBlur={category.onBlur}
                                           isDirty={category.isDirty}
                                           errors={category.valid}
                                           errorsTop={25}
                                           errorsWidth={300}
                                           autoFocus/>
                                    <img src={ApplyIcon} className={classes.editIcon} onClick={editInfo}/>
                                </>
                            )
                        }
                    </div>
                    <div className={classes.block}>
                        Created: {timeCreated.toLocaleString("ru-RU", options)}
                    </div>
                    <div className={classes.block}>
                        Last modified: {timeModified.toLocaleString("ru-RU", options)}
                    </div>
                </div>
                <div className={classes.main}>
                    {
                        !(project?.posterUrl !== undefined && project?.posterUrl !== null) ?
                            <div className={classes.addPosterBtn} onClick={() => setActive(true)}>
                                <img src={PosterIcon} className={classes.iconPoster}/>
                                <div>Add poster</div>
                            </div>
                            :
                            <></>
                    }
                    <div className={classes.title}>
                        {
                            !isEditingTitle ? (
                                <>
                                    <div ref={titleRef}>
                                        {title.value}
                                    </div>
                                    <img src={EditIcon} className={classes.editIcon} onClick={() => setEditingTitle(true)}/>
                                </>
                            ) : (
                                <>
                                    <div ref={titleRef} style={{position: "absolute", opacity: "0", left: "-99999px"}}>{title.value}</div>
                                    <Input defaultValue={title.value}
                                           className={classes.titleEdit}
                                           style={{width: widthTitle}}
                                           onChange={title.onChange}
                                           onBlur={title.onBlur}
                                           isDirty={title.isDirty}
                                           errors={title.valid}
                                           errorsTop={25}
                                           errorsWidth={300}
                                           autoFocus/>
                                    <img src={ApplyIcon} className={classes.editIcon} onClick={editInfo}/>
                                </>
                            )
                        }
                    </div>
                    {
                        project?.audios?.map(audio => <Audio key={audio.id} audioUrl={audio.url} audioId={audio.id} audioContext={refAudioContext.current}/>)
                    }
                    {active &&
                        <Modal setActive={setActive}>
                            <input type='file' accept="image/png, image/jpeg" onChange={handleChange}/>
                            <div className={classes.hintModal}>Images wider than 1500 pixels will be displayed better</div>
                        </Modal>
                    }
                    <div className={classes.new}>
                        {!start ? <Button text="Add new record" onClick={() => setStart(true)}/> :
                            <div className={classes.mic}>
                                <div className={classes.iconHolder}>
                                    <img src={icons[index % icons.length]}
                                         className={classes.icon}
                                         onClick={handleRecord}/>
                                </div>
                                Click mic to {!recording ? 'start' : 'stop'} recording
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;
