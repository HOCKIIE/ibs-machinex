const Format = 
{
    date : (isoString: Date) =>
    {
        const date = new Date(isoString);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        };
        const formattedDate = new Intl.DateTimeFormat("en-EN", options).format(date);
        const [thisDate, time] = formattedDate.split(", ");
        const [month, day, year] = thisDate.split("/");
        return `${day}-${month}-${year}, ${time}`;
    },
    number:(value:string,fixed:number) =>
    {
        const num = parseFloat(value);
        if (isNaN(num)) return "Invalid number";

        const roundedNum = num.toFixed(fixed);

        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: fixed,
            maximumFractionDigits: fixed,
          }).format(parseFloat(roundedNum));
    }
}
export default Format;