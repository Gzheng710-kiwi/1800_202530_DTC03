export function betterDateFormat(foodDate)
{
    let _date = foodDate.slice(5);
    let _year = foodDate.slice(0, 4);

    let betterDate = _date + "-" + _year;

    return betterDate;
}