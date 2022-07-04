const getDate = (datetime) => {
    let month = datetime.getMonth()+1;
    month = month<10? `0${month}`: month
    let day = datetime.getDate();
    day = day<10? `0${day}`:day
    const date = `${datetime.getFullYear()}-${month}-${day}`
    let minutes = datetime.getMinutes()
    let hours = datetime.getHours()
    minutes = minutes<10?`0${minutes}`: minutes;
    const time = `${hours}:${minutes}`
    return  { date, time };
}

module.exports = {getDate}