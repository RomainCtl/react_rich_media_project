import { KeywordModel, WordModel } from "domain/keyword-model";

export const mockWordModel: WordModel = {
    title: "a tag here",
    url: "http://0.0.0.0",
};

export const mockKeywordModel: KeywordModel = {
    pos: "45",
    data: [
        mockWordModel
    ]
};