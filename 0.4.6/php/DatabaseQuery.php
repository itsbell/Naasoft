<?php

require_once("./BusinessObject.php");
require_once("./NDateTime.php");

class DatabaseQuery
{
    protected $connection;

    public function __construct()
    {
        // $this->connection = new mysqli('localhost', 'naasofttest', 'parkcom9424!', 'naasofttest');
        // $this->connection = new mysqli('localhost', 'jonghwan0', 'parkcom9424!', 'jonghwan0');
        $this->connection = new mysqli('localhost', 'naamentoring', 'naamentoring', 'naamentoring');
    }

    function __destruct()
    {
        $this->connection->close();
    }

    public function Query(...$params) //overloading 흉내내기 : 가변 인수
    {
        return "";
    }
}

class DatabaseQueryFactory
{
    public function __construct() {}
    function __destruct() {}

    public function Make($type)
    {
        $query = null;

        if ($type == "GetAllCourse") {
            $query = new GetAllCourseQuery();
        } else if ($type == "GetAllStep") {
            $query = new GetAllStepQuery();
        } else if ($type == "ClearEmptyMentee") {
            $query = new ClearEmptyMenteeQuery();
        } else if ($type == "CheckEmailAddress") {
            $query = new CheckEmailAddressQuery();
        } else if ($type == "InsertAuthentication") {
            $query = new InsertAuthenticationQuery();
        } else if ($type == "CheckAuthentication") {
            $query = new CheckAuthenticationQuery();
        } else if ($type == "InsertMentee") {
            $query = new InsertMenteeQuery();
        } else if ($type == "ClearAuthentication") {
            $query = new ClearAuthenticationQuery();
        } else if ($type == "UpdatePassword") {
            $query = new UpdatePasswordQuery();
        } else if ($type == "CheckMentee") {
            $query = new CheckMenteeQuery();
        } else if ($type == "GetMentee") {
            $query = new GetMenteeQuery();
        } else if ($type == "GetAllApply") {
            $query = new GetAllApplyQuery();
        } else if ($type == "GetProblems") {
            $query = new GetProblemsQuery();
        } else if ($type == "GetCurrentApplySolutions") {
            $query = new GetCurrentApplySolutionsQuery();
        } else if ($type == "GetCurrentApplyFeedbacks") {
            $query = new GetCurrentApplyFeedbacksQuery();
        } else if ($type == "GetCurrentApplyQuestions") {
            $query = new GetCurrentApplyQuestionsQuery();
        } else if ($type == "GetCurrentApplyAnswers") {
            $query = new GetCurrentApplyAnswersQuery();
        } else if ($type == "GetBookmark") {
            $query = new GetBookmarkQuery();
        } else if ($type == "InsertApply") {
            $query = new InsertApplyQuery();
        } else if ($type == "InsertPayment") {
            $query = new InsertPaymentQuery();
        } else if ($type == "TotalAbility") {
            $query = new TotalAbilityQuery();
        } else if ($type == "GetSolutionImage") {
            $query = new GetSolutionImageQuery();
        } else if ($type == "GetSolutionState") {
            $query = new GetSolutionStateQuery();
        } else if ($type == "GetSolutionFeedbacks") {
            $query = new GetSolutionFeedbacksQuery();
        } else if ($type == "GetSolutionAnswers") {
            $query = new GetSolutionAnswersQuery();
        } else if ($type == "SetBookmark") {
            $query = new SetBookmarkQuery();
        } else if ($type == "InsertSolution") {
            $query = new InsertSolutionQuery();
        } else if ($type == "InsertQuestion") {
            $query = new InsertQuestionQuery();
        } else if ($type == "CheckMento") {
            $query = new CheckMentoQuery();
        } else if ($type == "GetMento") {
            $query = new GetMentoQuery();
        } else if ($type == "GetSolutionWorkCards") {
            $query = new GetSolutionWorkCardsQuery();
        } else if ($type == "GetQuestionWorkCards") {
            $query = new GetQuestionWorkCardsQuery();
        } else if ($type == "GetAllMenteeInfo") {
            $query = new GetAllMenteeInfoQuery();
        } else if ($type == "GetSolutionQuestions") {
            $query = new GetSolutionQuestionsQuery();
        } else if ($type == "InsertFeedback") {
            $query = new InsertFeedbackQuery();
        } else if ($type == "InsertAnswer") {
            $query = new InsertAnswerQuery();
        } else if ($type == "IntegrateMentee") {
            $query = new IntegrateMenteeQuery();
        } else if ($type == "IntegrateMento") {
            $query = new IntegrateMentoQuery();
        }

        return $query;
    }
}

class GetAllCourseQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $queryResult = $this->connection->query(
            "SELECT Course.name FROM Course ORDER BY Course.courseCode"
        );

        $courseList = new CourseList();

        while ($row = mysqli_fetch_array($queryResult)) {
            $course = new Course($row[0]);
            $courseList->Add($course);
        }

        $json = $courseList->Expose();
        return $json;
    }
}

class GetAllStepQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $queryResult = $this->connection->query(
            "SELECT Course.name, Step.number, Step.subject, Step.price, Step.period FROM Step INNER JOIN Course ON Course.courseCode = Step.courseCode"
        );

        $stepBook = new StepBook();

        while ($row = mysqli_fetch_array($queryResult)) {
            $index = $stepBook->Find($row[0]);
            if ($index == -1) {
                $course = new Course($row[0]);
                $stepCard = new StepCard($course);
                $stepBook->Add($stepCard);
            } else {
                $stepCard = $stepBook->GetAt($index);
            }

            $step = new Step(
                $row[1],
                $row[2],
                $row[3],
                $row[4]
            );
            $stepCard->Add($step);
        }

        $json = $stepBook->Expose();
        return $json;
    }
}

class ClearEmptyMenteeQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL ClearEmptyFromMentee()");
    }
}

class CheckEmailAddressQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL IsExistEmailAddress(\"$params[0]\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }
}

class InsertAuthenticationQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL InsertToAuthentication(\"$params[0]\", @authenticationCode)");
        $queryResult = $this->connection->query("SELECT @authenticationCode");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }
}

class CheckAuthenticationQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL CheckInAuthentication(\"$params[0]\", \"$params[1]\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }
}

class InsertMenteeQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("
        CALL InsertToMentee(\"$params[0]\", \"$params[1]\",\"$params[2]\", @time)
        ");
        $queryResult = $this->connection->query("SELECT @time");

        $array = $queryResult->fetch_array();
        $result = $array[0];

        return $result;
    }
}

class ClearAuthenticationQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("
        CALL ClearFromAuthentication($params[0])
        ");
    }
}

class UpdatePasswordQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $queryResult = $this->connection->query(
            "UPDATE Mentee SET Mentee.password = \"$params[1]\" WHERE Mentee.emailAddress = \"$params[0]\""
        );

        return $queryResult;
    }
}

class CheckMenteeQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL CheckInMentee(\"$params[0]\", \"$params[1]\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }
}

class GetMenteeQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetFromMentee(\"$params[0]\", @name, @emailAddress, @time)");
        $queryResult = $this->connection->query("SELECT @name, @emailAddress, @time");

        $row = $queryResult->fetch_array();

        $menteeCard = new MenteeCard();
        $mentee = new Mentee($row[0], $row[1], new NDateTime($row[2]));
        $menteeCard->Add($mentee);

        $json = $menteeCard->Expose();

        return $json;
    }
}

class GetAllApplyQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $queryResult = $this->connection->query(
            "SELECT Course.name, Step.number, Apply.time, Apply.state, Payment.orderId, Apply.start, Apply.end FROM Apply 
            LEFT JOIN Payment ON Payment.applyCode = Apply.applyCode 
            LEFT JOIN Step ON Step.stepCode = Apply.stepCode 
            LEFT JOIN Course ON Course.courseCode = Step.courseCode 
            LEFT JOIN Mentee ON Mentee.menteeCode = Apply.menteeCode 
            WHERE Mentee.emailAddress = \"$params[0]\" ORDER BY Apply.time"
        );

        $applyBook = new ApplyBook();

        while ($row = mysqli_fetch_array($queryResult)) {
            $index = $applyBook->Find($row[0], $row[1]);
            if ($index == -1) {
                $course = new Course($row[0]);
                $step = new Step($row[1], null, null, null);
                $applyCard = new ApplyCard($course, $step);
                $applyBook->Add($applyCard);
            } else {
                $applyCard = $applyBook->GetAt($index);
            }

            $time = new NDateTime($row[2]);
            $start = new NDateTime($row[5]);
            $end = new NDateTime($row[6]);
            $apply = new Apply(
                $time,
                $row[3],
                ($row[4] != null) ? (true) : (false),
                $start,
                $end
            );
            $applyCard->Add($apply);
        }

        $json = $applyBook->Expose();
        return $json;
    }
}

class GetProblemsQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetCodeFromStepByCourseNameAndStepNumber(\"$params[0]\", $params[1], @stepCode)");
        $queryResult = $this->connection->query("
        SELECT Problem.chapterNumber, Problem.number, Problem.title, Problem.content, Problem.evaluate FROM Problem 
        WHERE Problem.stepCode = @stepCode ORDER BY Problem.problemCode
        ");

        $problemList = new ProblemList();
        while ($row = mysqli_fetch_array($queryResult)) {
            $problem = new Problem((int)$row[0], (int)$row[1], $row[2], $row[3], (int)$row[4]);
            $problemList->Add($problem);
        }

        $json = $problemList->Expose();

        return $json;
    }
}

class GetCurrentApplySolutionsQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$params[0]\", \"$params[1]\", $params[2], @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Solution.time, Solution.state, Solution.chapterNumber, Solution.problemNumber, Solution.number, Solution.content
            FROM Solution WHERE Solution.applyCode = @applyCode ORDER BY Solution.time"
        );

        $solutionBook = new SolutionBook();
        while ($row = mysqli_fetch_array($queryResult)) {
            $index = $solutionBook->Find((int)$row[2], (int)$row[3]);
            if ($index == -1) {
                $problem = new Problem((int)$row[2], (int)$row[3], null, null, null);
                $index = $solutionBook->Add(new SolutionList($problem));
            }
            $solutionList = $solutionBook->GetAt($index);
            $time = new NDateTime($row[0]);
            $solution = new Solution($time, $row[1], (int)$row[4], $row[5], null);
            $solutionList->Add($solution);
        }
        $json = $solutionBook->Expose();

        return $json;
    }
}

class GetCurrentApplyFeedbacksQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$params[0]\", \"$params[1]\", $params[2], @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Feedback.time, Feedback.content, Feedback.evaluate, Solution.chapterNumber, Solution.problemNumber, Solution.number 
            FROM Feedback 
            INNER JOIN Solution ON Solution.solutionCode = Feedback.solutionCode 
            WHERE Solution.applyCode = @applyCode"
        );

        $feedbackBook = new FeedbackBook();
        while ($row = mysqli_fetch_array($queryResult)) {
            $index = $feedbackBook->Find((int)$row[3], (int)$row[4], (int)$row[5]);
            if ($index == -1) {
                $problem = new Problem((int)$row[3], (int)$row[4], null, null, null);
                $solution = new Solution(null, null, (int)$row[5], null, null);
                $index = $feedbackBook->Add(new FeedbackList($problem, $solution));
            }
            $feedbackList = $feedbackBook->GetAt($index);
            $time = new NDateTime($row[0]);
            $feedback = new Feedback($time, $row[1], (int)$row[2]);
            $feedbackList->Add($feedback);
        }

        $json = $feedbackBook->Expose();

        return $json;
    }
}

class GetCurrentApplyQuestionsQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$params[0]\", \"$params[1]\", $params[2], @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Question.time, Question.content, Question.chapterNumber, Question.problemNumber, Question.solutionNumber, Question.number
            FROM Question WHERE Question.applyCode = @applyCode"
        );

        $questionBook = new QuestionBook();

        while ($row = mysqli_fetch_array($queryResult)) {
            $index = $questionBook->Find((int)$row[2], (int)$row[3], (int)$row[4]);
            if ($index == -1) {
                $problem = new Problem((int)$row[2], (int)$row[3], null, null, null);
                $solution = new Solution(null, null, (int)$row[4], null, null);
                $index = $questionBook->Add(new QuestionList($problem, $solution));
            }
            $questionList = $questionBook->GetAt($index);
            $time = new NDateTime($row[0]);
            $question = new Question((int)$row[5], $time, $row[1]);
            $questionList->Add($question);
        }

        $json = $questionBook->Expose();

        return $json;
    }
}

class GetCurrentApplyAnswersQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$params[0]\", \"$params[1]\", $params[2], @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Answer.time, Answer.content, Question.chapterNumber, Question.problemNumber, Question.solutionNumber, Question.number
            FROM Answer
            INNER JOIN Question ON Question.questionCode = Answer.questionCode
            WHERE Question.applyCode = @applyCode"
        );

        $answerBook = new AnswerBook();

        while ($row = mysqli_fetch_array($queryResult)) {
            $index = $answerBook->Find((int)$row[2], (int)$row[3], (int)$row[4], (int)$row[5]);
            if ($index == -1) {
                $problem = new Problem((int)$row[2], (int)$row[3], null, null, null);
                $solution = new Solution(null, null, (int)$row[4], null, null);
                $question = new Question((int)$row[5], null, null);
                $index = $answerBook->Add(new AnswerCard($problem, $solution, $question));
            }
            $answerCard = $answerBook->GetAt($index);
            $time = new NDateTime($row[0]);
            $answer = new Answer($time, $row[1]);
            $answerCard->Add($answer);
        }

        $json = $answerBook->Expose();

        return $json;
    }
}

class GetBookmarkQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetCodeFromCurrentApply(\"$params[0]\", @applyCode)");
        $queryResult = $this->connection->query("SELECT Bookmark.location FROM Bookmark WHERE Bookmark.applycode = @applyCode");

        $bookmarkCard = new BookmarkCard();
        $location = 0;
        if ($row = $queryResult->fetch_array()) {
            $location = (int)$row[0];
        }
        $bookmark = new Bookmark($location, "", "", "", "", 0, -1, 0, 0);
        $bookmarkCard->Add($bookmark);

        $json = $bookmarkCard->Expose();

        return $json;
    }
}

class InsertApplyQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("
        CALL InsertToApply(\"$params[0]\", \"$params[1]\", \"$params[2]\", @time)
        ");
        $queryResult = $this->connection->query("SELECT @time");

        $array = $queryResult->fetch_array();
        $result = $array[0];

        return $result;
    }
}

class InsertPaymentQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("
        CALL InsertToPayment(\"$params[0]\", \"$params[1]\", \"$params[2]\", $params[3], @time)
        ");
        $queryResult = $this->connection->query("SELECT @time");

        $array = $queryResult->fetch_array();
        $result = $array[0];

        return $result;
    }
}

class TotalAbilityQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetAbstractAverageFromEvaluate(\"$params[0]\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $abstracts = $queryResult->fetch_array();

        $this->connection->query("CALL GetLogicalAverageFromEvaluate(\"$params[0]\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $logicals = $queryResult->fetch_array();

        $this->connection->query("CALL GetSolveAverageFromEvaluate(\"$params[0]\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $solves = $queryResult->fetch_array();

        $this->connection->query("CALL GetCriticalAverageFromEvaluate(\"$params[0]\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $criticals = $queryResult->fetch_array();

        $this->connection->query("CALL GetLanguageAverageFromEvaluate(\"$params[0]\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $languages = $queryResult->fetch_array();

        $this->connection->query("CALL GetDebuggingAverageFromEvaluate(\"$params[0]\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $debuggings = $queryResult->fetch_array();

        $totalList = new TotalList();

        $i = 0;
        while ($i < 3) {
            $total = new Total(
                $abstracts[$i],
                $logicals[$i],
                $solves[$i],
                $criticals[$i],
                $languages[$i],
                $debuggings[$i]
            );
            $totalList->Add($total);

            $i++;
        }

        $json = $totalList->Expose();
        return $json;
    }
}

class GetSolutionImageQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetImageFromSolution(\"$params[0]\", \"$params[1]\", $params[2],
            $params[3], $params[4], $params[5], @image)");
        $queryResult = $this->connection->query("SELECT @image");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }
}

class GetSolutionStateQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetStateFromSolution(\"$params[0]\", \"$params[1]\", $params[2],
            $params[3], $params[4], $params[5], @state)");
        $queryResult = $this->connection->query("SELECT @state");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }
}

class GetSolutionFeedbacksQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetCodeFromSolutionSpecified(\"$params[0]\", \"$params[1]\", $params[2], 
            $params[3], $params[4], $params[5], @solutionCode)");
        $queryResult = $this->connection->query(
            "SELECT Feedback.time, Feedback.content, Feedback.evaluate 
            FROM Feedback 
            WHERE Feedback.solutionCode = @solutionCode ORDER BY Feedback.time"
        );

        $problem = new Problem((int)$params[3], (int)$params[4], null, null, 0);
        $solution = new Solution(null, null, (int)$params[5], null, null);

        $feedbackList = new FeedbackList($problem, $solution);
        while ($row = mysqli_fetch_array($queryResult)) {
            $time = new NDateTime($row[0]);
            $feedback = new Feedback($time, $row[1], (int)$row[2]);
            $feedbackList->Add($feedback);
        }

        $json = $feedbackList->Expose();

        return $json;
    }
}

class GetSolutionAnswersQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("
            CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(
                \"$params[0]\", \"$params[1]\", $params[2], @applyCode
            )
        ");
        $queryResult = $this->connection->query(
            "SELECT Question.number, Answer.time, Answer.content 
            FROM Answer 
            INNER JOIN Question ON Question.applyCode = @applyCode AND Question.chapterNumber = $params[3] AND 
            Question.problemNumber = $params[4] AND Question.solutionNumber = $params[4] 
            WHERE Answer.questionCode = Question.questionCode"
        );

        $answerBookPart = new AnswerBook();

        while ($row = mysqli_fetch_array($queryResult)) {
            $problem = new Problem($params[3], $params[4], null, null, null);
            $solution = new Solution(null, null, $params[5], null, null);
            $question = new Question((int)$row[0], null, null);
            $answerCard = new AnswerCard($problem, $solution, $question);
            $answerBookPart->Add($answerCard);

            $time = new NDateTime($row[1]);
            $answer = new Answer($time, $row[2]);
            $answerCard->Add($answer);
        }

        $json = $answerBookPart->Expose();

        return $json;
    }
}

class SetBookmarkQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetCodeFromCurrentApply(\"$params[0]\", @applyCode)");
        $queryResult = $this->connection->query("SELECT Bookmark.location FROM Bookmark WHERE Bookmark.applyCode = @applyCode");
        $array = $queryResult->fetch_array();
        if ($array[0] != null) {
            $queryResult = $this->connection->query("UPDATE Bookmark SET location = $params[1] WHERE Bookmark.applyCode = @applyCode");
        } else {
            $queryResult = $this->connection->query("INSERT INTO Bookmark(location, applyCode) VALUES($params[1], @applyCode)");
        }
    }
}

class InsertSolutionQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $emailAddress = $params[0];
        $courseName = $params[1];
        $stepNumber = $params[2];
        $chapterNumber = $params[3];
        $problemNumber = $params[4];
        $number = $params[5];
        $content = $params[6];
        $image = $params[7];

        $stmt = $this->connection->prepare(
            "CALL InsertToSolution(\"$emailAddress\", \"$courseName\", $stepNumber, 
                    $chapterNumber, $problemNumber, $number, \"$content\", ?, @result)"
        );

        if ($image != '') {
            $dataURL = $image;
            // 데이터 URL에서 Base64 데이터만 추출
            $data = str_replace('data:image/jpeg;base64,', '', $dataURL);
            $data = str_replace(' ', '+', $data);

            // Base64 데이터를 디코딩
            $imageData = base64_decode($data);

            $null = NULL;
            $stmt->bind_param("b", $null);
            $stmt->send_long_data(0, $imageData);
        } else {
            $stmt->bind_param("b", $null);
        }

        $result = null;
        if ($stmt->execute()) {
            $queryResult = $this->connection->query("SELECT @result");
            $array = $queryResult->fetch_array();
            $result = $array[0];
        }

        return $result;
    }
}

class InsertQuestionQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL InsertToQuestion(\"$params[0]\", \"$params[1]\", $params[2],
            $params[3], $params[4], $params[5], $params[6], \"$params[7]\")");

        $queryResult = $this->connection->query(
            "SELECT Question.time From Question
             WHERE Question.chapterNumber= $params[3] AND Question.problemNumber= $params[4] AND
             Question.solutionNumber= $params[5] AND Question.number = $params[6]"
        );
        $array = $queryResult->fetch_array();

        return json_encode($array);
    }
}

class CheckMentoQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL CheckInMento(\"$params[0]\", \"$params[1]\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }
}

class GetMentoQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("CALL GetFromMento(\"$params[0]\", @name, @emailAddress, @time)");
        $queryResult = $this->connection->query("SELECT @name, @emailAddress, @time");

        $row = $queryResult->fetch_array();

        $mentoCard = new MentoCard();
        $mento = new Mento($row[0], $row[1], new NDateTime($row[2]));
        $mentoCard->Add($mento);

        $json = $mentoCard->Expose();

        return $json;
    }
}

class GetSolutionWorkCardsQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $queryResult = $this->connection->query("SELECT * FROM ViewSolutionWork;");

        $works = array();
        $i = 0;
        while ($work = mysqli_fetch_array($queryResult)) {
            $works[$i] = array(
                'time' => htmlspecialchars($work[0]),
                'menteeName' => htmlspecialchars($work[1]),
                'menteeEmailAddress' => htmlspecialchars($work[2]),
                'courseName' => htmlspecialchars($work[3]),
                'stepNumber' => htmlspecialchars($work[4]),
                'chapterNumber' => htmlspecialchars($work[5]),
                'problemNumber' => htmlspecialchars($work[6]),
                'solutionNumber' => htmlspecialchars($work[7])
            );
            $i++;
        }

        return json_encode($works);
    }
}

class GetQuestionWorkCardsQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $queryResult = $this->connection->query("SELECT * FROM ViewQuestionWork;");

        $works = array();
        $i = 0;
        while ($work = mysqli_fetch_array($queryResult)) {
            $works[$i] = array(
                'time' => htmlspecialchars($work[0]),
                'menteeName' => htmlspecialchars($work[1]),
                'menteeEmailAddress' => htmlspecialchars($work[2]),
                'courseName' => htmlspecialchars($work[3]),
                'stepNumber' => htmlspecialchars($work[4]),
                'chapterNumber' => htmlspecialchars($work[5]),
                'problemNumber' => htmlspecialchars($work[6]),
                'solutionNumber' => htmlspecialchars($work[7])
            );
            $i++;
        }

        return json_encode($works);
    }
}

class GetAllMenteeInfoQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $queryResult = $this->connection->query("SELECT * FROM ViewMentee");

        $menteeInfoList = new MenteeInfoList();

        while ($row = mysqli_fetch_array($queryResult)) {
            $menteeInfo = new MenteeInfo($row[0], $row[1], $row[2], (int)$row[3]);
            $menteeInfoList->Add($menteeInfo);
        }

        $json = $menteeInfoList->Expose();
        return $json;
    }
}

class GetSolutionQuestionsQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query("
            CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(
                \"$params[0]\", \"$params[1]\", $params[2], @applyCode
            )
        ");
        $queryResult = $this->connection->query(
            "SELECT Question.number, Question.time, Question.content 
            FROM Question 
            WHERE Question.applyCode = @applyCode AND Question.chapterNumber = $params[3] AND 
            Question.problemNumber = $params[4] AND Question.solutionNumber = $params[5]"
        );

        $problem = new Problem((int)$params[3], (int)$params[4], null, null, 0);
        $solution = new Solution(null, null, (int)$params[5], null, null);

        $questionList = new QuestionList($problem, $solution);
        while ($row = mysqli_fetch_array($queryResult)) {
            $time = new NDateTime($row[1]);
            $question = new Question((int)$row[0], $time, $row[2]);
            $questionList->Add($question);
        }

        $json = $questionList->Expose();

        return $json;
    }
}

class InsertFeedbackQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query(
            "CALL InsertToFeedback(\"$params[0]\", \"$params[1]\",
                \"$params[2]\", $params[3], 
                $params[4], $params[5], $params[6], $params[7], \"$params[8]\")"
        );

        $queryResult = $this->connection->query(
            "SELECT Feedback.time From Feedback
             INNER JOIN Solution ON Solution.solutionCode = Feedback.solutionCode
             WHERE Solution.chapterNumber= $params[4] AND 
             Solution.problemNumber= $params[5] AND
             Solution.number= $params[6]
             ORDER BY Feedback.time DESC LIMIT 1"
        );
        $array = $queryResult->fetch_array();

        return json_encode($array);
    }
}

class InsertAnswerQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $this->connection->query(
            "CALL InsertToAnswer(\"$params[0]\", \"$params[1]\",
                \"$params[2]\", $params[3], 
                $params[4], $params[5], $params[6], $params[7], \"$params[8]\")"
        );

        $queryResult = $this->connection->query(
            "SELECT Answer.time From Answer
             INNER JOIN Question ON Question.questionCode = Answer.questionCode
             WHERE Question.chapterNumber = $params[4] AND Question.problemNumber = $params[5] AND
             Question.solutionNumber= $params[6] AND Question.number = $params[7]"
        );
        $array = $queryResult->fetch_array();

        return json_encode($array);
    }
}

class IntegrateMenteeQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $emailAddress = $params[0];

        $integrateApplyBook = json_decode($params[1]);
        $integratePlayShelf = json_decode($params[2]);
        $integrateBookmarkCard = json_decode($params[3]);

        $applyBook = new ApplyBook();
        $applyBook->Impose($integrateApplyBook);
        $this->IntegrateApply($applyBook, $emailAddress);

        $playShelf = new PlayShelf();
        $playShelf->ImposeMentee($integratePlayShelf);
        $this->IntegratePlay($playShelf, $emailAddress);

        $bookmarkCard = new BookmarkCard();
        $bookmarkCard->Impose($integrateBookmarkCard);
        $this->IntegrateBookmark($bookmarkCard, $emailAddress);
    }

    private function IntegrateApply($applyBook, $emailAddress)
    {
        $i = 0;
        while ($i < $applyBook->GetLength()) {
            $applyCard = $applyBook->GetAt($i);
            $time = $applyCard->GetTime()->GetString();
            $start = $applyCard->GetStart()->GetString();
            $end = $applyCard->GetEnd()->GetString();

            $queryResult = $this->connection->query(
                "SELECT Apply.time, Apply.start, Apply.end, Apply.applyCode From Apply
                 INNER JOIN Mentee ON Mentee.emailAddress = \"$emailAddress\" 
                 WHERE Apply.menteeCode = Mentee.menteeCode AND 
                 Apply.time = \"$time\""
            );
            $array = $queryResult->fetch_array();

            if ($time != $array[0] || $start != $array[1] || $end != $array[2]) {
                $this->connection->query(
                    "UPDATE Apply 
                     SET Apply.time = \"$time\", Apply.start = \"$start\", Apply.end = \"$end\"
                     WHERE Apply.applyCode = \"$array[3]\""
                );
            }

            $i++;
        }
    }

    private function IntegratePlay($playShelf, $emailAddress)
    {
        $this->connection->query("CALL GetCodeFromCurrentApply(\"$emailAddress\", @applyCode)");
        $applyCode = $this->connection->query("SELECT @applyCode")->fetch_array()[0];

        $i = 0;
        while ($i < $playShelf->GetLength()) {
            $playCase = $playShelf->GetAt($i);

            $solutionBook = $playCase->GetAt(0);
            $this->IntegrateSolution($solutionBook, $applyCode);

            $questionBook = $playCase->GetAt(1);
            $this->IntegrateQuestion($questionBook, $applyCode);

            $i++;
        }
    }

    private function IntegrateBookmark($bookmarkCard, $emailAddress)
    {
        $this->connection->query("CALL GetCodeFromCurrentApply(\"$emailAddress\", @applyCode)");

        $queryResult = $this->connection->query("SELECT Bookmark.location FROM Bookmark WHERE Bookmark.applyCode = @applyCode");
        $array = $queryResult->fetch_array();

        $location = $bookmarkCard->GetChapterNumber();
        if ($array[0] != $location) {
            $this->connection->query(
                "UPDATE Bookmark SET Bookmark.location = $location WHERE Bookmark.applyCode = @applyCode"
            );
        }
    }

    private function IntegrateSolution($solutionBook, $applyCode)
    {
        $i = 0;
        while ($i < $solutionBook->GetLength()) {
            $solutionList = $solutionBook->GetAt($i);
            $problem = $solutionList->GetProblem();
            $j = 0;
            while ($j < $solutionList->GetLength()) {
                $solution = $solutionList->GetAt($j);
                $time = $solution->GetTime()->GetString();
                $content = $solution->GetContent();
                $image = $solution->GetImage();

                $dataURL = $image;
                $data = str_replace('data:image/jpeg;base64,', '', $dataURL);
                $data = str_replace(' ', '+', $data);
                $imageData = base64_decode($data);

                $chapterNumber = $problem->GetChapterNumber();
                $problemNumber = $problem->GetNumber();
                $number = $solution->GetNumber();

                // 다른지 확인한다.
                $queryResult = $this->connection->query(
                    "SELECT Solution.time, Solution.content, Solution.image, Solution.solutionCode From Solution
                     WHERE Solution.applyCode = \"$applyCode\" AND 
                     Solution.chapterNumber = $chapterNumber AND 
                     Solution.problemNumber = $problemNumber AND
                     Solution.number= $number"
                );
                $array = $queryResult->fetch_array();

                // 다르면 갱신한다.
                if ($time != $array[0] || $content != $array[1] || $imageData != $array[2]) {
                    $stmt = $this->connection->prepare(
                        "UPDATE Solution 
                         SET Solution.time = \"$time\", Solution.content = \"$content\", Solution.image = ?
                         WHERE Solution.solutionCode = \"$array[3]\""
                    );
    
                    $null = NULL;
                    $stmt->bind_param("b", $null);
                    $stmt->send_long_data(0, $imageData);
                    $stmt->execute();
                }

                $j++;
            }
            $i++;
        }
    }

    private function IntegrateQuestion($questionBook, $applyCode)
    {
        $i = 0;
        while ($i < $questionBook->GetLength()) {
            $questionList = $questionBook->GetAt($i);
            $problem = $questionList->GetProblem();
            $solution = $questionList->GetSolution();
            $j = 0;
            while ($j < $questionList->GetLength()) {
                $question = $questionList->GetAt($j);
                $time = $question->GetTime()->GetString();
                $content = $question->GetContent();

                $chapterNumber = $problem->GetChapterNumber();
                $problemNumber = $problem->GetNumber();
                $solutionNumber = $solution->GetNumber();
                $number = $question->GetNumber();

                // 다른지 확인한다.
                $queryResult = $this->connection->query(
                    "SELECT Question.time, Question.content, Question.questionCode From Question
                     WHERE Question.applyCode = \"$applyCode\" AND 
                     Question.chapterNumber = $chapterNumber AND 
                     Question.problemNumber = $problemNumber AND
                     Question.solutionNumber = $solutionNumber AND 
                     Question.number = $number"
                );
                $array = $queryResult->fetch_array();

                // 다르면 갱신한다.
                if ($time != $array[0] || $content != $array[1]) {
                    $this->connection->query(
                        "UPDATE Question 
                         SET Question.time = \"$time\", Question.content = \"$content\"
                         WHERE Question.questionCode = \"$array[2]\""
                    );
                }

                $j++;
            }
            $i++;
        }
    }
}

class IntegrateMentoQuery extends DatabaseQuery
{
    public function __construct()
    {
        parent::__construct();
    }

    function __destruct()
    {
        parent::__destruct();
    }

    public function Query(...$params)
    {
        $emailAddress = $params[0];

        $integratePlayShelf = json_decode($params[1]);

        $playShelf = new PlayShelf();
        $playShelf->ImposeMento($integratePlayShelf);
        $this->IntegratePlay($playShelf, $emailAddress);
    }

    private function IntegratePlay($playShelf, $emailAddress)
    {
        $i = 0;
        while ($i < $playShelf->GetLength()) {
            $playCase = $playShelf->GetAt($i);

            $feedbackBook = $playCase->GetAt(0);
            $this->IntegrateFeedback($feedbackBook, $emailAddress);

            $answerBook = $playCase->GetAt(1);
            $this->IntegrateAnswer($answerBook, $emailAddress);

            $i++;
        }
    }

    private function IntegrateFeedback($feedbackBook, $emailAddress)
    {
        $i = 0;
        while ($i < $feedbackBook->GetLength()) {
            $feedbackList = $feedbackBook->GetAt($i);

            $j = 0;
            while ($j < $feedbackList->GetLength()) {
                $feedback = $feedbackList->GetAt($j);
                $time = $feedback->GetTime()->GetString();
                $content = $feedback->GetContent();
                $evaluate = $feedback->GetEvaluate();

                // 다른지 확인한다.
                $queryResult = $this->connection->query(
                    "SELECT Feedback.time, Feedback.content, Feedback.evaluate, Feedback.feedbackCode From Feedback
                     INNER JOIN Mento ON Mento.emailAddress = \"$emailAddress\" 
                     WHERE Feedback.mentoCode = Mento.mentoCode AND 
                     Feedback.time = \"$time\""
                );
                $array = $queryResult->fetch_array();

                // 다르면 갱신한다.
                if ($time != $array[0] || $content != $array[1] || $evaluate != $array[2]) {
                    $this->connection->query(
                        "UPDATE Feedback 
                         SET Feedback.time = \"$time\", Feedback.content = \"$content\", Feedback.evaluate = $evaluate
                         WHERE Feedback.feedbackCode = \"$array[3]\""
                    );
                }

                $j++;
            }
            $i++;
        }
    }

    private function IntegrateAnswer($answerBook, $emailAddress)
    {
        $i = 0;
        while ($i < $answerBook->GetLength()) {
            $answerCard = $answerBook->GetAt($i);

            $answer = $answerCard->GetAt(0);
            $time = $answer->GetTime()->GetString();
            $content = $answer->GetContent();

            // 다른지 확인한다.
            $queryResult = $this->connection->query(
                "SELECT Answer.time, Answer.content, Answer.answerCode From Answer
                 INNER JOIN Mento ON Mento.emailAddress = \"$emailAddress\" 
                 WHERE Answer.mentoCode = Mento.mentoCode AND 
                 Answer.time = \"$time\""
            );
            $array = $queryResult->fetch_array();

            // 다르면 갱신한다.
            if ($time != $array[0] || $content != $array[1]) {
                $this->connection->query(
                    "UPDATE Answer 
                     SET Answer.time = \"$time\", Answer.content = \"$content\"
                     WHERE Answer.answerCode = \"$array[2]\""
                );
            }

            $i++;
        }
    }
}
