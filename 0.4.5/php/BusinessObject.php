<?php

class BusinessObject
{

    public function __construct() {}
    function __destruct() {}
    public function JsonSerialize()
    {
        return 0;
    }

    public function Expose()
    {
        $json = json_encode($this->JsonSerialize());

        return $json;
    }
}

class BusinessObjects extends BusinessObject
{
    protected $objects;
    protected $length;
    protected $current;

    public function __construct()
    {
        parent::__construct();
        $this->objects = array();
        $this->length = 0;
        $this->current = -1;
    }

    function __destruct() {}

    public function JsonSerialize()
    {
        $objects = [];
        $i = 0;
        while ($i < $this->length) {
            $objects[$i] = $this->objects[$i]->JsonSerialize();
            $i++;
        }

        $array = [
            '_objects' => $objects,
            '_length' => $this->length,
            '_current' => $this->current
        ];

        return $array;
    }

    public function Add($businessObject)
    {
        $index = $this->length;
        $this->objects[$this->length] = $businessObject;
        $this->length++;

        return $index;
    }

    public function GetAt($index)
    {
        return $this->objects[$index];
    }
}

// Course
class CourseList extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}
}

class Course extends BusinessObject
{
    private $name;

    public function __construct($name)
    {
        $this->name = $name;
    }

    function __destruct() {}

    public function GetName()
    {
        return $this->name;
    }

    public function JsonSerialize()
    {
        $array = [
            '_name' => $this->name
        ];
        return $array;
    }
}

// Step
class StepBook extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}

    public function Find($courseName)
    {
        $index = -1;
        $i = 0;
        while ($i < $this->length && $this->objects[$i]->GetCourseName() != $courseName) {
            $i++;
        }
        if ($i < $this->length) {
            $index = $i;
        }
        return $index;
    }
}

class StepCard extends BusinessObjects
{
    private $course;

    public function __construct($course)
    {
        parent::__construct();

        $this->course = $course;
    }

    function __destruct() {}

    public function GetCourseName()
    {
        return $this->course->GetName();
    }

    public function JsonSerialize()
    {
        $objects = [];
        $i = 0;
        while ($i < $this->length) {
            $objects[$i] = $this->objects[$i]->JsonSerialize();
            $i++;
        }

        $array = [
            '_objects' => $objects,
            '_length' => $this->length,
            '_current' => $this->current,
            '_course' => $this->course->JsonSerialize()
        ];

        return $array;
    }
}

class Step extends BusinessObject
{
    private $number;
    private $subject;
    private $price;
    private $period;

    public function __construct($number, $subject, $price, $period)
    {
        $this->number = $number;
        $this->subject = $subject;
        $this->price = $price;
        $this->period = $period;
    }

    function __destruct() {}

    public function GetNumber()
    {
        return $this->number;
    }

    public function GetSubject()
    {
        return $this->subject;
    }

    public function GetPrice()
    {
        return $this->price;
    }

    public function GetPeriod()
    {
        return $this->period;
    }

    public function JsonSerialize()
    {
        $array = [
            '_number' => $this->number,
            '_subject' => $this->subject,
            '_price' => $this->price,
            '_period' => $this->period
        ];
        return $array;
    }
}

// Mentee
class MenteeCard extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}
}

class Mentee extends BusinessObject
{
    private $name;
    private $emailAddress;
    private $time;

    public function __construct($name, $emailAddress, $time)
    {
        parent::__construct();

        $this->name = $name;
        $this->emailAddress = $emailAddress;
        $this->time = $time;
    }

    function __destruct() {}

    public function GetName()
    {
        return $this->name;
    }
    public function GetEmailAddress()
    {
        return $this->emailAddress;
    }

    public function GetTime()
    {
        return $this->time;
    }

    public function JsonSerialize()
    {
        $time = null;
        if ($this->time != null) {
            $time = $this->time->JsonSerialize();
        }

        $array = [
            '_name' => $this->name,
            '_emailAddress' => $this->emailAddress,
            '_time' => $time
        ];
        return $array;
    }
}

// Apply
class ApplyBook extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Find($courseName, $stepNumber)
    {
        $index = -1;
        $i = 0;
        while (
            $i < $this->length &&
            ($this->objects[$i]->GetCourseName() != $courseName ||
                $this->objects[$i]->GetStepNumber() != $stepNumber)
        ) {
            $i++;
        }
        if ($i < $this->length) {
            $index = $i;
        }
        return $index;
    }
}

class ApplyCard extends BusinessObjects
{
    private $course;
    private $step;

    public function __construct($course, $step)
    {
        parent::__construct();

        $this->course = $course;
        $this->step = $step;
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function GetCourseName()
    {
        return $this->course->GetName();
    }

    public function GetStepNumber()
    {
        return $this->step->GetNumber();
    }

    public function JsonSerialize()
    {
        $objects = [];
        $i = 0;
        while ($i < $this->length) {
            $objects[$i] = $this->objects[$i]->JsonSerialize();
            $i++;
        }

        $array = [
            '_objects' => $objects,
            '_length' => $this->length,
            '_current' => $this->current,
            '_course' => $this->course->JsonSerialize(),
            '_step' => $this->step->JsonSerialize()
        ];

        return $array;
    }
}

class Apply extends BusinessObject
{
    private $time;
    private $state;
    private $isPaid;
    private $start;
    private $end;

    public function __construct($time, $state, $isPaid, $start, $end)
    {
        parent::__construct();
        $this->time = $time;
        $this->state = $state;
        $this->isPaid = $isPaid;
        $this->start = $start;
        $this->end = $end;
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function GetTime()
    {
        return $this->time;
    }

    public function GetState()
    {
        return $this->state;
    }

    public function GetIsPaid()
    {
        return $this->isPaid;
    }

    public function GetStart()
    {
        return $this->start;
    }

    public function GetEnd()
    {
        return $this->end;
    }

    public function JsonSerialize()
    {
        $time = null;
        if ($this->time != null) {
            $time = $this->time->JsonSerialize();
        }
        $start = null;
        if ($this->start != null) {
            $start = $this->start->JsonSerialize();
        }
        $end = null;
        if ($this->end != null) {
            $end = $this->end->JsonSerialize();
        }

        $array = [
            '_time' => $time,
            '_state' => $this->state,
            '_isPaid' => $this->isPaid,
            '_start' => $start,
            '_end' => $end
        ];
        return $array;
    }
}

// Total
class TotalList extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }
}

class Total extends BusinessObject
{
    private $abstract;
    private $logical;
    private $solve;
    private $critical;
    private $language;
    private $debugging;

    public function __construct($abstract, $logical, $solve, $critical, $language, $debugging)
    {
        parent::__construct();

        $this->abstract = $abstract;
        $this->logical = $logical;
        $this->solve = $solve;
        $this->critical = $critical;
        $this->language = $language;
        $this->debugging = $debugging;
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function GetAbstract()
    {
        return $this->abstract;
    }

    public function GetLogical()
    {
        return $this->logical;
    }

    public function GetSolve()
    {
        return $this->solve;
    }

    public function GetCritical()
    {
        return $this->critical;
    }

    public function GetLanguage()
    {
        return $this->language;
    }

    public function GetDebugging()
    {
        return $this->debugging;
    }

    public function JsonSerialize()
    {
        $array = [
            '_abstract' => $this->abstract,
            '_logical' => $this->logical,
            '_solve' => $this->solve,
            '_critical' => $this->critical,
            '_language' => $this->language,
            '_debugging' => $this->debugging
        ];
        return $array;
    }
}

// Problem
class ProblemList extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}
}

class Problem extends BusinessObject
{
    private $chapterNumber;
    private $number;
    private $title;
    private $content;
    private $evaluate;

    public function __construct($chapterNumber, $number, $title, $content, $evaluate)
    {
        parent::__construct();

        $this->chapterNumber = $chapterNumber;
        $this->number = $number;
        $this->title = $title;
        $this->content = $content;
        $this->evaluate = $evaluate;
    }

    function __destruct() {}

    public function GetChapterNumber()
    {
        return $this->chapterNumber;
    }
    public function GetNumber()
    {
        return $this->number;
    }
    public function GetTitle()
    {
        return $this->title;
    }
    public function GetContent()
    {
        return $this->content;
    }
    public function GetEvaluate()
    {
        return $this->evaluate;
    }

    public function JsonSerialize()
    {
        $array = [
            '_chapterNumber' => $this->chapterNumber,
            '_number' => $this->number,
            '_title' => $this->title,
            '_content' => $this->content,
            '_evaluate' => $this->evaluate
        ];
        return $array;
    }
}

// Solution
class SolutionBook extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}

    public function Find($chapterNumber, $problemNumber)
    {
        $i = 0;
        $index = -1;

        while ($i < $this->length && $index == -1) {
            $problem = $this->objects[$i]->GetProblem();
            $chapterNumber_ = $problem->GetChapterNumber();
            $problemNumber_ = $problem->GetNumber();
            if ($chapterNumber_ == $chapterNumber && $problemNumber_ == $problemNumber) {
                $index = $i;
            }
            $i++;
        }

        return $index;
    }
}

class SolutionList extends BusinessObjects
{
    private $problem;

    public function __construct($problem)
    {
        parent::__construct();
        $this->problem = $problem;
    }

    function __destruct() {}

    public function GetProblem()
    {
        return $this->problem;
    }

    public function JsonSerialize()
    {
        $objects = [];
        $i = 0;
        while ($i < $this->length) {
            $objects[$i] = $this->objects[$i]->JsonSerialize();
            $i++;
        }

        $array = [
            '_objects' => $objects,
            '_length' => $this->length,
            '_current' => $this->current,
            '_problem' => $this->problem->JsonSerialize()
        ];

        return $array;
    }
}

class Solution extends BusinessObject
{
    private $time;
    private $state;
    private $number;
    private $content;
    private $image;

    public function __construct($time, $state, $number, $content, $image)
    {
        parent::__construct();

        $this->time = $time;
        $this->state = $state;
        $this->number = $number;
        $this->content = $content;
        $this->image = $image;
    }

    function __destruct() {}

    public function GetTime()
    {
        return $this->time;
    }

    public function GetState()
    {
        return $this->state;
    }

    public function GetNumber()
    {
        return $this->number;
    }

    public function GetContent()
    {
        return $this->content;
    }

    public function GetImage()
    {
        return $this->image;
    }

    public function JsonSerialize()
    {
        $time = null;
        if ($this->time != null) {
            $time = $this->time->JsonSerialize();
        }

        $array = [
            '_time' => $time,
            '_state' => $this->state,
            '_number' => $this->number,
            '_content' => $this->content,
            '_image' => $this->image
        ];
        return $array;
    }
}

// Feedback
class FeedbackBook extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}

    public function Find($chapterNumber, $problemNumber, $solutionNumber)
    {
        $i = 0;
        $index = -1;

        while ($i < $this->length && $index == -1) {
            $problem = $this->objects[$i]->GetProblem();
            $solution = $this->objects[$i]->GetSolution();
            $chapterNumber_ = $problem->GetChapterNumber();
            $problemNumber_ = $problem->GetNumber();
            $solutionNumber_ = $solution->GetNumber();
            if ($chapterNumber_ == $chapterNumber && $problemNumber_ == $problemNumber && $solutionNumber_ == $solutionNumber) {
                $index = $i;
            }
            $i++;
        }
        return $index;
    }
}

class FeedbackList extends BusinessObjects
{
    private $problem;
    private $solution;

    public function __construct($problem, $solution)
    {
        parent::__construct();

        $this->problem = $problem;
        $this->solution = $solution;
    }

    function __destruct() {}

    public function GetProblem()
    {
        return $this->problem;
    }

    public function GetSolution()
    {
        return $this->solution;
    }

    public function JsonSerialize()
    {
        $objects = [];
        $i = 0;
        while ($i < $this->length) {
            $objects[$i] = $this->objects[$i]->JsonSerialize();
            $i++;
        }

        $array = [
            '_objects' => $objects,
            '_length' => $this->length,
            '_current' => $this->current,
            '_problem' => $this->problem->JsonSerialize(),
            '_solution' => $this->solution->JsonSerialize()
        ];

        return $array;
    }
}

class Feedback extends BusinessObject
{
    private $time;
    private $content;
    private $evaluate;

    public function __construct($time, $content, $evaluate)
    {
        parent::__construct();

        $this->time = $time;
        $this->content = $content;
        $this->evaluate = $evaluate;
    }

    function __destruct() {}

    public function JsonSerialize()
    {
        $time = null;
        if ($this->time != null) {
            $time = $this->time->JsonSerialize();
        }

        $array = [
            '_time' => $time,
            '_content' => $this->content,
            '_evaluate' => $this->evaluate
        ];
        return $array;
    }
}

// Question
class QuestionBook extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}

    public function Find($chapterNumber, $problemNumber, $solutionNumber)
    {
        $i = 0;
        $index = -1;
        while ($i < $this->length && $index == -1) {
            $questionList = $this->objects[$i];
            $problem = $questionList->GetProblem();
            $solution = $questionList->GetSolution();
            if (
                $problem->GetChapterNumber() == $chapterNumber &&
                $problem->GetNumber() == $problemNumber &&
                $solution->GetNumber() == $solutionNumber
            ) {
                $index = $i;
            }
            $i++;
        }
        return $index;
    }
}

class QuestionList extends BusinessObjects
{
    private $problem;
    private $solution;

    public function __construct($problem, $solution)
    {
        parent::__construct();

        $this->problem = $problem;
        $this->solution = $solution;
    }

    function __destruct() {}

    public function GetProblem()
    {
        return $this->problem;
    }

    public function GetSolution()
    {
        return $this->solution;
    }

    public function JsonSerialize()
    {
        $objects = [];
        $i = 0;
        while ($i < $this->length) {
            $objects[$i] = $this->objects[$i]->JsonSerialize();
            $i++;
        }

        $array = [
            '_objects' => $objects,
            '_length' => $this->length,
            '_current' => $this->current,
            '_problem' => $this->problem->JsonSerialize(),
            '_solution' => $this->solution->JsonSerialize()
        ];

        return $array;
    }
}

class Question extends BusinessObject
{
    private $number;
    private $time;
    private $content;

    public function __construct($number, $time, $content)
    {
        parent::__construct();

        $this->number = $number;
        $this->time = $time;
        $this->content = $content;
    }

    function __destruct() {}

    public function GetNumber()
    {
        return $this->number;
    }

    public function GetTime()
    {
        return $this->time;
    }

    public function GetContent()
    {
        return $this->content;
    }

    public function JsonSerialize()
    {
        $time = null;
        if ($this->time != null) {
            $time = $this->time->JsonSerialize();
        }

        $array = [
            '_number' => $this->number,
            '_time' => $time,
            '_content' => $this->content,
        ];
        return $array;
    }
}

// Answer
class AnswerBook extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}

    public function Find($chapterNumber, $problemNumber, $solutionNumber, $questionNumber)
    {
        $i = 0;
        $index = -1;

        while ($i < $this->length) {
            $answerCard = $this->objects[$i];
            $chapterNumber_ = $answerCard->GetProblem()->GetChapterNumber();
            $problemNumber_ = $answerCard->GetProblem()->GetNumber();
            $solutionNumber_ = $answerCard->GetSolution()->GetNumber();
            $questionNumber_ = $answerCard->GetQuestion()->GetNumber();
            if (
                $chapterNumber_ == $chapterNumber && $problemNumber_ == $problemNumber &&
                $solutionNumber_ == $solutionNumber && $questionNumber_ == $questionNumber
            ) {
                $index = $i;
            }
            $i++;
        }

        return $index;
    }
}

class AnswerCard extends BusinessObjects
{
    private $problem;
    private $solution;
    private $question;

    public function __construct($problem, $solution, $question)
    {
        parent::__construct();

        $this->problem = $problem;
        $this->solution = $solution;
        $this->question = $question;
    }

    function __destruct() {}

    public function GetProblem()
    {
        return $this->problem;
    }
    public function GetSolution()
    {
        return $this->solution;
    }
    public function GetQuestion()
    {
        return $this->question;
    }

    public function JsonSerialize()
    {
        $objects = [];
        $i = 0;
        while ($i < $this->length) {
            $objects[$i] = $this->objects[$i]->JsonSerialize();
            $i++;
        }

        $array = [
            '_objects' => $objects,
            '_length' => $this->length,
            '_current' => $this->current,
            '_problem' => $this->problem->JsonSerialize(),
            '_solution' => $this->solution->JsonSerialize(),
            '_question' => $this->question->JsonSerialize()
        ];

        return $array;
    }
}

class Answer extends BusinessObject
{
    private $time;
    private $content;

    public function __construct($time, $content)
    {
        parent::__construct();

        $this->time = $time;
        $this->content = $content;
    }

    function __destruct() {}

    public function JsonSerialize()
    {
        $time = null;
        if ($this->time != null) {
            $time = $this->time->JsonSerialize();
        }

        $array = [
            '_time' => $time,
            '_content' => $this->content,
        ];

        return $array;
    }
}

// Bookmark
class BookmarkCard extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}
}

class Bookmark extends BusinessObject
{
    private $location;
    private $childForm;
    private $grandChildForm;
    private $type;
    private $courseName;
    private $stepNumber;
    private $chapterNumber;
    private $problemNumber;
    private $solutionNumber;

    public function __construct($location, $childForm, $grandChildForm, $type, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)
    {
        parent::__construct();

        $this->location = $location;
        $this->childForm = $childForm;
        $this->grandChildForm = $grandChildForm;
        $this->type = $type;
        $this->courseName = $courseName;
        $this->stepNumber = $stepNumber;
        $this->chapterNumber = $chapterNumber;
        $this->problemNumber = $problemNumber;
        $this->solutionNumber = $solutionNumber;
    }

    function __destruct() {}

    public function JsonSerialize()
    {
        $array = [
            '_location' => $this->location,
            '_childForm' => $this->childForm,
            '_grandChildForm' => $this->grandChildForm,
            '_type' => $this->type,
            '_courseName' => $this->courseName,
            '_stepNumber' => $this->stepNumber,
            '_chapterNumber' => $this->chapterNumber,
            '_problemNumber' => $this->problemNumber,
            '_solutionNumber' => $this->solutionNumber
        ];

        return $array;
    }
}

// Mento
class MentoCard extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}
}

class Mento extends BusinessObject
{
    private $name;
    private $emailAddress;

    public function __construct($name, $emailAddress)
    {
        parent::__construct();

        $this->name = $name;
        $this->emailAddress = $emailAddress;
    }

    function __destruct() {}

    public function GetName()
    {
        return $this->name;
    }
    public function GetEmailAddress()
    {
        return $this->emailAddress;
    }

    public function JsonSerialize()
    {
        $array = [
            '_name' => $this->name,
            '_emailAddress' => $this->emailAddress
        ];
        return $array;
    }
}

// MenteeInfo
class MenteeInfoList extends BusinessObjects
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct() {}
}

class MenteeInfo extends BusinessObject
{
    private $name;
    private $emailAddress;
    private $courseName;
    private $stepNumber;

    public function __construct($name, $emailAddress, $courseName, $stepNumber)
    {
        $this->name = $name;
        $this->emailAddress = $emailAddress;
        $this->courseName = $courseName;
        $this->stepNumber = $stepNumber;
    }

    function __destruct() {}

    public function GetName()
    {
        return $this->name;
    }

    public function GetEmailAddress()
    {
        return $this->emailAddress;
    }

    public function GetCourseName()
    {
        return $this->courseName;
    }

    public function GetStepNumber()
    {
        return $this->stepNumber;
    }

    public function JsonSerialize()
    {
        $array = [
            '_name' => $this->name,
            '_emailAddress' => $this->emailAddress,
            '_courseName' => $this->courseName,
            '_stepNumber' => $this->stepNumber
        ];
        return $array;
    }
}
