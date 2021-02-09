export type WordModel = {
    title: string, // the word
    url: string, // an url with some information about this word
}
export type KeywordModel = {
    pos: string,
    data: WordModel[],
}