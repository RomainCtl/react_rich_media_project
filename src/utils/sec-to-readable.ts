/**
* Transform seconde to "hh/mm/ss" format
* @param sec
*/
export default function secToReadable(sec: string) {
    const date = new Date(1970, 0, 1);
    date.setSeconds(parseInt(sec));

    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}