import {IAudio} from "./IAudio";

export interface IProject {
    id: string;
    title: string;
    category: string;
    timeCreated: string;
    timeModified: string;
    audios?: IAudio[];
    posterUrl?: string;
    posterPosition?: string;
    isShared: boolean;
}

export interface ISharedProject extends IProject {
    author: string;
}
