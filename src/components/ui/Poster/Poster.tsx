import React, {useState} from 'react';
import classes from "./Poster.module.css";
import Modal from "../Modal/Modal";
import {addPoster, changePosterPosition} from "../../../store/reducers/ProjectActions";
import {useAppDispatch} from "../../../hoc/redux";
import {useMatchMedia} from "../../../hoc/useMatchMedia";

interface PosterProps {
    posterUrl: string;
    projectId: string;
    posterPosition: number;
}

const Poster = ({posterUrl, projectId, posterPosition}: PosterProps) => {
    const [active, setActive] = useState(false);
    const dispatch = useAppDispatch();
    const [repositionActive, setRepositionActive] = useState(false);
    const [position, setPosition] = useState(posterPosition);
    const [isMoving, setMoving] = useState(false);
    const [yOffset, setYOffset] = useState(0);
    const {isMobile} = useMatchMedia();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        if (!e.target.files) return;

        dispatch(addPoster({projectId: projectId, fileImg: e.target.files[0]}));
        setActive(false);
    }
    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        if (isMoving && repositionActive) {
            if (yOffset) {
                if (e.clientY < yOffset) {
                    setPosition(position => {
                        if (position + 1 < 100) return position + 0.5;
                        return position;
                    });
                } else {
                    setPosition(position => {
                        if (position - 1 > 0) return position - 0.5;
                        return position;
                    });
                }
            }
            setYOffset(e.clientY);
        }
    }

    const handleStartMove = (e: React.MouseEvent<HTMLImageElement>) => {
        setMoving(true);
    }

    const handleStopMove = (e: React.MouseEvent<HTMLImageElement>) => {
        setMoving(false);
    }

    const savePosition = () => {
        dispatch(changePosterPosition({projectId, posterPosition: position}))
        setRepositionActive(false);
    }

    const cancelReposition = () => {
        setRepositionActive(false);
        setPosition(posterPosition);
    }

    return (
        <div className={classes.container}
             onMouseLeave={handleStopMove}
             onMouseDown={handleStartMove}
             onMouseUp={handleStopMove}
             onMouseMove={handleMouseMove}>
            <div className={classes.content}>
                <img src={posterUrl}
                     draggable={false}
                     className={!repositionActive ? classes.poster : `${classes.poster} ${classes.dragActive}`}
                     style={{objectPosition: `center ${position}%`}}/>
                {
                    isMobile ? <></>
                        :
                        <div className={classes.blockBtn}>
                            {
                                !repositionActive ?
                                    <>
                                        <button className={`${classes.btn} ${classes.btnLeft}`} onClick={() => setActive(true)}>Change poster</button>
                                        <button className={`${classes.btn} ${classes.btnRight}`} onClick={() => setRepositionActive(true)}>Reposition</button>
                                    </>
                                    :
                                    <>
                                        <button className={`${classes.btn} ${classes.btnLeft}`} onClick={cancelReposition}>Cancel reposition</button>
                                        <button className={`${classes.btn} ${classes.btnRight}`} onClick={savePosition}>Save position</button>
                                    </>
                            }
                        </div>
                }
                {
                    repositionActive && <div className={classes.hint}>Drag image to reposition</div>
                }
            </div>
            {active &&
                <Modal setActive={setActive}>
                    <input type='file' accept="image/png, image/jpeg" onChange={handleChange}/>
                    <div className={classes.hintModal}>Images wider than 1500 pixels will be displayed better</div>
                </Modal>
            }
        </div>
    );
};

export default Poster;
