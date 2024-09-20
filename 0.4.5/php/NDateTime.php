<?php
class NDateTime
{
    private $year;
    private $month;
    private $day;
    private $date;
    private $dayOfWeek;
    private $hour;
    private $minute;
    private $sec;
    private $time;

    public function __construct($dateTime)
    {
        $this->year = (int)substr($dateTime, 0, 4);
        $this->month = (int)substr($dateTime, 5, 7);
        $this->day = (int)substr($dateTime, 8, 10);
        $this->date = $this->year . '-' . sprintf("%02d", $this->month) . '-' . sprintf("%02d", $this->day);
        $this->dayOfWeek = (int)date('w', strtotime($this->date));

        $this->hour = (int)substr($dateTime, 11, 13);
        $this->minute = (int)substr($dateTime, 14, 16);
        $this->sec = (int)substr($dateTime, 17, 19);
        $this->time = sprintf("%02d", $this->hour) . ':' . sprintf("%02d", $this->minute) . ':' . sprintf("%02d", $this->sec);
    }

    function __destruct() {}


    public function GetDate()
    {
        return $this->date;
    }

    public function GetYear()
    {
        return $this->year;
    }

    public function GetMonth()
    {
        return $this->month;
    }

    public function GetDay()
    {
        return $this->day;
    }

    public function GetDayOfWeek()
    {
        return $this->dayOfWeek;
    }

    public function GetTime()
    {
        return $this->time;
    }

    public function GetHour()
    {
        return $this->hour;
    }

    public function GetMinute()
    {
        return $this->minute;
    }

    public function GetSec()
    {
        return $this->sec;
    }

    public static function Now()
    {
        $now = date("Y-m-d h:i:s", time());

        return $now;
    }

    public function IsGreaterThan($other)
    {
        $isGreaterThan = false;

        if ($this->year > $other->GetYear) {
            $isGreaterThan = true;
        } else if ($this->year == $other->GetYear && $this->month > $other->GetMonth) {
            $isGreaterThan = true;
        } else if ($this->year == $other->GetYear && $this->month == $other->GetMonth && $this->day > $other->GetDay) {
            $isGreaterThan = true;
        } else if (
            $this->year == $other->GetYear && $this->month == $other->GetMonth && $this->day == $other->GetDay &&
            $this->hour > $other->GetHour
        ) {
            $isGreaterThan = true;
        } else if (
            $this->year == $other->GetYear && $this->month == $other->GetMonth && $this->day == $other->GetDay &&
            $this->hour == $other->GetHour && $this->minute > $other->GetMinute
        ) {
            $isGreaterThan = true;
        } else if (
            $this->year == $other->GetYear && $this->month == $other->GetMonth && $this->day == $other->GetDay &&
            $this->hour == $other->GetHour && $this->minute == $other->GetMinute && $this->sec > $other->GetSec
        ) {
            $isGreaterThan = true;
        }

        return $isGreaterThan;
    }

    public function GetKoreanDayOfWeek()
    {
        $dayOfWeek = "";

        switch ($this->dayOfWeek) {
            case 0:
                $dayOfWeek = "일";
                break;
            case 1:
                $dayOfWeek = "월";
                break;
            case 2:
                $dayOfWeek = "화";
                break;
            case 3:
                $dayOfWeek = "수";
                break;
            case 4:
                $dayOfWeek = "목";
                break;
            case 5:
                $dayOfWeek = "금";
                break;
            case 6:
                $dayOfWeek = "토";
                break;
            default:
                break;
        }

        return $dayOfWeek;
    }

    public function DayAfter($day)
    {
        $this->day += $day;
    }

    public function GetString()
    {
        $dateString = $this->date . ' ' . $this->time;

        return $dateString;
    }

    public function JsonSerialize()
    {
        $array = [
            '_year' => $this->year,
            '_month' => $this->month,
            '_day' => $this->day,
            '_date' => $this->date,
            '_dayOfWeek' => $this->dayOfWeek,
            '_hour' => $this->hour,
            '_minute' => $this->minute,
            '_sec' => $this->sec,
            '_time' => $this->time
        ];

        return $array;
    }
}
