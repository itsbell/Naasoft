<?php

require_once("./BusinessObject.php");

class Mentoring
{
    public $connection;

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

    public function GetAllCourse()
    {
        $queryResult = $this->connection->query(
            "SELECT Course.name FROM Course ORDER BY Course.courseCode"
        );

        $courseList = new CourseList();

        // $courses = array();
        // $i = 0;
        while ($row = mysqli_fetch_array($queryResult)) {
            $course = new Course(htmlspecialchars($row[0]));
            $courseList->Add($course);
            // $courses[$i] = array(
            //     'name' => htmlspecialchars($course[0])
            // );
            // $i++;
        }

        $json = $courseList->Expose();
        return $json;

        // $result = "";
        // $row = chr(8);
        // $column = chr(127);
        // $i = 0;
        // while ($i < count($courses)) {
        //     $course = $courses[$i];
        //     $result .= $course['name'];
        //     $result .= $column;
        //     $result .= $row;
        //     $i++;
        // }

        // return $result;
    }

    public function GetAllStep()
    {
        $queryResult = $this->connection->query(
            "SELECT Course.name, Step.number, Step.subject, Step.price, Step.period FROM Step INNER JOIN Course ON Course.courseCode = Step.courseCode"
        );

        $stepBook = new StepBook();

        while ($row = mysqli_fetch_array($queryResult)) {
            $index = $stepBook->Find(htmlspecialchars($row[0]));
            if ($index == -1) {
                $course = new Course(htmlspecialchars($row[0]));
                $stepCard = new StepCard($course);
                $stepBook->Add($stepCard);
            } else {
                $stepCard = $stepBook->GetAt($index);
            }

            $step = new Step(
                htmlspecialchars($row[1]),
                htmlspecialchars($row[2]),
                htmlspecialchars($row[3]),
                htmlspecialchars($row[4])
            );
            $stepCard->Add($step);
        }

        $json = $stepBook->Expose();
        return $json;

        // $steps = array();
        // $i = 0;
        // while ($step = mysqli_fetch_array($queryResult)) {
        //     $steps[$i] = array(
        //         'subject' => htmlspecialchars($step[0]),
        //         'price' => htmlspecialchars($step[1]),
        //         'period' => htmlspecialchars($step[2]),
        //         'courseName' => htmlspecialchars($step[3])
        //     );
        //     $i++;
        // }

        // $result = "";
        // $row = chr(8);
        // $column = chr(127);
        // $i = 0;
        // while ($i < count($steps)) {
        //     $step = $steps[$i];
        //     $result .= $step['subject'];
        //     $result .= $column;
        //     $result .= $step['price'];
        //     $result .= $column;
        //     $result .= $step['period'];
        //     $result .= $column;
        //     $result .= $step['courseName'];
        //     $result .= $column;
        //     $result .= $row;
        //     $i++;
        // }

        // return $result;
    }

    public function CheckMentee($emailAddress, $password)
    {
        $this->connection->query("CALL CheckInMentee(\"$emailAddress\", \"$password\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function GetMentee($emailAddress)
    {
        $this->connection->query("CALL GetFromMentee(\"$emailAddress\", @name, @emailAddress)");
        $queryResult = $this->connection->query("SELECT @name, @emailAddress");

        $row = $queryResult->fetch_array();

        $menteeCard = new MenteeCard();
        $mentee = new Mentee($row[0], $row[1]);
        $menteeCard->Add($mentee);

        $json = $menteeCard->Expose();

        return $json;
    }

    public function GetAllApply($emailAddress)
    {
        $queryResult = $this->connection->query(
            "SELECT Apply.time, Apply.state, Apply.start, Apply.end, Course.name, Step.number, Payment.orderId FROM Apply 
            LEFT JOIN Payment ON Payment.applyCode = Apply.applyCode 
            LEFT JOIN Step ON Step.stepCode = Apply.stepCode 
            LEFT JOIN Course ON Course.courseCode = Step.courseCode 
            LEFT JOIN Mentee ON Mentee.menteeCode = Apply.menteeCode 
            WHERE Mentee.emailAddress = \"$emailAddress\" ORDER BY Apply.time"
        );

        $applies = array();
        $i = 0;
        while ($apply = mysqli_fetch_array($queryResult)) {
            $applies[$i] = array(
                'time' => htmlspecialchars($apply[0]),
                'state' => htmlspecialchars($apply[1]),
                'start' => htmlspecialchars($apply[2]),
                'end' => htmlspecialchars($apply[3]),
                'courseName' => htmlspecialchars($apply[4]),
                'stepNumber' => htmlspecialchars($apply[5]),
                'orderId' => htmlspecialchars($apply[6])
            );
            $i++;
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($applies)) {
            $apply = $applies[$i];
            $result .= $apply['time'];
            $result .= $column;
            $result .= $apply['state'];
            $result .= $column;
            $result .= $apply['start'];
            $result .= $column;
            $result .= $apply['end'];
            $result .= $column;
            $result .= $apply['courseName'];
            $result .= $column;
            $result .= $apply['stepNumber'];
            $result .= $column;
            $result .= $apply['orderId'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function GetProblems($courseName, $stepNumber)
    {
        $this->connection->query("CALL GetCodeFromStepByCourseNameAndStepNumber(\"$courseName\", $stepNumber, @stepCode)");
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

    public function GetSolutions($emailAddress, $courseName, $stepNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Solution.chapterNumber, Solution.problemNumber, Solution.number, Solution.time, Solution.state 
            FROM Solution WHERE Solution.applyCode = @applyCode ORDER BY Solution.time"
        );

        $solutions = array();
        $i = 0;
        while ($solution = mysqli_fetch_array($queryResult)) {
            $solutions[$i] = array(
                'chapterNumber' => htmlspecialchars($solution[0]),
                'problemNumber' => htmlspecialchars($solution[1]),
                'number' => htmlspecialchars($solution[2]),
                'time' => htmlspecialchars($solution[3]),
                'state' => htmlspecialchars($solution[4])
            );
            $i++;
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($solutions)) {
            $solution = $solutions[$i];
            $result .= $solution['chapterNumber'];
            $result .= $column;
            $result .= $solution['problemNumber'];
            $result .= $column;
            $result .= $solution['number'];
            $result .= $column;
            $result .= $solution['time'];
            $result .= $column;
            $result .= $solution['state'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function InsertSolution($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $content, $image)
    {
        $this->connection->query("CALL InsertToSolution(\"$emailAddress\", \"$courseName\", $stepNumber, 
            $chapterNumber, $problemNumber, \"$content\", \"$image\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function GetSolution($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)
    {
        $this->connection->query("CALL GetFromSolution(\"$emailAddress\", \"$courseName\", $stepNumber, 
            $chapterNumber, $problemNumber, $solutionNumber, @time, @state, @content,
            @abstract, @logical, @solve, @critical, @language, @debugging)");
        $queryResult = $this->connection->query("SELECT @time, @state, @content, @abstract, @logical, @solve, @critical, @language, @debugging");

        $array = $queryResult->fetch_array();

        $column = chr(127);
        $result = $chapterNumber;
        $result .= $column;
        $result .= $problemNumber;
        $result .= $column;
        $result .= $solutionNumber;
        $result .= $column;
        $result .= $array[0];
        $result .= $column;
        $result .= $array[1];
        $result .= $column;
        $result .= $array[2];
        $result .= $column;
        $result .= $array[3];
        $result .= $column;
        $result .= $array[4];
        $result .= $column;
        $result .= $array[5];
        $result .= $column;
        $result .= $array[6];
        $result .= $column;
        $result .= $array[7];
        $result .= $column;
        $result .= $array[8];
        $result .= $column;

        return $result;
    }

    public function GetSolutionImage($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $number)
    {
        $this->connection->query("CALL GetImageFromSolution(\"$emailAddress\", \"$courseName\", \"$stepNumber\",
        \"$chapterNumber\", \"$problemNumber\", \"$number\", @image)");
        $queryResult = $this->connection->query("SELECT @image");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function InsertAuthentication($emailAddress)
    {
        $this->connection->query("CALL InsertToAuthentication(\"$emailAddress\", @authenticationCode)");
        $queryResult = $this->connection->query("SELECT @authenticationCode");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function CheckEmailAddress($emailAddress)
    {
        $this->connection->query("CALL IsExistEmailAddress(\"$emailAddress\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function CheckAuthentication($emailAddress, $authenticationCode)
    {
        $this->connection->query("CALL CheckInAuthentication(\"$emailAddress\", \"$authenticationCode\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function InsertMentee($name, $emailAddress, $password)
    {
        $this->connection->query("
        CALL InsertToMentee(\"$name\", \"$emailAddress\",\"$password\")
        ");
    }

    public function ClearAuthentication($minute)
    {
        $this->connection->query("
        CALL ClearFromAuthentication($minute)
        ");
    }

    public function InsertApply($emailAddress, $courseName, $stepNumber)
    {
        $this->connection->query("
        CALL InsertToApply(\"$emailAddress\", \"$courseName\", \"$stepNumber\")
        ");
    }

    public function InsertPayment($emailAddress, $orderId, $orderName, $price)
    {
        $this->connection->query("
        CALL InsertToPayment(\"$emailAddress\", \"$orderId\", \"$orderName\", $price)
        ");
    }

    public function CheckMento($emailAddress, $password)
    {
        $this->connection->query("CALL CheckInMento(\"$emailAddress\", \"$password\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function GetMento($emailAddress)
    {
        $this->connection->query("CALL GetFromMento(\"$emailAddress\", @name, @emailAddress)");
        $queryResult = $this->connection->query("SELECT @name, @emailAddress");

        $array = $queryResult->fetch_array();

        $column = chr(127);
        $result = $array[0];
        $result .= $column;
        $result .= $array[1];
        $result .= $column;
        //홍길동;hong@naasoft.com;

        return $result;
    }

    public function GetFeedbacks($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $number)
    {
        $this->connection->query("CALL GetCodeFromSolutionSpecified(\"$emailAddress\", \"$courseName\", $stepNumber, 
            $chapterNumber, $problemNumber, $number, @solutionCode)");
        $queryResult = $this->connection->query(
            "SELECT Feedback.time, Feedback.content, Feedback.evaluate 
            FROM Feedback 
            WHERE Feedback.solutionCode = @solutionCode ORDER BY Feedback.time"
        );

        $feedbacks = array();
        $i = 0;
        while ($feedback = mysqli_fetch_array($queryResult)) {
            $feedbacks[$i] = array(
                'time' => htmlspecialchars($feedback[0]),
                'content' => $feedback[1],
                'evaluate' => htmlspecialchars($feedback[2]),
            );
            $i++;
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($feedbacks)) {
            $feedback = $feedbacks[$i];
            $result .= $feedback['time'];
            $result .= $column;
            $result .= $feedback['content'];
            $result .= $column;
            $result .= $feedback['evaluate'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function CheckFeedbacks($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)
    {
        $this->connection->query("CALL CheckToFeedback(\"$emailAddress\", \"$courseName\", $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)");
    }

    public function GetQuestions($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Question.time, Question.content 
            FROM Question 
            WHERE Question.applyCode = @applyCode AND Question.chapterNumber = $chapterNumber AND 
            Question.problemNumber = $problemNumber AND Question.solutionNumber = $solutionNumber"
        );

        $questions = array();
        $i = 0;
        while ($question = mysqli_fetch_array($queryResult)) {
            $questions[$i] = array(
                'time' => htmlspecialchars($question[0]),
                'content' => $question[1]
            );
            $i++;
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($questions)) {
            $question = $questions[$i];
            $result .= $question['time'];
            $result .= $column;
            $result .= $question['content'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function CheckQuestions($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)
    {
        $this->connection->query("CALL CheckToQuestion(\"$emailAddress\", \"$courseName\", $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)");
    }

    public function InsertAnswer($mentoEmailAddress, $menteeEmailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber, $questionNumber, $content)
    {
        $this->connection->query("CALL InsertToAnswer(\"$mentoEmailAddress\", \"$menteeEmailAddress\",
            \"$courseName\", $stepNumber, 
            $chapterNumber, $problemNumber, $solutionNumber, $questionNumber, \"$content\")");
    }

    public function GetAnswers($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Answer.time, Answer.content 
            FROM Answer 
            INNER JOIN Question ON Question.applyCode = @applyCode AND Question.chapterNumber = $chapterNumber AND 
            Question.problemNumber = $problemNumber AND Question.solutionNumber = $solutionNumber 
            WHERE Answer.questionCode = Question.questionCode"
        );

        $answers = array();
        $i = 0;
        while ($answer = mysqli_fetch_array($queryResult)) {
            $answers[$i] = array(
                'time' => htmlspecialchars($answer[0]),
                'content' => $answer[1]
            );
            $i++;
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($answers)) {
            $answer = $answers[$i];
            $result .= $answer['time'];
            $result .= $column;
            $result .= $answer['content'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function CheckAnswers($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)
    {
        $this->connection->query("CALL CheckToAnswer(\"$emailAddress\", \"$courseName\", $stepNumber, 
            $chapterNumber, $problemNumber, $solutionNumber)");
    }

    public function GetSolutionWorkCards()
    {
        $queryResult = $this->connection->query("SELECT * FROM ViewSolutionWork;");

        $works = array();
        $i = 0;
        while ($work = mysqli_fetch_array($queryResult)) {
            $works[$i] = array(
                'solutionTime' => htmlspecialchars($work[0]),
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

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($works)) {
            $work = $works[$i];
            $result .= $work['solutionTime'];
            $result .= $column;
            $result .= $work['menteeName'];
            $result .= $column;
            $result .= $work['menteeEmailAddress'];
            $result .= $column;
            $result .= $work['courseName'];
            $result .= $column;
            $result .= $work['stepNumber'];
            $result .= $column;
            $result .= $work['chapterNumber'];
            $result .= $column;
            $result .= $work['problemNumber'];
            $result .= $column;
            $result .= $work['solutionNumber'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function GetQuestionWorkCards()
    {
        $queryResult = $this->connection->query("SELECT * FROM ViewQuestionWork;");

        $works = array();
        $i = 0;
        while ($work = mysqli_fetch_array($queryResult)) {
            $works[$i] = array(
                'questionTime' => htmlspecialchars($work[0]),
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

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($works)) {
            $work = $works[$i];
            $result .= $work['questionTime'];
            $result .= $column;
            $result .= $work['menteeName'];
            $result .= $column;
            $result .= $work['menteeEmailAddress'];
            $result .= $column;
            $result .= $work['courseName'];
            $result .= $column;
            $result .= $work['stepNumber'];
            $result .= $column;
            $result .= $work['chapterNumber'];
            $result .= $column;
            $result .= $work['problemNumber'];
            $result .= $column;
            $result .= $work['solutionNumber'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function InsertFeedback($mentoEmailAddress, $menteeEmailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber, $evaluate, $content)
    {
        $queryResult = $this->connection->query("CALL InsertToFeedback(\"$mentoEmailAddress\", \"$menteeEmailAddress\",
            \"$courseName\", $stepNumber, 
            $chapterNumber, $problemNumber, $solutionNumber, $evaluate, \"$content\")");
    }

    public function GetCurrentApplyFeedbacks($emailAddress, $courseName, $stepNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
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
            $feedback = new Feedback($row[0], $row[1], (int)$row[2]);
            $feedbackList->Add($feedback);
        }

        $json = $feedbackBook->Expose();

        return $json;
    }

    public function GetFeedbackWorkCards($emailAddress)
    {
        $this->connection->query("CALL GetCodeFromCurrentApply(\"$emailAddress\", @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Feedback.time, Mento.name, Mento.emailAddress, 
            Course.name, Step.number, Solution.chapterNumber, Solution.problemNumber, Solution.number 
            FROM Feedback 
            INNER JOIN Mento ON Mento.mentoCode = Feedback.mentoCode 
            INNER JOIN Solution ON Solution.solutionCode = Feedback.solutionCode 
            INNER JOIN Apply ON Apply.applyCode = Solution.applyCode 
            INNER JOIN Step ON Step.stepCode = Apply.stepCode 
            INNER JOIN Course ON Course.courseCode = Step.courseCode 
            WHERE Apply.applyCode = @applyCode AND Feedback.state = \"UNCHECKED\" ORDER BY Feedback.time"
        );

        $works = array();

        if ($queryResult->num_rows > 0) {
            $i = 0;
            while ($work = mysqli_fetch_array($queryResult)) {
                $works[$i] = array(
                    'feedbackTime' => htmlspecialchars($work[0]),
                    'mentoName' => htmlspecialchars($work[1]),
                    'mentoEmailAddress' => htmlspecialchars($work[2]),
                    'courseName' => htmlspecialchars($work[3]),
                    'stepNumber' => htmlspecialchars($work[4]),
                    'chapterNumber' => htmlspecialchars($work[5]),
                    'problemNumber' => htmlspecialchars($work[6]),
                    'solutionNumber' => htmlspecialchars($work[7])
                );
                $i++;
            }
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($works)) {
            $work = $works[$i];
            $result .= $work['feedbackTime'];
            $result .= $column;
            $result .= $work['mentoName'];
            $result .= $column;
            $result .= $work['mentoEmailAddress'];
            $result .= $column;
            $result .= $work['courseName'];
            $result .= $column;
            $result .= $work['stepNumber'];
            $result .= $column;
            $result .= $work['chapterNumber'];
            $result .= $column;
            $result .= $work['problemNumber'];
            $result .= $column;
            $result .= $work['solutionNumber'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function GetAnswerWorkCards($emailAddress)
    {
        $this->connection->query("CALL GetCodeFromCurrentApply(\"$emailAddress\", @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Answer.time, Mento.name, Mento.emailAddress, 
            Course.name, Step.number, Question.chapterNumber, Question.problemNumber, Question.solutionNumber  
            FROM Answer 
            INNER JOIN Mento ON Mento.mentoCode = Answer.mentoCode 
            INNER JOIN Question ON Question.questionCode = Answer.questionCode 
            INNER JOIN Apply ON Apply.applyCode = Question.applyCode 
            INNER JOIN Step ON Step.stepCode = Apply.stepCode 
            INNER JOIN Course ON Course.courseCode = Step.courseCode 
            WHERE Apply.applyCode = @applyCode AND Answer.state = \"UNCHECKED\" ORDER BY Answer.time"
        );

        $works = array();

        if ($queryResult->num_rows > 0) {
            $i = 0;
            while ($work = mysqli_fetch_array($queryResult)) {
                $works[$i] = array(
                    'answerTime' => htmlspecialchars($work[0]),
                    'mentoName' => htmlspecialchars($work[1]),
                    'mentoEmailAddress' => htmlspecialchars($work[2]),
                    'courseName' => htmlspecialchars($work[3]),
                    'stepNumber' => htmlspecialchars($work[4]),
                    'chapterNumber' => htmlspecialchars($work[5]),
                    'problemNumber' => htmlspecialchars($work[6]),
                    'solutionNumber' => htmlspecialchars($work[7])
                );
                $i++;
            }
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($works)) {
            $work = $works[$i];
            $result .= $work['answerTime'];
            $result .= $column;
            $result .= $work['mentoName'];
            $result .= $column;
            $result .= $work['mentoEmailAddress'];
            $result .= $column;
            $result .= $work['courseName'];
            $result .= $column;
            $result .= $work['stepNumber'];
            $result .= $column;
            $result .= $work['chapterNumber'];
            $result .= $column;
            $result .= $work['problemNumber'];
            $result .= $column;
            $result .= $work['solutionNumber'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function TotalAbility($emailAddress)
    {
        $this->connection->query("CALL GetAbstractAverageFromEvaluate(\"$emailAddress\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $abstracts = $queryResult->fetch_array();

        $this->connection->query("CALL GetLogicalAverageFromEvaluate(\"$emailAddress\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $logicals = $queryResult->fetch_array();

        $this->connection->query("CALL GetSolveAverageFromEvaluate(\"$emailAddress\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $solves = $queryResult->fetch_array();

        $this->connection->query("CALL GetCriticalAverageFromEvaluate(\"$emailAddress\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $criticals = $queryResult->fetch_array();

        $this->connection->query("CALL GetLanguageAverageFromEvaluate(\"$emailAddress\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $languages = $queryResult->fetch_array();

        $this->connection->query("CALL GetDebuggingAverageFromEvaluate(\"$emailAddress\", @second, @first, @now)");
        $queryResult = $this->connection->query("SELECT @second, @first, @now");
        $debuggings = $queryResult->fetch_array();

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < 3) {
            $result .= $abstracts[$i];
            $result .= $column;
            $result .= $logicals[$i];
            $result .= $column;
            $result .= $solves[$i];
            $result .= $column;
            $result .= $criticals[$i];
            $result .= $column;
            $result .= $languages[$i];
            $result .= $column;
            $result .= $debuggings[$i];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function GetCurrentApplyQuestions($emailAddress, $courseName, $stepNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Question.time, Question.content, Question.chapterNumber, Question.problemNumber, Question.solutionNumber, Question.number
            FROM Question WHERE Question.applyCode = @applyCode"
        );

        $questionBook = new QuestionBook();

        while ($row = mysqli_fetch_array($queryResult)) {
            $index = $questionBook->Find((int)$row[3], (int)$row[4], (int)$row[5]);
            if ($index == -1) {
                $problem = new Problem((int)$row[3], (int)$row[4], null, null, null);
                $solution = new Solution(null, null, (int)$row[4], null, null);
                $index = $questionBook->Add(new QuestionList($problem, $solution));
            }
            $questionList = $questionBook->GetAt($index);
            $question = new Question((int)$row[5], $row[0], $row[1]);
            $questionList->Add($question);
        }

        $json = $questionBook->Expose();

        return $json;
    }

    public function GetCurrentApplyAnswers($emailAddress, $courseName, $stepNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
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
            $answer = new Answer($row[0], $row[1]);
            $answerCard->Add($answer);
        }

        $json = $answerBook->Expose();

        return $json;
    }

    public function GetQuestionsAndAnswers($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $solutionNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Question.time, Question.content, Answer.time, Answer.content 
            FROM Question 
            LEFT JOIN Answer ON Answer.questionCode = Question.questionCode 
            WHERE Question.applyCode = @applyCode AND Question.chapterNumber = $chapterNumber AND 
            Question.problemNumber = $problemNumber AND Question.solutionNumber = $solutionNumber ORDER BY Question.time"
        );

        $questions = array();
        $i = 0;
        while ($question = mysqli_fetch_array($queryResult)) {
            $questions[$i] = array(
                'questionTime' => $question[0],
                'questionContent' => $question[1],
                'answerTime' => $question[2],
                'answerContent' => $question[3]
            );
            $i++;
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($questions)) {
            $question = $questions[$i];
            $result .= $question['questionTime'];
            $result .= $column;
            $result .= $question['questionContent'];
            $result .= $column;
            $result .= $question['answerTime'];
            $result .= $column;
            $result .= $question['answerContent'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function GetAllQuestionsAndAnswers($emailAddress, $courseName, $stepNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Question.time, Question.chapterNumber, Question.problemNumber, Question.solutionNumber, 
            Question.content, Answer.time, Answer.content 
            FROM Question 
            LEFT JOIN Answer ON Answer.questionCode = Question.questionCode 
            WHERE Question.applyCode = @applyCode"
        );

        $questions = array();
        $i = 0;
        while ($question = mysqli_fetch_array($queryResult)) {
            $questions[$i] = array(
                'questionTime' => $question[0],
                'questionChapterNumber' => $question[1],
                'questionProblemNumber' => $question[2],
                'questionSolutionNumber' => $question[3],
                'questionContent' => $question[4],
                'answerTime' => $question[5],
                'answerContent' => $question[6]
            );
            $i++;
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($questions)) {
            $question = $questions[$i];
            $result .= $question['questionTime'];
            $result .= $column;
            $result .= $question['questionChapterNumber'];
            $result .= $column;
            $result .= $question['questionProblemNumber'];
            $result .= $column;
            $result .= $question['questionSolutionNumber'];
            $result .= $column;
            $result .= $question['questionContent'];
            $result .= $column;
            $result .= $question['answerTime'];
            $result .= $column;
            $result .= $question['answerContent'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function GetMentees()
    {
        $queryResult = $this->connection->query("SELECT * FROM ViewMentee;");

        $works = array();
        $i = 0;
        while ($work = mysqli_fetch_array($queryResult)) {
            $works[$i] = array(
                'menteeName' => $work[0],
                'menteeEmailAddress' => $work[1],
                'courseName' => $work[2],
                'stepNumber' => $work[3]
            );
            $i++;
        }

        $result = "";
        $row = chr(8);
        $column = chr(127);
        $i = 0;
        while ($i < count($works)) {
            $work = $works[$i];
            $result .= $work['menteeName'];
            $result .= $column;
            $result .= $work['menteeEmailAddress'];
            $result .= $column;
            $result .= $work['courseName'];
            $result .= $column;
            $result .= $work['stepNumber'];
            $result .= $column;
            $result .= $row;
            $i++;
        }

        return $result;
    }

    public function UpdatePassword($emailAddress, $password)
    {
        $queryResult = $this->connection->query(
            "UPDATE Mentee SET Mentee.password = \"$password\" WHERE Mentee.emailAddress = \"$emailAddress\""
        );

        return $queryResult;
    }

    public function LeaveMentee($emailAddress)
    {
        $this->connection->query("CALL LeaveFromMentee(\"$emailAddress\", @result)");
        $queryResult = $this->connection->query("SELECT @result");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function ClearEmptyMentee()
    {
        $this->connection->query("CALL ClearEmptyFromMentee()");
    }

    public function UpdateImage($emailAddress, $chapterNumber, $problemNumber, $solutionNumber, $imageData)
    {
        $this->connection->query("CALL GetCodeFromCurrentApply(\"$emailAddress\", @applyCode)");
        $queryResult = $this->connection->query(
            "UPDATE Soltuion SET Solution.image = \"$imageData\"
            WHERE Soltuion.applyCode = @applyCode AND
            Soltuion.chapterNumber = $chapterNumber AND
            Soltuion.problemNumber = $problemNumber AND
            Solution.number = $solutionNumber"
        );

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function GetSolutionBinaryImage($emailAddress, $courseName, $stepNumber, $chapterNumber, $problemNumber, $number)
    {
        $this->connection->query("CALL GetImageFromSolution(\"$emailAddress\", \"$courseName\", \"$stepNumber\",
        \"$chapterNumber\", \"$problemNumber\", \"$number\", @image)");
        $queryResult = $this->connection->query("SELECT @image");

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }

    public function GetCurrentApplySolutions($emailAddress, $courseName, $stepNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
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
            $solution = new Solution($row[0], $row[1], (int)$row[4], $row[5], null);
            $solutionList->Add($solution);
        }
        $json = $solutionBook->Expose();

        return $json;
    }

    public function GetCurrentApplySolutionImages($emailAddress, $courseName, $stepNumber, $index)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT Solution.chapterNumber, Solution.problemNumber, Solution.number, Solution.image
            FROM Solution WHERE Solution.applyCode = @applyCode ORDER BY Solution.time LIMIT $index, 5"
        );

        $result = array();
        $i = 0;
        while ($image = mysqli_fetch_array($queryResult)) {
            $result[$i] = array();
            $result[$i][0] = $image[0];
            $result[$i][1] = $image[1];
            $result[$i][2] = $image[2];
            $result[$i][3] = "data:image/jpeg;base64," . base64_encode($image[3]);
            $i++;
        }

        return $result;
    }

    public function GetCurrentApplySolutionCount($emailAddress, $courseName, $stepNumber)
    {
        $this->connection->query("CALL GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(\"$emailAddress\", \"$courseName\", $stepNumber, @applyCode)");
        $queryResult = $this->connection->query(
            "SELECT COUNT(*) FROM Solution WHERE Solution.applyCode = @applyCode"
        );

        $array = $queryResult->fetch_array();

        $result = $array[0];

        return $result;
    }
}
