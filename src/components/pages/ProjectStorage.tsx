import React, {useEffect, useState} from 'react';
import Card from "../ui/Card/Card";
import classes from "./ProjectStorage.module.css";
import Modal from "../ui/Modal/Modal";
import {useAppDispatch, useAppSelector} from "../../hoc/redux";
import {addProject, fetchProjects} from "../../store/reducers/ProjectActions";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import {useInput} from "../../hoc/useInput";

const ProjectStorage = () => {
    const [active, setActive] = useState(false);
    const {projects} = useAppSelector(state => state.projectReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchProjects());
    }, [])

    const title = useInput('', {checkEmpty: true, minLength: 4, fieldName: 'title', maxLength: 40});
    const category = useInput('', {checkEmpty: true, minLength: 2, fieldName: 'category', maxLength: 20});
    const handleForm = () => {
        if (title.isValid() && category.isValid())
        {
            setActive(false);
            dispatch(addProject({title: title.value, category: category.value}));
            title.clear();
            category.clear();
        } else {
            title.displayErrors();
            category.displayErrors();
        }
    }

    const handleCancel = () => {
        setActive(false);
        title.clear();
        category.clear();
    }

    return (
        <div className={classes.container}>
            {
                projects.map((project) => <Card key={project.id} category={project.category} title={project.title} id={project.id} posterUrl={project.posterUrl}/>)
            }
            <div className={classes.newLesson} onClick={() => setActive(true)}>
                Add Project
            </div>
            {active &&
                <Modal setActive={setActive}>
                    <div className={classes.title}>Create new project</div>
                    <Input text="Enter project name"
                           value={title.value}
                           onChange={title.onChange}
                           onBlur={title.onBlur}
                           isDirty={title.isDirty}
                           errors={title.valid}/>
                    <Input text="Enter category name"
                           value={category.value}
                           onChange={category.onChange}
                           onBlur={category.onBlur}
                           isDirty={category.isDirty}
                           errors={category.valid}/>
                    <div className={classes.btnRow}>
                        <Button text='Cancel' style={{marginRight: "8px"}} onClick={handleCancel}/>
                        <Button text='Add project' type='primary' onClick={handleForm}/>
                    </div>
                </Modal>
            }
        </div>
    );
};

export default ProjectStorage;
