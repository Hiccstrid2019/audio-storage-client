import {createAsyncThunk} from "@reduxjs/toolkit";
import ProjectService from "../../services/ProjectService";
import AudioService from "../../services/AudioService";
import {IAudio} from "../../models/IAudio";
import {RootState} from "../store";

export const fetchProjects = createAsyncThunk(
    'project/fetchProjects',
    async (_, thunkAPI) => {
        try {
            const response = await ProjectService.getProjects();
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            const {fetchStatus} = state.projectReducer;
            if (fetchStatus === 'fulfilled' || fetchStatus === 'loading')
                return false;
        }
    }
)

export const fetchProject = createAsyncThunk(
    'project/fetchProject',
    async (id: string, thunkAPI) => {
        try {
            const response = await ProjectService.getProjectById(id);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

interface CreateProjectModel {
    title: string;
    category: string;
}

export const addProject = createAsyncThunk(
    'project/addProject',
    async (model: CreateProjectModel, thunkAPI) => {
        try {
            const {title, category} = model;
            const response = await ProjectService.addProject(title, category);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const deleteProject = createAsyncThunk(
    'project/deleteProject',
    async (id: string, thunkAPI) => {
        try {
            const response = await ProjectService.deleteProject(id);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

interface UpdateProjectModel {
    id: string;
    title: string;
    category: string;
}

export const updateProject = createAsyncThunk(
    'project/updateProject',
    async (model: UpdateProjectModel, thunkAPI) => {
        try {
            const {id, title, category} = model;
            const response = await ProjectService.updateProject(id, title, category);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

interface AddPosterModel {
    projectId: string;
    fileImg: File;
}

export const addPoster = createAsyncThunk(
    'project/addPoster',
    async (model: AddPosterModel, thunkAPI) => {
        try {
            const {projectId, fileImg} = model;
            const response = await ProjectService.uploadPoster(projectId, fileImg);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

interface ChangeRepositionModel {
    projectId: string;
    posterPosition: number;
}

export const changePosterPosition = createAsyncThunk(
    'project/changeReposition',
    async (model: ChangeRepositionModel, thunkAPI) => {
        try {
            const {projectId, posterPosition} = model;
            const response = await ProjectService.updatePosterPosition(projectId, posterPosition);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

interface ChangeProjectShareModeModel {
    projectId: string;
    isShared: boolean;
}

export const changeProjectShareMode = createAsyncThunk(
    'project/changeProjectShareMode',
    async (model: ChangeProjectShareModeModel, thunkAPI) => {
        try {
            const {projectId, isShared} = model;
            const response = await ProjectService.updateProjectShareMode(projectId, isShared);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

interface CreateAudioModel {
    blob: Blob;
    lessonId: string;
}

export interface CreatedAudio {
    audio: IAudio;
    lessonId: string;
}

export const addAudio = createAsyncThunk(
    'lesson/addAudio',
    async (model: CreateAudioModel, thunkAPI) => {
        try {
            const {blob, lessonId} = model;
            const response = await AudioService.saveAudio(blob, lessonId);
            const result: CreatedAudio = {audio: response.data, lessonId: lessonId};
            return result;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const deleteAudio = createAsyncThunk(
    'project/deleteAudio',
    async (id: string, thunkAPI) => {
        try {
            const response = await AudioService.deleteAudio(id);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)
