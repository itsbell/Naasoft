export class DateTime {
    constructor(dateTime = null) {
        if (dateTime != null) {
            this._year = parseInt(dateTime.slice(0, 4));
            this._month = parseInt(dateTime.slice(5, 7));
            this._day = parseInt(dateTime.slice(8, 10));
            this._date = `${String(this._year).padStart(4, "0")}-${String(this._month).padStart(2, "0")}-${String(this._day).padStart(2, "0")}`;
            this._dayOfWeek = new Date(this._date).getDay();

            this._hour = parseInt(dateTime.slice(11, 13));
            this._minute = parseInt(dateTime.slice(14, 16));
            this._sec = parseInt(dateTime.slice(17, 19));
            this._time = `${String(this._hour).padStart(2, "0")}:${String(this._minute).padStart(2, "0")}:${String(this._sec).padStart(2, "0")}`;
        }
    }

    get date() {
        return this._date;
    }

    get year() {
        return this._year;
    }

    get month() {
        return this._month;
    }

    get day() {
        return this._day;
    }

    get dayOfWeek() {
        return this._dayOfWeek;
    }

    get time() {
        return this._time;
    }

    get hour() {
        return this._hour;
    }

    get minute() {
        return this._minute;
    }

    get sec() {
        return this._sec;
    }

    Format(formatString) {
        let result = formatString
            .replace("{YYYY}", String(this._year).padStart(4, "0"))
            .replace("{YY}", String(this._year).slice(-2))
            .replace("{MM}", String(this._month).padStart(2, "0"))
            .replace("{DD}", String(this._day).padStart(2, "0"))
            .replace("{HH}", String(this._hour).padStart(2, "0"))
            .replace("{mm}", String(this._minute).padStart(2, "0"))
            .replace("{ss}", String(this._sec).padStart(2, "0"));

        return result;
    }

    static Now() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    IsGreaterThan(other) {
        let isGreaterThan = false;

        if (this._year > other.year) {
            isGreaterThan = true;
        }
        else if (this._year === other.year && this._month > other.month) {
            isGreaterThan = true;
        }
        else if (this._year === other.year && this._month === other.month && this._day > other.day) {
            isGreaterThan = true;
        }
        else if (this._year === other.year && this._month === other.month && this._day === other.day &&
            this._hour > other.hour) {
            isGreaterThan = true;
        }
        else if (this._year === other.year && this._month === other.month && this._day === other.day &&
            this._hour === other.hour && this._minute > other.minute) {
            isGreaterThan = true;
        }
        else if (this._year === other.year && this._month === other.month && this._day === other.day &&
            this._hour === other.hour && this._minute === other.minute && this._sec > other.sec) {
            isGreaterThan = true;
        }

        return isGreaterThan;
    }

    IsLessThan(other) {
        let isLessThan = false;

        if (this._year < other.year) {
            isLessThan = true;
        }
        else if (this._year === other.year && this._month < other.month) {
            isLessThan = true;
        }
        else if (this._year === other.year && this._month === other.month && this._day < other.day) {
            isLessThan = true;
        }
        else if (this._year === other.year && this._month === other.month && this._day === other.day &&
            this._hour < other.hour) {
            isLessThan = true;
        }
        else if (this._year === other.year && this._month === other.month && this._day === other.day &&
            this._hour === other.hour && this._minute < other.minute) {
            isLessThan = true;
        }
        else if (this._year === other.year && this._month === other.month && this._day === other.day &&
            this._hour === other.hour && this._minute === other.minute && this._sec < other.sec) {
            isLessThan = true;
        }

        return isLessThan;
    }

    GetKoreanDayOfWeek() {
        const dayOfWeeks = ['일', '월', ' 화', '수', '목', '금', '토'];
        return dayOfWeeks[this._dayOfWeek];
    }

    DayAfter(day) {
        const date = new Date(this._year, this._month - 1, this._day, this._hour, this._minute, this._sec);
        date.setDate(date.getDate() + day);

        this._year = date.getFullYear();
        this._month = date.getMonth() + 1;
        this._day = date.getDate();
        this._date = `${String(this._year).padStart(4, "0")}-${String(this._month).padStart(2, "0")}-${String(this._day).padStart(2, "0")}`;
        this._dayOfWeek = new Date(this._date).getDay();

        this._hour = date.getHours();
        this._minute = date.getMinutes();
        this._seconds = date.getSeconds();
        this._time = `${String(this._hour).padStart(2, "0")}:${String(this._minute).padStart(2, "0")}:${String(this._sec).padStart(2, "0")}`;
    }

    GetString() {
        const dateString = this._date + " " + this._time;
        return dateString;
    }

    SetObject(object) {
        this._year = parseInt(object._year);
        this._month = parseInt(object._month);
        this._day = parseInt(object._day);
        this._date = `${String(this._year).padStart(4, "0")}-${String(this._month).padStart(2, "0")}-${String(this._day).padStart(2, "0")}`;
        this._dayOfWeek = parseInt(object._dayOfWeek);

        this._hour = parseInt(object._hour);
        this._minute = parseInt(object._minute);
        this._sec = parseInt(object._sec);
        this._time = `${String(this._hour).padStart(2, "0")}:${String(this._minute).padStart(2, "0")}:${String(this._sec).padStart(2, "0")}`;
    }
}