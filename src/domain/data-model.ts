import { FilmModel } from 'domain/film-model';
import { KeywordModel } from 'domain/keyword-model';
import { ChapterModel } from 'domain/chapter-model';
import { WaypointModel } from 'domain/waypoint-model';

export type DataModel = {
    Film: FilmModel,
    Chapters: ChapterModel[],
    Waypoints: WaypointModel[],
    Keywords: KeywordModel[],
}