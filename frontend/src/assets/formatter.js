const numberFormatter = (number) => {
    const formatter = new Intl.NumberFormat('en-IN');
    return formatter.format(number);
}

const getDate = (date) => {
    // alert(new Date());
    if (!(date instanceof Date)) {
      throw new Error("Invalid date");
    }
    const currentDay = String(date.getDate()).padStart(2, "0");
    const currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    const currentYear = date.getFullYear();
    return `${currentDay}-${currentMonth}-${currentYear}`;
};

export {numberFormatter, getDate};