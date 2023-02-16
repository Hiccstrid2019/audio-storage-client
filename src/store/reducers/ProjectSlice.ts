import {IProject} from "../../models/IProject";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    addAudio,
    addPoster,
    addProject,
    changePosterPosition, changeProjectShareMode,
    CreatedAudio,
    deleteAudio,
    deleteProject,
    fetchProject,
    fetchProjects,
    updateProject
} from "./ProjectActions";
import {PosterResponse} from "../../models/response/PosterResponse";

export interface ProjectState {
    projects: IProject[];
    isLoading: boolean;
    fetchStatus: string | undefined;
}

const initialState: ProjectState = {
    projects: [],
    isLoading: false,
    fetchStatus: undefined
}

export const projectSlice = createSlice({
    name: 'lesson',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchProjects.fulfilled, (state: ProjectState, action: PayloadAction<IProject[]>) => {
            state.isLoading = false;
            state.fetchStatus = 'fulfilled';
            state.projects = action.payload;
        })
        .addCase(fetchProjects.pending, (state: ProjectState) => {
            state.isLoading = true;
            state.fetchStatus = 'loading';
        })
        .addCase(fetchProjects.rejected, (state: ProjectState) => {
            state.isLoading = false;
        })

        .addCase(fetchProject.fulfilled, (state: ProjectState, action: PayloadAction<IProject>) => {
          state.projects.push(action.payload);
        })


        .addCase(addProject.fulfilled, (state: ProjectState, action: PayloadAction<IProject>) => {
            state.projects.push(action.payload);
        })
        .addCase(addProject.rejected, (state: ProjectState) => {

        })

        .addCase(addAudio.fulfilled, (state: ProjectState, action: PayloadAction<CreatedAudio>) => {
            const project = state.projects.find(l => l.id === action.payload.lessonId);
            project!.audios = project?.audios || [];
            project?.audios?.push(action.payload.audio);
        })
        .addCase(addAudio.rejected, (state: ProjectState) => {

        })

        .addCase(deleteProject.fulfilled, (state: ProjectState, action: PayloadAction<IProject>) => {
            state.projects = state.projects.filter(lesson => lesson.id !== action.payload.id);
        })

        .addCase(updateProject.fulfilled, (state: ProjectState, action: PayloadAction<IProject>) => {
            const project = state.projects.find(p => p.id === action.payload.id);
            project!.title = action.payload.title;
            project!.category = action.payload.category;
            project!.timeModified = action.payload.timeModified;
        })

        .addCase(addPoster.fulfilled, (state: ProjectState, action: PayloadAction<PosterResponse>) => {
            const project = state.projects.find(project => project.id === action.payload.projectId);
            project!.posterUrl = action.payload.posterUrl;
            project!.posterPosition = action.payload.posterPosition;
        })
        .addCase(changePosterPosition.fulfilled, (state: ProjectState, action: PayloadAction<IProject>) => {
            const project = state.projects.find(p => p.id === action.payload.id);
            project!.posterPosition = action.payload.posterPosition;
        })

        .addCase(changeProjectShareMode.fulfilled, (state: ProjectState, action: PayloadAction<IProject>) => {
            const project = state.projects.find(p => p.id === action.payload.id);
            project!.isShared = action.payload.isShared;
        })

        .addCase(deleteAudio.fulfilled, (state: ProjectState, action: PayloadAction<DeletedAudio>) => {
            const project = state.projects.find(project => project.id === action.payload.projectId);
            project!.audios = project!.audios?.filter(a => a.id !== action.payload.audioId);
        })
    }
})

interface DeletedAudio {
    audioId: string;
    projectId: string;
}
export default projectSlice.reducer;
