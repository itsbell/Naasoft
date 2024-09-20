CREATE TABLE Course (
name VARCHAR(32) NOT NULL,
courseCode CHAR(4) NOT NULL,
CONSTRAINT CourseUQ UNIQUE(name),
CONSTRAINT CoursePK PRIMARY KEY(courseCode)
);

CREATE TABLE Step (
number INT NOT NULL,
subject VARCHAR(250) NOT NULL,
price DECIMAL(15, 2) NOT NULL,
period INT NOT NULL,
stepCode CHAR(6) NOT NULL,
courseCode CHAR(4) NOT NULL,
CONSTRAINT StepPK PRIMARY KEY(stepCode),
CONSTRAINT Course_StepFK FOREIGN KEY(courseCode) REFERENCES Course(courseCode)
);

CREATE TABLE Mentee (
name VARCHAR(10) NOT NULL,
emailAddress VARCHAR(250) NOT NULL,
password VARCHAR(128) NOT NULL,
time DATETIME NOT NULL,
menteeCode CHAR(9) NOT NULL,
CONSTRAINT MenteeUQ UNIQUE(emailAddress),
CONSTRAINT MenteePK PRIMARY KEY(menteeCode)
);

CREATE TABLE Authentication (
time DATETIME NOT NULL,
emailAddress VARCHAR(250) NOT NULL,
authenticationCode CHAR(6) NOT NULL
);

CREATE TABLE Apply (
time DATETIME NOT NULL,
state VARCHAR(16) NOT NULL DEFAULT 'DEAD' CHECK(state IN ('DEAD', 'ALIVE')),
start DATETIME NULL,
end DATETIME NULL,
applyCode CHAR(18) NOT NULL,
menteeCode CHAR(9) NOT NULL,
stepCode CHAR(6) NOT NULL,
CONSTRAINT ApplyPK PRIMARY KEY(applyCode),
CONSTRAINT Mentee_ApplyFK FOREIGN KEY(menteeCode) REFERENCES Mentee(menteeCode),
CONSTRAINT Step_ApplyFK FOREIGN KEY(stepCode) REFERENCES Step(stepCode)
);

CREATE TABLE Payment (
orderId VARCHAR(64) NOT NULL,
orderName VARCHAR(64) NOT NULL,
price DECIMAL(15, 2) NOT NULL,
time DATETIME NOT NULL,
paymentCode CHAR(18) NOT NULL,
applyCode CHAR(18) NOT NULL,
CONSTRAINT PaymentPK PRIMARY KEY(paymentCode),
CONSTRAINT Apply_PaymentFK FOREIGN KEY(applyCode) REFERENCES Apply(applyCode)
);

CREATE TABLE Problem (
chapterNumber INT NOT NULL,
number INT NOT NULL,
title VARCHAR(250) NOT NULL,
content TEXT NOT NULL,
evaluate INT NOT NULL DEFAULT 0,
problemCode CHAR(7) NOT NULL,
stepCode CHAR(6) NOT NULL,
CONSTRAINT ProblemPK PRIMARY KEY(problemCode),
CONSTRAINT Step_ProblemFK FOREIGN KEY(stepCode) REFERENCES Step(stepCode)
);

CREATE TABLE Solution (
chapterNumber INT NOT NULL,
problemNumber INT NOT NULL,
number INT NOT NULL,
time DATETIME NOT NULL,
state VARCHAR(16) NOT NULL DEFAULT 'WAIT' CHECK(state IN ('PASS', 'FAIL', 'WAIT', 'FINISH')),
content TEXT NOT NULL,
image MEDIUMBLOB NOT NULL,
solutionCode CHAR(18) NOT NULL,
applyCode CHAR(18) NOT NULL,
CONSTRAINT SolutionPK PRIMARY KEY(solutionCode),
CONSTRAINT Apply_SolutionFK FOREIGN KEY(applyCode) REFERENCES Apply(applyCode)
);

CREATE TABLE Mento (
name VARCHAR(10) NOT NULL,
emailAddress VARCHAR(250) NOT NULL,
password VARCHAR(128) NOT NULL,
mentoCode CHAR(9) NOT NULL,
CONSTRAINT MentoUQ UNIQUE(emailAddress),
CONSTRAINT MentoPK PRIMARY KEY(mentoCode)
);

CREATE TABLE Feedback (
time DATETIME NOT NULL,
state VARCHAR(16) NOT NULL DEFAULT 'UNCHECKED' CHECK(state IN ('UNCHECKED', 'CHECKED')),
evaluate INT NOT NULL DEFAULT 0,
content TEXT NOT NULL,
feedbackCode CHAR(18) NOT NULL,
mentoCode CHAR(9) NOT NULL,
solutionCode CHAR(18) NOT NULL,
CONSTRAINT FeedbackPK PRIMARY KEY(feedbackCode),
CONSTRAINT Mento_FeedbackFK FOREIGN KEY(mentoCode) REFERENCES Mento(mentoCode),
CONSTRAINT Solution_FeedbackFK FOREIGN KEY(solutionCode) REFERENCES Solution(solutionCode)
);

CREATE TABLE Question (
chapterNumber INT NOT NULL,
problemNumber INT NOT NULL,
solutionNumber INT NOT NULL,
number INT NOT NULL,
time DATETIME NOT NULL,
state VARCHAR(16) NOT NULL DEFAULT 'UNCHECKED' CHECK(state IN ('UNCHECKED', 'CHECKED')),
content TEXT NOT NULL,
questionCode CHAR(18) NOT NULL,
applyCode CHAR(18) NOT NULL,
CONSTRAINT QuestionPK PRIMARY KEY(questionCode),
CONSTRAINT Apply_QuestionFK FOREIGN KEY(applyCode) REFERENCES Apply(applyCode)
);

CREATE TABLE Answer (
time DATETIME NOT NULL,
state VARCHAR(16) NOT NULL DEFAULT 'UNCHECKED' CHECK(state IN ('UNCHECKED', 'CHECKED')),
content TEXT NOT NULL,
answerCode CHAR(18) NOT NULL,
mentoCode CHAR(9) NOT NULL,
questionCode CHAR(18) NOT NULL,
CONSTRAINT AnswerPK PRIMARY KEY(answerCode),
CONSTRAINT Mento_AnswerFK FOREIGN KEY(mentoCode) REFERENCES Mento(mentoCode),
CONSTRAINT Question_AnswerFK FOREIGN KEY(questionCode) REFERENCES Question(questionCode)
);

CREATE TABLE Bookmark(
location INT,
applyCode CHAR(18) NOT NULL,
CONSTRAINT Apply_BookmarkFK FOREIGN KEY(applyCode) REFERENCES Apply(applyCode)
);

CREATE TABLE Evaluate(
abstract INT NOT NULL DEFAULT -1,
logical INT NOT NULL DEFAULT -1,
solve INT NOT NULL DEFAULT -1,
critical INT NOT NULL DEFAULT -1,
language INT NOT NULL DEFAULT -1,
debugging INT NOT NULL DEFAULT -1,
evaluateCode CHAR(18) NOT NULL,
solutionCode CHAR(18) NOT NULL,
CONSTRAINT EvaluatePK PRIMARY KEY(evaluateCode),
CONSTRAINT Solution_EvaluateFK FOREIGN KEY(solutionCode) REFERENCES Solution(solutionCode)
);


DELIMITER //

CREATE FUNCTION GetCourseCode() RETURNS CHAR(4)
BEGIN
DECLARE newCode CHAR(4);
DECLARE oldCode CHAR(4);
DECLARE id CHAR(2);
DECLARE number CHAR(2);
DECLARE value INT;
SET oldCode = (SELECT courseCode FROM Course ORDER BY courseCode DESC LIMIT 1);
SET newCode = "CR00";
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 2);
SET number = SUBSTRING(newCode, 3, 2);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(2));
SET number = LPAD(number, 2, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetStepCode() RETURNS CHAR(6)
BEGIN
DECLARE newCode CHAR(6);
DECLARE oldCode CHAR(6);
DECLARE id CHAR(2);
DECLARE number CHAR(4);
DECLARE value INT;
SET oldCode = (SELECT stepCode FROM Step ORDER BY stepCode DESC LIMIT 1);
SET newCode = "ST0000";
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 2);
SET number = SUBSTRING(newCode, 3, 4);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(4));
SET number = LPAD(number, 4, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetMenteeCode() RETURNS CHAR(9)
BEGIN
DECLARE newCode CHAR(9);
DECLARE oldCode CHAR(9);
DECLARE id CHAR(2);
DECLARE number CHAR(7);
DECLARE value INT;
SET oldCode = (SELECT menteeCode FROM Mentee ORDER BY menteeCode DESC LIMIT 1);
SET newCode = "ME0000000";
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 2);
SET number = SUBSTRING(newCode, 3, 7);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(7));
SET number = LPAD(number, 7, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetAuthenticationCode()
RETURNS CHAR(6)
BEGIN
DECLARE authenticationCode CHAR(6);
DECLARE allowedCharacters CHAR(10);
DECLARE i INT;
SET authenticationCode = "";
SET allowedCharacters = '0123456789';
SET i = 0;
WHILE (i < 6) DO
SET authenticationCode = CONCAT(authenticationCode, substring(allowedCharacters, FLOOR(RAND() * LENGTH(allowedCharacters) + 1), 1));
SET i = i + 1;
END WHILE;
RETURN authenticationCode;
END//

CREATE FUNCTION GetApplyCode() RETURNS CHAR(18)
BEGIN
DECLARE newCode CHAR(18);
DECLARE oldCode CHAR(18);
DECLARE dateTimeValue BIGINT;
DECLARE dateTime CHAR(12);
DECLARE dateNumber CHAR(16);
DECLARE id CHAR(14);
DECLARE number CHAR(4);
DECLARE value INT;
SET dateTimeValue = NOW() / 100;
SET dateTime = CAST(dateTimeValue AS CHAR(12));
SET oldCode = (SELECT applyCode FROM Apply WHERE SUBSTRING(applyCode, 3, 12) = dateTime ORDER BY applyCode DESC LIMIT 1);
SET dateNumber = CONCAT(dateTime, "0000");
SET newCode = CONCAT("AP", dateNumber);
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 14);
SET number = SUBSTRING(newCode, 15, 4);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(4));
SET number = LPAD(number, 4, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetPaymentCode() RETURNS CHAR(18)
BEGIN
DECLARE newCode CHAR(18);
DECLARE oldCode CHAR(18);
DECLARE dateTimeValue BIGINT;
DECLARE dateTime CHAR(12);
DECLARE dateNumber CHAR(16);
DECLARE id CHAR(14);
DECLARE number CHAR(4);
DECLARE value INT;
SET dateTimeValue = NOW() / 100;
SET dateTime = CAST(dateTimeValue AS CHAR(12));
SET oldCode = (SELECT paymentCode FROM Payment WHERE SUBSTRING(paymentCode, 3, 12) = dateTime ORDER BY paymentCode DESC LIMIT 1);
SET dateNumber = CONCAT(dateTime, "0000");
SET newCode = CONCAT("PM", dateNumber);
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 14);
SET number = SUBSTRING(newCode, 15, 4);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(4));
SET number = LPAD(number, 4, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetProblemCode() RETURNS CHAR(7)
BEGIN
DECLARE newCode CHAR(7);
DECLARE oldCode CHAR(7);
DECLARE id CHAR(2);
DECLARE number CHAR(5);
DECLARE value INT;
SET oldCode = (SELECT problemCode FROM Problem ORDER BY problemCode DESC LIMIT 1);
SET newCode = "PB00000";
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 2);
SET number = SUBSTRING(newCode, 3, 5);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(5));
SET number = LPAD(number, 5, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetSolutionCode() RETURNS CHAR(18)
BEGIN
DECLARE newCode CHAR(18);
DECLARE oldCode CHAR(18);
DECLARE dateTimeValue BIGINT;
DECLARE dateTime CHAR(12);
DECLARE dateNumber CHAR(16);
DECLARE id CHAR(14);
DECLARE number CHAR(4);
DECLARE value INT;
SET dateTimeValue = NOW() / 100;
SET dateTime = CAST(dateTimeValue AS CHAR(12));
SET oldCode = (SELECT solutionCode FROM Solution WHERE SUBSTRING(solutionCode, 3, 12) = dateTime ORDER BY solutionCode DESC LIMIT 1);
SET dateNumber = CONCAT(dateTime, "0000");
SET newCode = CONCAT("SL", dateNumber);
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 14);
SET number = SUBSTRING(newCode, 15, 4);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(4));
SET number = LPAD(number, 4, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetMentoCode() RETURNS CHAR(9)
BEGIN
DECLARE newCode CHAR(9);
DECLARE oldCode CHAR(9);
DECLARE id CHAR(2);
DECLARE number CHAR(7);
DECLARE value INT;
SET oldCode = (SELECT mentoCode FROM Mento ORDER BY mentoCode DESC LIMIT 1);
SET newCode = "MT0000000";
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 2);
SET number = SUBSTRING(newCode, 3, 7);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(7));
SET number = LPAD(number, 7, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetFeedbackCode() RETURNS CHAR(18)
BEGIN
DECLARE newCode CHAR(18);
DECLARE oldCode CHAR(18);
DECLARE dateTimeValue BIGINT;
DECLARE dateTime CHAR(12);
DECLARE dateNumber CHAR(16);
DECLARE id CHAR(14);
DECLARE number CHAR(4);
DECLARE value INT;
SET dateTimeValue = NOW() / 100;
SET dateTime = CAST(dateTimeValue AS CHAR(12));
SET oldCode = (SELECT feedbackCode FROM Feedback WHERE SUBSTRING(feedbackCode, 3, 12) = dateTime ORDER BY feedbackCode DESC LIMIT 1);
SET dateNumber = CONCAT(dateTime, "0000");
SET newCode = CONCAT("FB", dateNumber);
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 14);
SET number = SUBSTRING(newCode, 15, 4);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(4));
SET number = LPAD(number, 4, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetQuestionCode() RETURNS CHAR(18)
BEGIN
DECLARE newCode CHAR(18);
DECLARE oldCode CHAR(18);
DECLARE dateTimeValue BIGINT;
DECLARE dateTime CHAR(12);
DECLARE dateNumber CHAR(16);
DECLARE id CHAR(14);
DECLARE number CHAR(4);
DECLARE value INT;
SET dateTimeValue = NOW() / 100;
SET dateTime = CAST(dateTimeValue AS CHAR(12));
SET oldCode = (SELECT questionCode FROM Question WHERE SUBSTRING(questionCode, 3, 12) = dateTime ORDER BY questionCode DESC LIMIT 1);
SET dateNumber = CONCAT(dateTime, "0000");
SET newCode = CONCAT("QN", dateNumber);
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 14);
SET number = SUBSTRING(newCode, 15, 4);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(4));
SET number = LPAD(number, 4, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetAnswerCode() RETURNS CHAR(18)
BEGIN
DECLARE newCode CHAR(18);
DECLARE oldCode CHAR(18);
DECLARE dateTimeValue BIGINT;
DECLARE dateTime CHAR(12);
DECLARE dateNumber CHAR(16);
DECLARE id CHAR(14);
DECLARE number CHAR(4);
DECLARE value INT;
SET dateTimeValue = NOW() / 100;
SET dateTime = CAST(dateTimeValue AS CHAR(12));
SET oldCode = (SELECT answerCode FROM Answer WHERE SUBSTRING(answerCode, 3, 12) = dateTime ORDER BY answerCode DESC LIMIT 1);
SET dateNumber = CONCAT(dateTime, "0000");
SET newCode = CONCAT("AN", dateNumber);
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 14);
SET number = SUBSTRING(newCode, 15, 4);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(4));
SET number = LPAD(number, 4, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetEvaluateCode() RETURNS CHAR(18)
BEGIN
DECLARE newCode CHAR(18);
DECLARE oldCode CHAR(18);
DECLARE dateTimeValue BIGINT;
DECLARE dateTime CHAR(12);
DECLARE dateNumber CHAR(16);
DECLARE id CHAR(14);
DECLARE number CHAR(4);
DECLARE value INT;
SET dateTimeValue = NOW() / 100;
SET dateTime = CAST(dateTimeValue AS CHAR(12));
SET oldCode = (SELECT evaluateCode FROM Evaluate WHERE SUBSTRING(evaluateCode, 3, 12) = dateTime ORDER BY evaluateCode DESC LIMIT 1);
SET dateNumber = CONCAT(dateTime, "0000");
SET newCode = CONCAT("EV", dateNumber);
IF (oldCode IS NOT NULL) THEN
SET newCode = oldCode;
END IF;
SET id = SUBSTRING(newCode, 1, 14);
SET number = SUBSTRING(newCode, 15, 4);
SET value = CAST(number AS UNSIGNED);
SET value = value + 1;
SET number = CAST(value AS CHAR(4));
SET number = LPAD(number, 4, '0');
SET newCode = CONCAT(id, number);
RETURN newCode;
END//

CREATE FUNCTION GetOrderId() RETURNS CHAR(64)
BEGIN
DECLARE orderId CHAR(64);
DECLARE allowedCharacters CHAR(64);
DECLARE i INT;
SET orderId = "";
SET allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
SET i = 0;
WHILE (i < 64) DO
SET orderId = CONCAT(orderId, substring(allowedCharacters, FLOOR(RAND() * LENGTH(allowedCharacters) + 1), 1));
SET i = i + 1;
END WHILE;
RETURN orderId;
END//

CREATE FUNCTION GetRandomString16() RETURNS CHAR(16)
BEGIN
DECLARE result CHAR(16);
DECLARE allowedCharacters CHAR(64);
DECLARE i INT;
SET result = "";
SET allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
SET i = 0;
WHILE (i < 16) DO
SET result = CONCAT(result, substring(allowedCharacters, FLOOR(RAND() * LENGTH(allowedCharacters) + 1), 1));
SET i = i + 1;
END WHILE;
RETURN result;
END//

DELIMITER ;





INSERT INTO Course(name,  courseCode) VALUES("다락방 1층", GetCourseCode());
INSERT INTO Course(name,  courseCode) VALUES("다락방 2층", GetCourseCode());
INSERT INTO Course(name,  courseCode) VALUES("다락방 3층", GetCourseCode());
INSERT INTO Course(name,  courseCode) VALUES("다락방 4층", GetCourseCode());
INSERT INTO Course(name,  courseCode) VALUES("다락방 5층", GetCourseCode());

INSERT INTO Step(number, subject, price, period, stepCode, courseCode) VALUES(1, "문제 해결 관점에서의 프로그래밍", 100000, 5, GetStepCode(), "CR01");
INSERT INTO Step(number, subject, price, period, stepCode, courseCode) VALUES(2, "반복구조", 100000, 5, GetStepCode(), "CR01");
INSERT INTO Step(number, subject, price, period, stepCode, courseCode) VALUES(3, "선택구조", 200000, 10, GetStepCode(), "CR01");
INSERT INTO Step(number, subject, price, period, stepCode, courseCode) VALUES(4, "알고리듬", 100000, 5, GetStepCode(), "CR01");
INSERT INTO Step(number, subject, price, period, stepCode, courseCode) VALUES(5, "이해하기 쉬운 알고리듬", 200000, 10, GetStepCode(), "CR01");
INSERT INTO Step(number, subject, price, period, stepCode, courseCode) VALUES(6, "배열과 알고리듬", 200000, 10, GetStepCode(), "CR01");
INSERT INTO Step(number, subject, price, period, stepCode, courseCode) VALUES(7, "필드, 레코드와 알고리듬", 200000, 10, GetStepCode(), "CR01");
INSERT INTO Step(number, subject, price, period, stepCode, courseCode) VALUES(8, "디스크 파일과 알고리듬", 100000, 5, GetStepCode(), "CR01");
INSERT INTO Step(number, subject, price, period, stepCode, courseCode) VALUES(9, "동적 기억장소와 알고리듬", 200000, 10, GetStepCode(), "CR01");

INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(2, 1, "성적 평가 순서도", "국어, 영어, 수학 점수를 입력받아 성적을 평가하는 순서도를 그려보세요.", 0, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(2, 2, "학점 평가 순서도", "국어, 영어, 수학 점수를 입력받아<br>평균이 60점 미만이면 F, 60점 이상 70점 미만이면 D, 70점 이상이고 80점 미만이면 C,<br>80점 이상이고 90점 미만이면 B, 그리고 90점 이상이면 A학점을 주는 순서도를 그려보세요.", 0, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(3, 1, "기억장소", "2장 문제 1의 순서도를 참고하여 답하세요.<br>(1) 상수와 변수를 구분하세요.<br>(2) 상수 변수마다 자료형을 적어보세요.<br>(3) 순서도에서 선언하는 기호를 찾아보세요.<br>(4) 할당할 때 값들을 적어보세요.<br>(5) 홍길동 100 100 100이 입력됐을 때 출력되는 값들을 적어보세요.<br>(6) 단말기호와 준비기호를 뺀 나머지 기호마다 왼쪽 값과 오른쪽 값을 구분해보세요.<br>(7) 치환(대입)을 찾고 값들을 적어보세요.<br>(8) 누적을 찾고 값들을 적어보세요.", 0, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(4, 1, "식과 문장", "2장 문제 2의 순서도를 참고하여 답하세요.<br>(1) 산술식들을 찾아보세요.<br>(2) 관계식들을 찾아보세요.<br>(3) 논리식들을 찾아보세요.<br>(4) 치환식들을 찾아보세요.<br>(5) 단일식들을 찾아보세요.<br>(6) 복합식들을 찾아보세요.", 0, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(5, 1, "평균 순서도", "성명, 국어, 영어, 수학 점수가 입력될 때 평균을 출력하는 순서도를 작도하십시오.", 0, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(5, 2, "큰 수 순서도", "두 수를 입력받아서 큰 수를 출력하는 순서도를 작도하십시오.", 0, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(5, 3, "수 출력 순서도", "1에서 10까지 수를 출력하는 순서도를 작도하십시오.", 0, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(7, 1, "합 분석", "1에서 100까지 합을 구하는 문제에 대해 분석하십시오.", 7, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(7, 2, "7의 배수 개수 분석", "1부터 100,000까지, 100,000 포함하여 7의 배수가 몇 개 있는지를 구하는 문제에 대해 분석하십시오.<br>반드시 1, 2, 3, ... 100000까지 수를 세면서, 7의 배수인지 확인하고, 7의 배수의 개수를 세는 방식으로 해결하십시오.", 7, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(7, 3, "홀짝 개수 분석", "수들을 입력받아서 짝수의 개수와 홀수의 개수를 구하는 문제에 대해 분석하십시오.", 7, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(8, 1, "합 설계", "1에서 100까지 합을 구하는 문제에 대해 설계를 하십시오.", 7, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(8, 2, "7의 배수 개수 설계", "1부터 100,000까지, 100,000 포함하여 7의 배수가 몇 개 있는지를 구하는 문제에 대해 설계를 하십시오.", 7, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(8, 3, "홀짝 개수 설계", "수들을 입력받아서 짝수의 개수와 홀수의 개수를 구하는 문제에 대해 설계를 하십시오.", 7, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(9, 1, "합 검토", "1에서 100까지 합을 구하는 순서도에 대해 검토를 하십시오.", 8, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(9, 2, "7의 배수 개수 검토", "1부터 100,000까지, 100,000 포함하여 7의 배수가 몇 개 있는지를 구하는 순서도에 대해 검토를 하십시오.", 8, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(9, 3, "홀짝 개수 검토", "수들을 입력받아서 짝수의 개수와 홀수의 개수를 구하는 순서도에 대해 검토를 하십시오.", 8, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(11, 1, "합 C구현", "1에서 100까지 합을 구하는 순서도를 C로 구현을 하십시오.", 16, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(11, 2, "7의 배수 개수 C구현", "1부터 100,000까지, 100,000 포함하여 7의 배수가 몇 개 있는지를 구하는 순서도에 대해 C로 구현을 하십시오.", 16, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(11, 3, "홀짝 개수 C구현", "수들을 입력받아서 짝수의 개수와 홀수의 개수를 구하는 순서도에 대해 C로 구현을 하십시오.", 16, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(12, 1, "합 디버깅", "1에서 100까지 합을 구하는 프로그램에 대해 디버깅하십시오.", 32, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(12, 2, "7의 배수 개수 디버깅", "1부터 100,000까지, 100,000 포함하여 7의 배수가 몇 개 있는지를 구하는 프로그램에 대해 디버깅하십시오.", 32, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(12, 3, "홀짝 개수 디버깅", "수들을 입력받아서 짝수의 개수와 홀수의 개수를 구하는 프로그램에 대해 디버깅하십시오.", 32, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(13, 1, "합 Java구현", "1에서 100까지 합을 구하는 순서도를 자바로 구현을 하십시오.", 16, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(13, 2, "7의 배수 개수 Java구현", "1부터 100,000까지, 100,000 포함하여 7의 배수가 몇 개 있는지를 구하는 순서도를 자바로 구현을 하십시오.", 16, GetProblemCode(), "ST0001");
INSERT INTO Problem(chapterNumber, number, title, content, evaluate, problemCode, stepCode) 
VALUES(13, 3, "홀짝 개수 Java구현", "수들을 입력받아서 짝수의 개수와 홀수의 개수를 구하는 순서도를 자바로 구현을 하십시오.", 16, GetProblemCode(), "ST0001");

INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 1, "성적 평가 NS차트", "국어, 영어, 수학 점수를 입력받아 성적을 평가하는 나씨-슈나이더만 다이어그램을 그려보세요.", GetProblemCode(), "ST0002");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 2, "학점 평가 NS차트", "국어, 영어, 수학 점수를 입력받아<br>평균이 60점 미만이면 F, 60점 이상 70점 미만이면 D, 70점 이상이고 80점 미만이면 C,<br>80점 이상이고 90점 미만이면 B, 그리고 90점 이상이면 A학점을 주는 나씨-슈나이더만 다이어그램을 그려보세요.", GetProblemCode(), "ST0002");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(9, 1, "홀수의 합", "1 + 3 + 5 + 7 + ... + 99 까지 홀수의 합을 구하십시오.", GetProblemCode(), "ST0002");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(9, 2, "홀수의 합과 짝수의 합", "1에서 100까지 수 중 홀수의 합과 짝수의 합을 구하십시오.", GetProblemCode(), "ST0002");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(9, 3, "이중 반복구조의 합", "1 + ( 1 + 2 ) + ( 1 + 2 + 3 ) + ... + (1 + 2 + 3 + 4 + ... + 100 ) 까지 합을 구하십시오.", GetProblemCode(), "ST0002");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(9, 4, "더하고 빼기", "1 - 2 + 3 - 4 + 5 ... + 99 - 100 에서 합을 구하십시오.", GetProblemCode(), "ST0002");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(9, 5, "3의 배수와 5의 배수 제외 합", "1에서 100까지 수 중에서 3의 배수와 5의 배수를 제외한 합을 구하십시오.", GetProblemCode(), "ST0002");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(9, 6, "분수 합", "1 - 1 / 2 + 1 / 3 - ... + 1 / 99 - 1 / 100 의 합을 구하십시오.", GetProblemCode(), "ST0002");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(9, 7, "분수 팩토리얼 합", "1 - 2 / 3! + 3 / 5! - ... - 10 / 19! 의 합을 구하십시오.", GetProblemCode(), "ST0002");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(9, 8, "피보나치 수", "다음과 같은 수열을 피보나치(Fibonacci) 수열이라고 합니다.<br>1, 1, 2, 3, 5, 8, 13, 21 ... 즉 앞의 두 항을 합하면 다음 항이 됩니다.<br>50번째 피보나치 수를 구하십시오.", GetProblemCode(), "ST0002");

INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 1, "인구예측", "1996년 H시의 인구는 250만 명, 연 증가율은 3.6%이고, K시의 인구는 180만 명이며 연 증가율은 4.2%일 때,<br>K시의 인구가 H시의 인구보다 많아지게 되는 연도는 언제일까요?", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 2, "저금", "1000만 원을 연이율 7%로 저금하였을 때 몇 년만에 2배가 되는지를 계산하여 봅시다.<br>단, 이자는 연말에 계산되며 복리식으로 계산합니다. 즉, 이자가 매년 원금에 합쳐집니다.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 3, "동물농장", "송아지와 닭이 섞여 있는데 머리는 모두 46개이고 다리는 140개입니다. 송아지와 닭은 각각 몇 마리입니까?", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 4, "동전세기", "10원, 100원, 500원짜리 동전이 각각 10개씩 있습니다. 3가지 동전을 모두 사용하여 3800원이 되려면 각각 몇 개씩 필요합니까?", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 1, "평균 계산하기", "1000개의 숫자를 읽어 평균을 계산하시오.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 2, "수의 개수 세기", "100개의 숫자가 입력될 때 양수의 개수와 음수의 개수를 구하고 양수 중에서 홀수와 짝수의 개수를 구하시오.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 3, "학생 점수 평균 구하기", "60명 학생의 성명과 3과목 점수가 입력될 때, 개인의 평균과 반 평균을 구하시오.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 4, "중간점, 최고점, 최하점", "50명의 학생의 점수가 입력될 때, 40점 이상 60점 이하인 학생 수를 세고, 최고점과 최하점을 구하시오.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 5, "소수 판별", "10개의 수가 입력되면, 소수인지 합성수인지 판단하시오.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 1, "급여 계산", "계속해서 사원번호, 일한 시간, 시간당 임금을 읽어서 사원의 급여를 계산하시오.<br>일한 시간이 40시간을 초과한 경우, 40시간 초과분에 대해서는 임금을 1.5배로 계산합니다.<br>총지급액이 40만 원을 초과한 경우에 세금으로 3만 원을 뺍니다.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 2, "원리합계 구하기", "계속해서 원금, 연이율, 연수가 입력될 때 복리로 계산하여 해마다 원리합계를 구하시오.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 3, "자전거 경주", "두 명의 자전거 선수가 있습니다. 한 명의 자전거 선수 A가 어떤 속도(미터 단위)로 출발한 후 어느 거리만큼 달렸을 때<br>다른 한 명의 자전거 선수 B가 출발한다면 몇 초 후에 B가 A를 추월할 수 있겠습니까?<br>계속해서 A의 속도, B의 속도, 그리고 A가 간 거리가 입력됩니다.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 4, "내림차순 정렬", "계속해서 세 수를 읽어 입력된 수들의 크기의 내림차순으로 출력하시오.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 5, "성적표 만들기", "계속해서 성명과 국어, 영어, 수학 3과목 점수가 입력됩니다.<br>개인평균을 구하고, 90점 이상이면 \"EXCELLENT\", 60점 미만이면 \"FAIL\"을 입력자료 및 개인평균과 함께 출력하고,<br>마지막으로 각 과목별 평균을 구해서 출력하도록 하십시오.", GetProblemCode(), "ST0003");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 6, "종이접기", "계속해서 종이의 두께가 입력될 때, 두께가 얼마나 되던지 종이를 접을 수 있다고 가정하고<br>몇 번을 접어야 1 YARD 이상이 되겠습니까? 입력되는 종이의 두께의 단위는 inch이고 1 YARD는 32 inch입니다.", GetProblemCode(), "ST0003");

INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 1, "약수 찾기", "약수 찾기 모델을 만들어보시오.<br>소수는 1과 자기 자신만으로 나누어 떨어지는 개념을 그대로 적용하여 1과 자기 자신이 아닌 약수를 찾아보고,<br>다른 약수가 없으면 소수이고, 있으면 합성수로 판단하시오.", GetProblemCode(), "ST0004");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 2, "완전수 판별", "완전수인지를 확인하시오.<br>완전수(Perfect Number)는 자기 자신을 제외한 약수 합계가 자신과 같은 수를 말한다.<br>약수는 어떤 수를 나누어 떨어뜨리는 수를 말한다.<br>[입력]<br>양의 정수를 입력받는다.<br>[출력]<br>예 혹은 아니오 로 출력한다.<br>[예시]<br>6 <┘<br>예<br>8 <┘<br>아니오<br>28 <┘<br>예", GetProblemCode(), "ST0004");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 3, "달팽이 우물 탈출", "달팽이가 우물밖으로 나오는데 며칠 걸리는지 구하시오.<br>달팽이가 우물 밖으로 나오는 데, 하루에 낮일때 3미터 기어오르고 밤이면 다시 2미터 떨어진다. 우물 밖으로 나오는데 며칠 걸리는지 구하시오.<br>[입력]<br>우물의 깊이를 입력 받는다. 입력받는 수치의 단위는 3이상의 양의 정수이다.<br>[출력]<br>우물 밖으로 나오는데 걸린 일수를 출력한다.<br>[예시]<br>3 <┘<br>1<br>10 <┘<br>8", GetProblemCode(), "ST0004");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 4, "자리수의 합", "자리수의 합을 구하시오. 수가 입력되면, 수의 각 자리수의 합을 구한다.<br>[입력]<br>임의의 자리수의 양의 정수가 입력된다.<br>[출력]<br>자리수의 합을 출력한다.<br>[예시]<br>45671 <┘<br>23<br>123 <┘<br>6<br>10002 <┘<br>3", GetProblemCode(), "ST0004");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 5, "7의 개수 세기", "7의 개수를 구하시오. 10000까지 수들에서 7이 몇 개인지 세시오.<br>[입력]<br>없다.<br>[출력]<br>7의 개수를 출력한다.<br>[예시]<br>4000", GetProblemCode(), "ST0004");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 6, "수 뒤집기", "수를 뒤집어 보시오. 수가 입력되면, 자리수를 뒤집어 보세요.<br>[입력]<br>양의 정수를 입력받는다.<br>[출력]<br>뒤집힌 양의 정수를 출력한다.<br>[예시]<br>100 <┘<br>1<br>3412 <┘<br>2143<br>199020 <┘<br>20991", GetProblemCode(), "ST0004");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 7, "회문수 찾기", "회문수(대칭수)를 찾으시오.<br>일단 어떤 수를 받아서 그 수를 뒤집은 다음 뒤집어진 수를 원래의 수에 더하는 과정을 뒤집어서 더하기(Reverse And Add)라고 부르자.<br>그 합이 회문(Palindrome, 앞에서부터 읽으나 뒤에서부터 읽으나 같은 말이 되는 어구)이 아니면 회문이 될 때까지<br>이 과정을 반복하여 회문수(Palindrome Number)를 만드는 알고리듬을 작성하시오.<br>단, 입력값은 두 자리 수 이상의 양의 정수이며, 만들어진 회문수는 4,294,967,295보다 작은 수로 이루어지는 것을 조건으로 한다.<br>[입력]<br>10 이상 두 자리 수 이상의 자연수가 주어진다. <┘<br>[출력]<br>회문수에 해당하는 자연수를 출력한다.<br>[예시]<br>10 <┘<br>11<br><br>133 <┘<br>464", GetProblemCode(), "ST0004");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 8, "가장 큰 수 만들기", "가장 큰 수를 만드시오. 두 자리 수 이상의 수가 입력될 때 가장 큰 수를 만들어 보자.<br>[입력]<br>두 자리 수 이상의 자연수를 입력받는다.<br>[출력]<br>숫자들의 조합으로 만들 수 있는 가장 큰 수를 출력한다.<br>[예시]<br>132 <┘<br>321<br>24517 <┘<br>75421", GetProblemCode(), "ST0004");

INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 1, "몫과 나머지", "두 수를 입력받아 몫과 나머지를 구하라.<br>[입력]<br>두 개의 양의 정수를 입력받는다.<br>[출력]<br>몫과 나머지를 출력한다.<br>[예시]<br>10 5 <┘<br>2 0<br>1 3 <┘<br>0 1<br>9 4 <┘<br>2 1", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 2, "온도 변환", "화씨, 섭시 구분과 온도가 입력될 때 화씨를 섭씨로, 섭씨는 화씨로 변환하라.<br>[입력]<br>화씨온도면 F, 섭씨온도면 C 그리고 온도를 입력받는다.<br>[출력]<br>화씨온도가 입력된 경우 섭씨온도를 출력하고, 섭씨온도가 입력되면 화씨온도를 출력한다.<br>[예시]<br>C 100 <┘<br>212 F<br>F 70 <┘<br>21.11 C<br>F 32 <┘<br>0 C", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 3, "강아지와 병아리", "강아지와 병아리의 합과 다리의 수를 입력받아 강아지와 병아리가 각각 몇 마리씩인지 구하라.<br>[입력]<br>강아지와 병아리의 합 1000 이하, 다리의 합 4000 이하의 정수를 공백으로 구분하여 입력받는다.<br>[출력]<br>강아지와 병아리가 각각 몇 마리씩인지 공백으로 구분하여 출력한다.<br>주어진 데이터로 마릿수를 정할 수 없을 때는 0을 출력한다.<br>[예시]<br>25 80 <┘<br>15 10<br>3 14 <┘<br>0 0", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 4, "거스름돈", "상점에서 물건을 사고 지폐로 돈을 내면 거스름돈을 줘야 한다. 이때 동전을 어떻게 해서 줘야 하는지 계산하라.<br>돈은 반드시 1000원을 내며, 거스름돈은 10원, 50원, 100원, 500원 동전으로 하고 큰 동전 우선으로 준다.<br>[입력]<br>물건값으로 세 자리 자연수가 입력으로 주어진다. 일의 자리는 0이다.<br>[출력]<br>동전 500원, 100원, 50원, 10원의 개수를 출력한다.<br>[예시]<br>530 <┘<br>500원 : 0개   100원 : 4개   50원 : 1개   10원 : 2개", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 5, "타일 개수", "바닥에 타일을 까는 데 필요한 타일 수를 구하라.<br>타일의 크기는 8×8이다. 타일은 그대로 이용할 수도 있고 잘라서 부분을 이용할 수도 있다. 그런데 잘라서 사용한 타일의 나머지는 반드시 버려야 한다.<br>사용된 온전한 타일 수와 잘라서 사용한 타일 수를 구하라. 모든 단위는 inch이고 단위는 생략한다.<br>[입력]<br>방의 가로, 세로 크기가 주어진다. 각 수는 1000 이하이다.<br>[출력]<br>출력 예의 형식으로 출력한다.<br>[예시]<br>160 250 <┘<br>The number of whole tiles is 600 part tiles is 0<br>100 120 <┘<br>The number of whole tiles is 180 part tiles is 15", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 6, "설탕 배달하기", "철수는 설탕 공장의 배달사원이다. 설탕은 3kg 상자와 5kg 상자 두 종류가 있는데 이 두 종류를 이용하여 정확히 N kg을 배달해야 한다. 그런데 철수는 N kg의 설탕을 배달할 때 상자의 수를 가능한 적게 하고 싶어 한다. 예를 들어 18kg의 설탕을 배달하는 경우 3kg 상자로 여섯 개를 배달할 수도 있지만 5kg 셋 상자와 3kg 한 상자를 사용하는 경우 네 상자만 배달하면 된다. 3kg 상자와 5kg 상자를 이용하여 정확히 N kg을 만드는 데 필요한 최소 상자 수를 구하고 5kg 상자와 3kg 상자가 각각 몇 상자인지 출력하자.<br>[입력]<br>주문받은 설탕의 무게 N(3≤N≤50,000)이 입력된다.<br>[출력]<br>3kg 상자와 5kg 상자를 이용하여 정확히 N kg을 만드는 데 필요한 최소 상자 수와 3kg 상자와 5kg 상자가 각각 몇 상자인지를 출력한다. 정확히 N kg을 만들 수 없는 경우 -1을 출력한다.<br>[예시]<br>4 <┘<br>-1]n9 <┘<br>3<br>3   0<br>18 <┘<br>4<br>1   3", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 1, "수의 개수 세기2", "100개의 정수가 입력될 때, 그 정수를 읽어 양의 정수 개수, 음의 정수 개수를 구하고, 양의 정수 중 짝수 개수, 홀수 개수도 구하여 출력하자.<br>[입력]<br>100개의 정수가 입력된다.<br>[출력]<br>양의 정수 개수, 음의 정수 개수, 짝수의 개수, 홀수의 개수가 출력된다.<br>[예시] : 6개의 정수일 경우<br>1, -5, 0, 2, 6, 9 <┘<br>양의 정수 개수 : 4<br>음의 정수 개수 : 1<br>짝수의 개수 : 2<br>홀수의 개수 : 2", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 2, "야구 게임", "이것은 네 개의 수를 맞추는 게임이다. 적당한 수들을 입력시키면 자릿수와 숫자가 맞으면 「Hit」로 간주하며 그 개수가 출력되고, 숫자가 맞더라도 자릿수가 다르다면 「Blow」라는 표시와 그 개수를 출력하자. 수들은 직접 입력할 수 있게 하여 처리하도록 하자.<br>[입력]<br>입력 숫자는 0~9까지의 수이다. 단, 각 자리 수의 숫자는 겹치지 않도록 한다.<br>[출력]<br>Hit와 Blow의 카운트가 출력된다.<br>[예시]<br>1 2 3 4 <┘<br>1 2 4 5 <┘<br>2hit 1blow", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 3, "수 찾기", "10개의 정수가 입력되어 있을 때, 찾고자 하는 값을 입력받아 그 정수의 위치를 출력하고 값이 없을 때에는 적당한 메시지를 출력하자.<br>[입력]<br>10개의 정수를 입력받고, 찾고자 하는 값(key)을 입력받는다.<br>[출력]<br>찾고자 하는 값이 저장된 방의 번호(들)를 출력하고, 찾고자 하는 값이 존재하지 않을 겅우는 적당한 메시지를 출력한다.<br>[예시]<br>1, 5, 0, 2, 6, 9, 10, 1, 7, 1 <┘<br>1 <┘<br>1, 8, 10<br><br>1, 5, 0, 2, 6, 9, 10, 1, 7, 1 <┘<br>8 <┘<br>찾고자 하는 값이 없습니다.", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 4, "수들 뒤집기", "수들을 입력으로 받아 입력받은 수들을 거꾸로 출력하자.<br>[입력]<br>입력의 첫 수는 수의 개수 n이다. ( 1 ≤ n ≤ 1000 )<br>다음 줄에는 수들이 입력으로 주어진다. 각 수의 범위는 -10000 < n < 10000이다.<br>[출력]<br>한 줄에 입력받은 수를 거꾸로 출력한다.<br>[예시]<br>4 <┘<br>-9 1 2 3 <┘<br>3 2 1 -9", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 5, "주사위 굴리기", "주사위 두 개를 가지고 있다. 이 주사위 두 개를 던질 때 나오는 눈의 합의 조합이 어떤 종류가 있는지 알아보자.<br>합이 9가 되는 경우는 3 6, 4 5, 5 4, 6 3이다.<br>[입력]<br>12 이하 자연수가 주어진다.<br>[출력]<br>두 개의 수가 출력된다. 각각 첫 번째, 두 번째 주사위의 눈이다. 출력은 첫 수가 작은 수부터 먼저 출력한다.<br>[예시]<br>9 <┘<br>3 6\t4 5\t5 4\t6 3", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 6, "중복된 수 제외하기", "열 개의 숫자를 입력받아 중복된 숫자를 제외한 수(들)를 출력하자.<br>[입력]<br>열 개의 수가 입력으로 주어진다. 각 수는 -10 이상 10 이하의 정수이다.<br>[출력]<br>단 한 번만 쓰인 숫자를 입력받은 순서대로 출력한다.<br>[예시]<br>1 2 3 3 5 2 7 1 8 9 <┘<br>5 7 8 9<br>1 1 5 1 2 1 1 1 3 2 <┘<br>5 3", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 7, "홀수합과 최소 홀수", "7개의 자연수가 주어질 때, 이들 중 홀수인 자연수들을 모두 골라 그 합을 구하고, 고른 홀수 중 최솟값을 찾도록 하자.<br>예를 들어, 7개의 자연수 12, 77, 38, 41, 53, 92, 85가 주어지면 이들 중 홀수는 77, 41, 53, 85이므로 그 합은 77 + 41 + 53 + 85 = 256이 되고, 41 < 53 < 77 < 85이므로 홀수 중 최솟값은 41이 된다.<br>[입력]<br>한 줄에 7개의 자연수가 입력된다. 주어지는 자연수는 100 이하이다.<br>[출력]<br>홀수가 존재하지 않는 경우에는 한 줄에 -1을 출력한다. 홀수가 존재하는 경우 한 줄에 홀수들의 합과 홀수 중 최솟값을 출력한다.<br>[예시]<br>12 77 38 41 53 92 85 <┘<br>256\t41", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 8, "369 게임", "자연수 N을 입력받아 1부터 N 사이의 숫자를 출력하십시오. 단, 1부터 N 사이의 숫자 중에서 3의 배수와 3이 들어가는 숫자에 대해서는 해당 숫자 대신에 \"Clap\"이라는 문자가 출력되도록 하자.<br>[입력]<br>입력받을 숫자의 개수와 해당하는 개수의 숫자(들)를 입력받는다.<br>입력받을 숫자의 범위는 1 이상 1000 이하의 자연수이다.<br>[출력]<br>위의 조건에 해당하지 않는 숫자는 숫자 자체를, 해당하는 숫자는 \"Clap\"을 출력한다.<br>숫자 사이에는 공간이 한 칸씩 들어간다.<br>[예시]<br>13 <┘<br>1 2 Clap 4 5 Clap 7 8 Clap 10 11 Clap Clap", GetProblemCode(), "ST0005");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(3, 9, "마리오 게임", "마리오 앞에 10개의 버섯이 줄지어 있다. 각각의 버섯엔 집었을 때 얻을 수 있는 점수가 있다. 마리오는 버섯을 맨 앞의 버섯부터 순서대로 집어야 하며, 그의 목표는 가능한 100점에 가까운 점수를 얻는 것이다. 어떤 경우에는 두 가지의 답이 나올 수 있는데(예를 들면 98, 102), 이 경우 마리오는 더 높은 점수를 택할 것이다(예의 경우 102).<br>당신은 마리오를 도와 그가 얻어야 할 점수를 알려주어라.<br>[입력]<br>버섯에 할당된 점수를 뜻하는 100 이하 양의 정수가 작은 순서대로 한 줄에 10개 입력된다.<br>[출력]<br>한 줄에 걸쳐 마리오가 얻게 되는 점수를 출력한다.<br>[예시]<br>10 20 30 40 50 60 70 80 90 100 <┘<br>100<br>1 2 3 5 8 13 21 34 55 89 <┘<br>87<br>40 40 40 40 40 40 40 40 40 40 <┘<br>120", GetProblemCode(), "ST0005");

INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 1, "난쟁이 키재기", "안개 숲에는 백설공주와 일곱 명의 난쟁이가 함께 살고 있다.<br>일곱 명의 난쟁이의 키가 입력으로 주어진다.<br>이 중에서 키가 가장 큰 난쟁이와 두 번째 큰 난쟁이의 키를 출력하자.<br>[입력]<br>일곱 명의 난쟁이의 키가 차례로 입력된다. 주어지는 난쟁이의 키는 100보다 작은 자연수이다.<br>[출력]<br>한 줄에는 가장 키가 큰 난쟁이의 키와 두 번째로 키가 큰 난쟁이의 키를 출력한다.<br>[예시]<br>79&nbsp;&nbsp;57&nbsp;&nbsp;88&nbsp;&nbsp;72&nbsp;&nbsp;95&nbsp;&nbsp;84&nbsp;&nbsp;64&nbsp;&nbsp;<┘<br>95,&nbsp;88", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 2, "학생 석차 매기기", "학생 10명의 총점이 번호순으로 정렬되어 입력될 때, 개인석차를 구하여 번호, 총점, 석차 순으로 함께 출력하자.<br>[입력]<br>열 명의 학생의 총점이 차례로 입력된다.<br>[출력]<br>번호들과 총점들, 그리고 석차들이 출력된다.<br>[예시]<br>256 265 241 298 ... 307 <┘<br><br>번호&emsp;총점&emsp;석차<br>=============<br>&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4<br>&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;265&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>&nbsp;3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;241&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5<br>&nbsp;4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;298&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...<br>10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;307&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 3, "숫자 선택 정렬", "10개의 숫자를 읽어 오름차순으로 정렬한 후 정렬하기 전의 숫자들과 정렬한 후의 숫자들을 출력하자.<br>초등학교에 입학할 때 입학식을 하기 위해 키 크기로 학생들을 줄 세우는 방식으로 정렬하도록 하자.<br>[입력]<br>10개의 숫자(자연수)들이 입력된다.<br>[출력]<br>입력받은 순서대로의 숫자들과 오름차순으로 정렬된 숫자들이 차례로 출력된다.<br>[예시]<br>1&nbsp;&nbsp;7&nbsp;&nbsp;4&nbsp;&nbsp;2&nbsp;&nbsp;5&nbsp;&nbsp;3&nbsp;&nbsp;9&nbsp;&nbsp;10&nbsp;&nbsp;8&nbsp;&nbsp;6&nbsp;&nbsp;<┘<br>1&nbsp;&nbsp;2&nbsp;&nbsp;3&nbsp;&nbsp;4&nbsp;&nbsp;5&nbsp;&nbsp;6&nbsp;&nbsp;7&nbsp;&nbsp;8&nbsp;&nbsp;9&nbsp;&nbsp;10", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 4, "숫자 배열 병합", "배열은 열 개의 배열요소로 구성된다. 이러한 두 개의 배열이 오름차순으로 정렬되어 있을 때,<br>스무개의 배열요소로 구성된 배열에 병합하여 출력하자.<br>[입력]<br>오름차순으로 정렬된 숫자 열 개를 두 번 입력 받는다.<br>[출력]<br>위의 숫자들을 병합한 결과를 차례로 출력한다.<br><br>[예시]1&nbsp;&nbsp;3&nbsp;&nbsp;5&nbsp;&nbsp;7&nbsp;&nbsp;9&nbsp;&nbsp;11&nbsp;&nbsp;13&nbsp;&nbsp;15&nbsp;&nbsp;17&nbsp;&nbsp;19&nbsp;&nbsp;<┘<br>2&nbsp;&nbsp;4&nbsp;&nbsp;6&nbsp;&nbsp;8&nbsp;&nbsp;10&nbsp;&nbsp;12&nbsp;&nbsp;14&nbsp;&nbsp;16&nbsp;&nbsp;18&nbsp;&nbsp;20&nbsp;&nbsp;<┘<br>1&nbsp;&nbsp;2&nbsp;&nbsp;3&nbsp;&nbsp;4&nbsp;&nbsp;5&nbsp;&nbsp;6&nbsp;&nbsp;7&nbsp;&nbsp;8&nbsp;&nbsp;9&nbsp;&nbsp;10&nbsp;&nbsp;11&nbsp;&nbsp;12&nbsp;&nbsp;13&nbsp;&nbsp;14&nbsp;&nbsp;15&nbsp;&nbsp;16&nbsp;&nbsp;17&nbsp;&nbsp;18&nbsp;&nbsp;19&nbsp;&nbsp;20", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 5, "데이터 찾기", "10개의 데이터가 입력된 후 찾고자 하는 데이터가 입력될 때 찾고자 하는 데이터가 있을 때 그 위치를 출력하고,<br>없을 때는 적당한 메시지를 출력하라.<br>[입력]<br>오름차순으로 정렬된 채로 열 개의 데이터가 입력된다. 입력된 데이터와 같은 데이터는 입력되지 않는다.<br>[출력]<br>찾고자 하는 데이터가 있으면 위치를 출력하고, 없으면 '찾고자 하는 데이터가 없습니다.' 라고 출력한다.<br>[예시]<br>3  4  7  8  9  10  15  16  17  18 <┘<br>10 <┘<br>6<br><br>1  2  3  4  5  6  7  9  10  11 <┘<br>8 <┘<br>찾고자 하는 데이터가 없습니다.", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 6, "학생 평균 점수 차", "열 명의 점수를 읽어 점수의 평균과 각 학생의 점수와 평균과의 차를 구하시오.<br>[입력]<br>한 줄에 한 개의 점수를 입력한다.<br>[출력]<br>한 줄에 한 명의 점수와 차를 출력한다. 마지막 줄에는 평균을 출력한다.<br>[예시] 다섯 명을 입력했을 때<br>30 <┘<br>40 <┘<br>70 <┘<br>80 <┘<br>10 <┘<br>=========================<br>점수&nbsp;&nbsp;차<br>------------------------------------------<br>30&nbsp;&nbsp;&nbsp;-16<br>40&nbsp;&nbsp;&nbsp;-6<br>70&nbsp;&nbsp;&nbsp;24<br>80&nbsp;&nbsp;&nbsp;34<br>10&nbsp;&nbsp;&nbsp;-26<br>=========================<br>평균 : 46", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 7, "체조 채점", "선수 10명의 점수가 입력된다. 올림픽 체조경기에서 7명의 채점위원이 채점하는데<br>그중에서 최고 점수와 최하 점수를 빼고, 5명이 채점한 점수의 합으로 개인 득점을 결정하고자 한다.<br>한 선수에 대해 7개의 점수를 받아서 개인 점수를 구하라. 또한 순위도 매겨야 한다.<br>[입력]<br>선수 10명에 대해 한 줄에 한 명의 점수를 입력받는다.<br>한 줄에 선수 한 명에 대해 일곱 개의 점수를 입력받는다.<br>[출력]<br>개인 득점과 순위를 출력한다.<br>[예시]<br>&nbsp;7&nbsp;&nbsp;&nbsp;4&nbsp;&nbsp;&nbsp;6&nbsp;&nbsp;&nbsp;5&nbsp;&nbsp;&nbsp;8&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;10&nbsp;&nbsp;<┛<br>&nbsp;6&nbsp;&nbsp;&nbsp;5&nbsp;&nbsp;&nbsp;5&nbsp;&nbsp;&nbsp;6&nbsp;&nbsp;&nbsp;6&nbsp;&nbsp;&nbsp;8&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;<┛<br>10&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;10&nbsp;&nbsp;&nbsp;8&nbsp;&nbsp;<┛<br>&nbsp;9&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;&nbsp;9&nbsp;&nbsp;<┛<br>=============================<br>득점&nbsp;&nbsp;&nbsp;&nbsp;순위<br>35&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>34&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4<br>46&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>45&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 8, "별찍기1", "[출력] 2차원 배열 하나씩에 다음과 같이 저장하고 출력하라.<br><br><table style='border : 1px solid black; border-collapse : collapse;'><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'> </td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'> </td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td></tr></table>", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 9, "별찍기2", "[출력] 2차원 배열 하나씩에 다음과 같이 저장하고 출력하라.<br><br><table style='border : 1px solid black; border-collapse : collapse;'><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td></tr></table>", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 10, "별찍기3", "[출력] 2차원 배열 하나씩에 다음과 같이 저장하고 출력하라.<br><br><table style='border : 1px solid black; border-collapse : collapse;'><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'></td></tr><tr><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td><td style='border : 1px solid black; font-size: 20px; text-align:center; width: 30px; height: 30px'>*</td></tr></table>", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 11, "수채우기1", "[출력] 2차원 배열 하나씩에 다음과 같이 저장하고 출력하라.<br><br><table style='border : 1px solid black; border-collapse : collapse;'><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>2</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>3</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>4</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>5</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>10</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>9</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>8</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>7</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>6</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>11</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>12</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>13</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>14</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>15</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>20</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>19</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>18</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>17</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>16</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>21</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>22</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>23</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>24</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>25</td></tr></table>", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 12, "수채우기2", "[출력] 2차원 배열 하나씩에 다음과 같이 저장하고 출력하라.<br><br><table style='border : 1px solid black; border-collapse : collapse;'><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>4</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>5</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>16</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>17</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>2</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>3</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>6</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>15</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>18</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>9</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>8</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>7</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>14</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>19</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>10</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>11</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>12</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>13</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>20</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>25</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>24</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>23</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>22</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>21</td></tr></table>", GetProblemCode(), "ST0006");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(8, 13, "수채우기3", "[출력] 2차원 배열 하나씩에 다음과 같이 저장하고 출력하라.<br><br><table style='border : 1px solid black; border-collapse : collapse;'><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>2</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>2</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>3</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>2</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>2</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td></tr><tr><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>1</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td><td style='border : 1px solid black; font-size: 15px; text-align:center; width: 30px; height: 30px'>0</td></tr></table>", GetProblemCode(), "ST0006");

INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 1, "임금 계산(필드)", "다섯 명의 사원의 성명, 작업시간, 코드가 입력될 때, 임금을 구하는 프로그램을 작성하라. 단, 필드를 이용하라.<br>코드에 따른 시간 수당은 다음과 같다.<br>코드 1 → 2000원<br>코드 2 → 2500원<br>코드 3 → 3000원<br>코드 4 → 4000원<br>[입력]<br>다섯 명 사원의 성명, 작업시간, 코드가 입력된다.<br>[출력]<br>다섯 명 사원의 성명, 작업시간, 코드, 그리고 임금이 출력된다.<br>[예시]<br><table><tr><td>홍길동</td><td>10</td><td>4</td><td><┘</td></tr><tr><td>김길동</td><td>11</td><td>1</td><td><┘</td></tr><tr><td>고길동</td><td>15</td><td>3</td><td><┘</td></tr><tr><td>최길동</td><td>19</td><td>5</td><td><┘</td></tr><tr><td>정길동</td><td>13</td><td>2</td><td><┘</td></tr></table><br><table><tr><th>성명</th><th>시간</th><th>코드</th><th>임금</th></tr><tr><td>홍길동</td><td>10</td><td>4</td><td>40000</td></tr><tr><td>김길동</td><td>11</td><td>1</td><td>22000</td></tr><tr><td>고길동</td><td>15</td><td>3</td><td>45000</td></tr><tr><td>최길동</td><td>19</td><td>5</td><td>0</td></tr><tr><td>정길동</td><td>13</td><td>2</td><td>32500</td></tr></table>", GetProblemCode(), "ST0007");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 2, "성적 집계(필드)", "다섯 명의 학생 성명과 세 과목 점수가 입력될 때, 개인평균들과 반 평균을 구하는 프로그램을 작성하라. 단, 필드를 이용하라.<br>[입력]<br>다섯 명의 학생 성명과 각 학생의 세 과목 점수들이 입력된다.<br>[출력]<br>입력받았던 데이터들과 함께 개인 총점들, 개인 평균들, 그리고 반 평균을 출력한다.<br>[예시]<br><table><tr><td>홍길동</td><td>100</td><td>100</td><td>100</td><td><┘</td></tr><tr><td>고길동</td><td>50</td><td>50</td><td>90</td><td><┘</td></tr><tr><td>최길동</td><td>70</td><td>80</td><td>60</td><td><┘</td></tr><tr><td>정길동</td><td>80</td><td>90</td><td>50</td><td><┘</td></tr><tr><td>김길동</td><td>60</td><td>60</td><td>80</td><td><┘</td></tr></table><br><table><tr><th>성명</th><th>과목1</th><th>과목2</th><th>과목3</th><th>총점</th><th>평균</th></tr><tr><td>홍길동</td><td>100</td><td>100</td><td>100</td><td>300</td><td>100.00</td></tr><tr><td>고길동</td><td>50</td><td>50</td><td>90</td><td>190</td><td>63.33</td></tr><tr><td>최길동</td><td>70</td><td>80</td><td>60</td><td>210</td><td>70.00</td></tr><tr><td>정길동</td><td>80</td><td>90</td><td>50</td><td>220</td><td>73.33</td></tr><tr><td>김길동</td><td>60</td><td>60</td><td>80</td><td>200</td><td>66.66</td></tr></table><br>반평균 : 74.66", GetProblemCode(), "ST0007");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 3, "BMI(필드)", "10명의 학생의 성명, 키, 몸무게를 입력받아 처리 조건에 따라 신체 질량지수와 비만 정도를 판단하여 출력하는 프로그램을 작성하라. 단, 필드를 이용하라.<br>신체 질량지수(Body Mass Index, BMI)는 체중(kg 기준)을 키(m 기준)의 제곱으로 나눈 수치이다. 신체 질량지수는 소수 첫째 자리에서 반올림한다.<br>비만 정도는 신체 질량지수를 사용하여 아래와 같이 판단한다.<br>① 비만(High) : BMI > 30<br>② 과체중(Over) : 25 ≤ BMI ≤ 30<br>③ 정상(Normal) : 19 ≤ BMI ≤ 24<br>④ 저체중(Low) : BMI < 19<br>[입력]<br>한 줄에 학생 한 명씩 성명, 키, 몸무게를 입력한다.<br>[출력]<br>① 번호, 성명, 키, 체중, 신체 질량지수, 비만 정도 순서로 출력한다.<br>② 마지막 줄에는 비만 정도별로 인원수를 출력한다.<br>[예시]<br>홍길동 141.8 49.9 <┘<br>김정운 137.1 34.2 <┘<br>김민수 127.7 40.6 <┘<br><table><tr><th>번호</th><th>성명</th><th>키(cm)</th><th>체중(kg)</th><th>BMI<th><th>비만 정도</th></tr><tr><td>1<td><td>홍길동</td><td>141.8</td><td>49.9</td><td>25</td><td>과체중</td></tr><tr><td>2<td><td>김정운</td><td>137.1</td><td>34.2</td><td>18</td><td>저체중</td></tr><tr><td>3<td><td>김민수</td><td>127.7</td><td>40.6</td><td>25</td><td>과체중</td></tr><tr><td>...</td></tr><tr><td>10<td><td>황정미</td><td>141.1</td><td>36.8</td><td>18</td><td>저체중</td></tr></table>비만: 3 과체중: 2 정상: 3 저체중: 2", GetProblemCode(), "ST0007");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(1, 4, "전자제품 대리점(필드)", "어떤 가전제품 대리점에서 취급하는 품목은 20가지이다. 취급품목과 단가를 20개 입력받아 저장한다. 그리고 영업사원들이 당일 판매 자료를 입력받아서 취급품목이면 수량을 모두 합하고, 취급품목이 아니면 오류 메시지를 출력한다. 마지막으로 품목별 매출액을 계산하고 매출액 순으로 출력하라. 단, 필드를 이용하라.<br>[입력]<br>취급품목은 품목명과 단가를 한 줄에 하나씩 입력한다.<br>판매 자료도 품목명과 수량을 한 줄에 하나씩 입력한다.<br>[출력]<br>① 번호, 품명, 단가, 수량, 금액 순서로 출력한다.<br>② 매출액 순으로 출력한다.<br>[예시]<br>냉장고 2120000 <┘<br>김치냉장고 598000 <┘<br>청소기 644000 <┘<br>세탁기 366900 <┘<br>...<br>세탁기 2 <┘<br>청소기 5 <┘<br>냉장고 1 <┘<br>김치냉장고 3 <┘<br><table><tr><th>번호</th><th>품명</th><th>단가</th><th>수량</th><th>금액</th></tr><tr><td>1</td><td>청소기</td><td>644,000</td><td>5</td><td>3,220,000</td></tr><tr><td>2</td><td>냉장고</td><td>2,120,000</td><td>1</td><td>2,120,000</td></tr><tr><td>3</td><td>김치냉장고</td><td>598,000</td><td>3</td><td>1,794,000</td></tr><tr><td>4</td><td>세탁기</td><td>366,900</td><td>2</td><td>733,800</td></tr><tr><td>...</td></tr></table>", GetProblemCode(), "ST0007");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 1, "임금 계산(레코드)", "다섯 명의 사원의 성명, 작업시간, 코드가 입력될 때, 임금을 구하는 프로그램을 작성하라. 단, 레코드를 이용하라.<br>코드에 따른 시간 수당은 다음과 같다.<br>코드 1 → 2000원<br>코드 2 → 2500원<br>코드 3 → 3000원<br>코드 4 → 4000원<br>[입력]<br>다섯 명 사원의 성명, 작업시간, 코드가 입력된다.<br>[출력]<br>다섯 명 사원의 성명, 작업시간, 코드, 그리고 임금이 출력된다.<br>[예시]<br><table><tr><td>홍길동</td><td>10</td><td>4</td><td><┘</td></tr><tr><td>김길동</td><td>11</td><td>1</td><td><┘</td></tr><tr><td>고길동</td><td>15</td><td>3</td><td><┘</td></tr><tr><td>최길동</td><td>19</td><td>5</td><td><┘</td></tr><tr><td>정길동</td><td>13</td><td>2</td><td><┘</td></tr></table><br><table><tr><th>성명</th><th>시간</th><th>코드/th><th>임금</th></tr><tr><td>홍길동</td><td>10</td><td>4</td><td>40000</td></tr><tr><td>김길동</td><td>11</td><td>1</td><td>22000</td></tr><tr><td>고길동</td><td>15</td><td>3</td><td>45000</td></tr><tr><td>최길동</td><td>19</td><td>5</td><td>0</td></tr><tr><td>정길동</td><td>13</td><td>2</td><td>32500</td></tr></table>", GetProblemCode(), "ST0007");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 2, "성적 집계(레코드)", "다섯 명의 학생 성명과 세 과목 점수가 입력될 때, 개인평균들과 반 평균을 구하는 프로그램을 작성하라. 단, 레코드를 이용하라.<br>[입력]<br>다섯 명의 학생 성명과 각 학생의 세 과목 점수들이 입력된다.<br>[출력]<br>입력받았던 데이터들과 함께 개인 총점들, 개인 평균들, 그리고 반 평균을 출력한다.<br>[예시]<br><table><tr><td>홍길동</td><td>100</td><td>100</td><td>100</td><td><┘</td></tr><tr><td>고길동</td><td>50</td><td>50</td><td>90</td><td><┘</td></tr><tr><td>최길동</td><td>70</td><td>80</td><td>60</td><td><┘</td></tr><tr><td>정길동</td><td>80</td><td>90</td><td>50</td><td><┘</td></tr><tr><td>김길동</td><td>60</td><td>60</td><td>80</td><td><┘</td></tr></table><br><table><tr><th>성명</th><th>과목1</th><th>과목2/th><th>과목3</th><th>총점</th><th>평균</th></tr><tr><td>홍길동</td><td>100</td><td>100</td><td>100</td><td>300</td><td>100.00</td></tr><tr><td>고길동</td><td>50</td><td>50</td><td>90</td><td>190</td><td>63.33</td></tr><tr><td>최길동</td><td>70</td><td>80</td><td>60</td><td>210</td><td>70.00</td></tr><tr><td>정길동</td><td>80</td><td>90</td><td>50</td><td>220</td><td>73.33</td></tr><tr><td>김길동</td><td>60</td><td>60</td><td>80</td><td>200</td><td>66.66</td></tr></table><br>반평균 : 74.66", GetProblemCode(), "ST0007");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 3, "BMI(레코드)", "10명의 학생의 성명, 키, 몸무게를 입력받아 처리 조건에 따라 신체 질량지수와 비만 정도를 판단하여 출력하는 프로그램을 작성하라. 단, 레코드를 이용하라.<br>신체 질량지수(Body Mass Index, BMI)는 체중(kg 기준)을 키(m 기준)의 제곱으로 나눈 수치이다. 신체 질량지수는 소수 첫째 자리에서 반올림한다.<br>비만 정도는 신체 질량지수를 사용하여 아래와 같이 판단한다.<br>① 비만(High) : BMI > 30<br>② 과체중(Over) : 25 ≤ BMI ≤ 30<br>③ 정상(Normal) : 19 ≤ BMI ≤ 24<br>④ 저체중(Low) : BMI < 19<br>[입력]<br>한 줄에 학생 한 명씩 성명, 키, 몸무게를 입력한다.<br>[출력]<br>① 번호, 성명, 키, 체중, 신체 질량지수, 비만 정도 순서로 출력한다.<br>② 마지막 줄에는 비만 정도별로 인원수를 출력한다.<br>[예시]<br>홍길동 141.8 49.9 <┘<br>김정운 137.1 34.2 <┘<br>김민수 127.7 40.6 <┘<br><table><tr><th>번호</th><th>성명</th><th>키(cm)</th><th>체중(kg)</th><th>BMI<th><th>비만 정도</th></tr><tr><td>1<td><td>홍길동</td><td>141.8</td><td>49.9</td><td>25</td><td>과체중</td></tr><tr><td>2<td><td>김정운</td><td>137.1</td><td>34.2</td><td>18</td><td>저체중</td></tr><tr><td>3<td><td>김민수</td><td>127.7</td><td>40.6</td><td>25</td><td>과체중</td></tr><tr><td>...</td></tr><tr><td>10<td><td>황정미</td><td>141.1</td><td>36.8</td><td>18</td><td>저체중</td></tr></table>비만: 3 과체중: 2 정상: 3 저체중: 2", GetProblemCode(), "ST0007");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(2, 4, "전자제품 대리점(레코드)", "어떤 가전제품 대리점에서 취급하는 품목은 20가지이다. 취급품목과 단가를 20개 입력받아 저장한다. 그리고 영업사원들이 당일 판매 자료를 입력받아서 취급품목이면 수량을 모두 합하고, 취급품목이 아니면 오류 메시지를 출력한다. 마지막으로 품목별 매출액을 계산하고 매출액 순으로 출력하라. 단, 레코드를 이용하라.<br>[입력]<br>취급품목은 품목명과 단가를 한 줄에 하나씩 입력한다.<br>판매 자료도 품목명과 수량을 한 줄에 하나씩 입력한다.<br>[출력]<br>① 번호, 품명, 단가, 수량, 금액 순서로 출력한다.<br>② 매출액 순으로 출력한다.<br>[예시]<br>냉장고 2120000 <┘<br>김치냉장고 598000 <┘<br>청소기 644000 <┘<br>세탁기 366900 <┘<br>...<br>세탁기 2 <┘<br>청소기 5 <┘<br>냉장고 1 <┘<br>김치냉장고 3 <┘<br><table><tr><th>번호</th><th>품명</th><th>단가</th><th>수량</th><th>금액</th></tr><tr><td>1</td><td>청소기</td><td>644,000</td><td>5</td><td>3,220,000</td></tr><tr><td>2</td><td>냉장고</td><td>2,120,000</td><td>1</td><td>2,120,000</td></tr><tr><td>3</td><td>김치냉장고</td><td>598,000</td><td>3</td><td>1,794,000</td></tr><tr><td>4</td><td>세탁기</td><td>366,900</td><td>2</td><td>733,800</td></tr><tr><td>...</td></tr></table>", GetProblemCode(), "ST0007");

INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(5, 1, "임금 계산(디스크 파일)", "다섯 명의 사원의 성명, 작업시간, 코드가 입력될 때, 임금을 구하는 프로그램을 작성하라.<br>코드에 따른 시간 수당은 다음과 같다.<br>코드 1 → 2000원<br>코드 2 → 2500원<br>코드 3 → 3000원<br>코드 4 → 4000원<br>[입력]<br>다섯 명 사원의 성명, 작업시간, 코드가 디스크 파일로 입력된다.<br>[출력]<br>다섯 명 사원의 성명, 작업시간, 코드, 그리고 임금이 디스크 파일로 출력된다.<br>[예시]<br><table><tr><td>홍길동</td><td>10</td><td>4</td><td><┘</td></tr><tr><td>김길동</td><td>11</td><td>1</td><td><┘</td></tr><tr><td>고길동</td><td>15</td><td>3</td><td><┘</td></tr><tr><td>최길동</td><td>19</td><td>5</td><td><┘</td></tr><tr><td>정길동</td><td>13</td><td>2</td><td><┘</td></tr></table><br><table><tr><th>성명</th><th>시간</th><th>코드</th><th>임금</th></tr><tr><td>홍길동</td><td>10</td><td>4</td><td>40000</td></tr><tr><td>김길동</td><td>11</td><td>1</td><td>22000</td></tr><tr><td>고길동</td><td>15</td><td>3</td><td>45000</td></tr><tr><td>최길동</td><td>19</td><td>5</td><td>0</td></tr><tr><td>정길동</td><td>13</td><td>2</td><td>32500</td></tr></table>", GetProblemCode(), "ST0008");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(5, 2, "성적 집계(디스크 파일)", "다섯 명의 학생 성명과 세 과목 점수가 입력될 때, 개인평균들과 반 평균을 구하는 프로그램을 작성하라.<br>[입력]<br>다섯 명의 학생 성명과 각 학생의 세 과목 점수들이 디스크 파일로 입력된다.<br>[출력]<br>입력받았던 데이터들과 함께 개인 총점들, 개인 평균들, 그리고 반 평균을 디스크 파일로 출력한다.<br>[예시]<br><table><tr><td>홍길동</td><td>100</td><td>100</td><td>100</td><td><┘</td></tr><tr><td>고길동</td><td>50</td><td>50</td><td>90</td><td><┘</td></tr><tr><td>최길동</td><td>70</td><td>80</td><td>60</td><td><┘</td></tr><tr><td>정길동</td><td>80</td><td>90</td><td>50</td><td><┘</td></tr><tr><td>김길동</td><td>60</td><td>60</td><td>80</td><td><┘</td></tr></table><br><table><tr><th>성명</th><th>과목1</th><th>과목2</th><th>과목3</th><th>총점</th><th>평균</th></tr><tr><td>홍길동</td><td>100</td><td>100</td><td>100</td><td>300</td><td>100.00</td></tr><tr><td>고길동</td><td>50</td><td>50</td><td>90</td><td>190</td><td>63.33</td></tr><tr><td>최길동</td><td>70</td><td>80</td><td>60</td><td>210</td><td>70.00</td></tr><tr><td>정길동</td><td>80</td><td>90</td><td>50</td><td>220</td><td>73.33</td></tr><tr><td>김길동</td><td>60</td><td>60</td><td>80</td><td>200</td><td>66.66</td></tr></table><br>반평균 : 74.66", GetProblemCode(), "ST0008");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(5, 3, "BMI(디스크 파일)", "10명의 학생의 성명, 키, 몸무게를 입력받아 처리 조건에 따라 신체 질량지수와 비만 정도를 판단하여 출력하는 프로그램을 작성하라.<br>신체 질량지수(Body Mass Index, BMI)는 체중(kg 기준)을 키(m 기준)의 제곱으로 나눈 수치이다. 신체 질량지수는 소수 첫째 자리에서 반올림한다.<br>비만 정도는 신체 질량지수를 사용하여 아래와 같이 판단한다.<br>① 비만(High) : BMI > 30<br>② 과체중(Over) : 25 ≤ BMI ≤ 30<br>③ 정상(Normal) : 19 ≤ BMI ≤ 24<br>④ 저체중(Low) : BMI < 19<br>[입력]<br>한 줄에 학생 한 명씩 성명, 키, 몸무게를 디스크 파일로입력한다.<br>[출력]<br>① 번호, 성명, 키, 체중, 신체 질량지수, 비만 정도 순서로 디스크 파일로 출력한다.<br>② 마지막 줄에는 비만 정도별로 인원수를 출력한다.<br>[예시]<br>홍길동 141.8 49.9 <┘<br>김정운 137.1 34.2 <┘<br>김민수 127.7 40.6 <┘<br><table><tr><th>번호</th><th>성명</th><th>키(cm)</th><th>체중(kg)</th><th>BMI<th><th>비만 정도</th></tr><tr><td>1<td><td>홍길동</td><td>141.8</td><td>49.9</td><td>25</td><td>과체중</td></tr><tr><td>2<td><td>김정운</td><td>137.1</td><td>34.2</td><td>18</td><td>저체중</td></tr><tr><td>3<td><td>김민수</td><td>127.7</td><td>40.6</td><td>25</td><td>과체중</td></tr><tr><td>...</td></tr><tr><td>10<td><td>황정미</td><td>141.1</td><td>36.8</td><td>18</td><td>저체중</td></tr></table>비만: 3 과체중: 2 정상: 3 저체중: 2", GetProblemCode(), "ST0008");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(5, 4, "전자제품 대리점(디스크 파일)", "어떤 가전제품 대리점에서 취급하는 품목은 20가지이다. 취급품목과 단가를 20개 입력받아 저장한다. 그리고 영업사원들이 당일 판매 자료를 입력받아서 취급품목이면 수량을 모두 합하고, 취급품목이 아니면 오류 메시지를 출력한다. 마지막으로 품목별 매출액을 계산하고 매출액 순으로 출력하라.<br>[입력]<br>취급품목은 품목명과 단가를 한 줄에 하나씩 디스크 파일로 입력한다.<br>판매 자료도 품목명과 수량을 한 줄에 하나씩 디스크 파일로 입력한다.<br>[출력]<br>① 번호, 품명, 단가, 수량, 금액 순서로 디스크 파일로 출력한다.<br>② 매출액 순으로 디스크 파일로 출력한다.<br>[예시]<br>냉장고 2120000 <┘<br>김치냉장고 598000 <┘<br>청소기 644000 <┘<br>세탁기 366900 <┘<br>...<br>세탁기 2 <┘<br>청소기 5 <┘<br>냉장고 1 <┘<br>김치냉장고 3 <┘<br><table><tr><th>번호</th><th>품명</th><th>단가</th><th>수량</th><th>금액</th></tr><tr><td>1</td><td>청소기</td><td>644,000</td><td>5</td><td>3,220,000</td></tr><tr><td>2</td><td>냉장고</td><td>2,120,000</td><td>1</td><td>2,120,000</td></tr><tr><td>3</td><td>김치냉장고</td><td>598,000</td><td>3</td><td>1,794,000</td></tr><tr><td>4</td><td>세탁기</td><td>366,900</td><td>2</td><td>733,800</td></tr><tr><td>...</td></tr></table>", GetProblemCode(), "ST0008");

INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(6, 1, "수들 뒤집기(힙)", "수들을 입력받아 거꾸로 출력하라.<br>[입력]<br>입력의 첫 번째 수는 수의 개수이다.<br>다음 줄에는 수들이 입력된다.<br>[출력]<br>한 줄에 입력받은 수를 거꾸로 출력한다.<br>[예시]<br>4 <┘<br>-9 1 2 3 <┘<br>3 2 1 -9", GetProblemCode(), "ST0009");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(6, 2, "369 게임(힙)", "자연수를 입력받아 1부터 입력받은 자연수 사이의 숫자를 출력하라. 단, 1부터 입력받은 자연수 사이의 숫자 중에서 3의 배수와 3이 들어가는 숫자에 대해서는 해당 숫자 대신에 \"Clap\"을 출력하라.<br>[입력]<br>숫자를 입력받는다. 입력받을 숫자의 범위는 1 이상의 자연수이다.<br>[출력]<br>3의 배수와 3이 들어가는 숫자가 아니면, 숫자 자체, 3의 배수와 3이 들어가는 숫자는 \"Clap\"을 출력한다.<br>숫자 사이에는 공간이 한 칸씩 들어간다.<br>[예시]<br>13 <┘<br>1 2 Clap 4 5 Clap 7 8 Clap 10 11 Clap Clap", GetProblemCode(), "ST0009");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(6, 3, "임금 계산(힙)", "다섯 명의 사원의 성명, 작업시간, 코드가 입력될 때, 임금을 구하는 프로그램을 작성하라.<br>코드에 따른 시간 수당은 다음과 같다.<br>코드 1 → 2000원<br>코드 2 → 2500원<br>코드 3 → 3000원<br>코드 4 → 4000원<br>[입력]<br>다섯 명 사원의 성명, 작업시간, 코드가 디스크 파일로 입력된다.<br>[출력]<br>다섯 명 사원의 성명, 작업시간, 코드, 그리고 임금이 디스크 파일로 출력된다.<br>[예시]<br><table><tr><td>홍길동</td><td>10</td><td>4</td><td><┘</td></tr><tr><td>김길동</td><td>11</td><td>1</td><td><┘</td></tr><tr><td>고길동</td><td>15</td><td>3</td><td><┘</td></tr><tr><td>최길동</td><td>19</td><td>5</td><td><┘</td></tr><tr><td>정길동</td><td>13</td><td>2</td><td><┘</td></tr></table><br><table><tr><th>성명</th><th>시간</th><th>코드</th><th>임금</th></tr><tr><td>홍길동</td><td>10</td><td>4</td><td>40000</td></tr><tr><td>김길동</td><td>11</td><td>1</td><td>22000</td></tr><tr><td>고길동</td><td>15</td><td>3</td><td>45000</td></tr><tr><td>최길동</td><td>19</td><td>5</td><td>0</td></tr><tr><td>정길동</td><td>13</td><td>2</td><td>32500</td></tr></table>", GetProblemCode(), "ST0009");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(6, 4, "성적 집계(힙)", "다섯 명의 학생 성명과 세 과목 점수가 입력될 때, 개인평균들과 반 평균을 구하는 프로그램을 작성하라.<br>[입력]<br>다섯 명의 학생 성명과 각 학생의 세 과목 점수들이 디스크 파일로 입력된다.<br>[출력]<br>입력받았던 데이터들과 함께 개인 총점들, 개인 평균들, 그리고 반 평균을 디스크 파일로 출력한다.<br>[예시]<br><table><tr><td>홍길동</td><td>100</td><td>100</td><td>100</td><td><┘</td></tr><tr><td>고길동</td><td>50</td><td>50</td><td>90</td><td><┘</td></tr><tr><td>최길동</td><td>70</td><td>80</td><td>60</td><td><┘</td></tr><tr><td>정길동</td><td>80</td><td>90</td><td>50</td><td><┘</td></tr><tr><td>김길동</td><td>60</td><td>60</td><td>80</td><td><┘</td></tr></table><br><table><tr><th>성명</th><th>과목1</th><th>과목2</th><th>과목3</th><th>총점</th><th>평균</th></tr><tr><td>홍길동</td><td>100</td><td>100</td><td>100</td><td>300</td><td>100.00</td></tr><tr><td>고길동</td><td>50</td><td>50</td><td>90</td><td>190</td><td>63.33</td></tr><tr><td>최길동</td><td>70</td><td>80</td><td>60</td><td>210</td><td>70.00</td></tr><tr><td>정길동</td><td>80</td><td>90</td><td>50</td><td>220</td><td>73.33</td></tr><tr><td>김길동</td><td>60</td><td>60</td><td>80</td><td>200</td><td>66.66</td></tr></table><br>반평균 : 74.66", GetProblemCode(), "ST0009");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(6, 5, "BMI(힙)", "10명의 학생의 성명, 키, 몸무게를 입력받아 처리 조건에 따라 신체 질량지수와 비만 정도를 판단하여 출력하는 프로그램을 작성하라.<br>신체 질량지수(Body Mass Index, BMI)는 체중(kg 기준)을 키(m 기준)의 제곱으로 나눈 수치이다. 신체 질량지수는 소수 첫째 자리에서 반올림한다.<br>비만 정도는 신체 질량지수를 사용하여 아래와 같이 판단한다.<br>① 비만(High) : BMI > 30<br>② 과체중(Over) : 25 ≤ BMI ≤ 30<br>③ 정상(Normal) : 19 ≤ BMI ≤ 24<br>④ 저체중(Low) : BMI < 19<br>[입력]<br>한 줄에 학생 한 명씩 성명, 키, 몸무게를 디스크 파일로입력한다.<br>[출력]<br>① 번호, 성명, 키, 체중, 신체 질량지수, 비만 정도 순서로 디스크 파일로 출력한다.<br>② 마지막 줄에는 비만 정도별로 인원수를 출력한다.<br>[예시]<br>홍길동 141.8 49.9 <┘<br>김정운 137.1 34.2 <┘<br>김민수 127.7 40.6 <┘<br><table><tr><th>번호</th><th>성명</th><th>키(cm)</th><th>체중(kg)</th><th>BMI<th><th>비만 정도</th></tr><tr><td>1<td><td>홍길동</td><td>141.8</td><td>49.9</td><td>25</td><td>과체중</td></tr><tr><td>2<td><td>김정운</td><td>137.1</td><td>34.2</td><td>18</td><td>저체중</td></tr><tr><td>3<td><td>김민수</td><td>127.7</td><td>40.6</td><td>25</td><td>과체중</td></tr><tr><td>...</td></tr><tr><td>10<td><td>황정미</td><td>141.1</td><td>36.8</td><td>18</td><td>저체중</td></tr></table>비만: 3 과체중: 2 정상: 3 저체중: 2", GetProblemCode(), "ST0009");
INSERT INTO Problem(chapterNumber, number, title, content, problemCode, stepCode) 
VALUES(6, 6, "전자제품 대리점(힙)", "어떤 가전제품 대리점에서 취급하는 품목은 20가지이다. 취급품목과 단가를 20개 입력받아 저장한다. 그리고 영업사원들이 당일 판매 자료를 입력받아서 취급품목이면 수량을 모두 합하고, 취급품목이 아니면 오류 메시지를 출력한다. 마지막으로 품목별 매출액을 계산하고 매출액 순으로 출력하라.<br>[입력]<br>취급품목은 품목명과 단가를 한 줄에 하나씩 디스크 파일로 입력한다.<br>판매 자료도 품목명과 수량을 한 줄에 하나씩 디스크 파일로 입력한다.<br>[출력]<br>① 번호, 품명, 단가, 수량, 금액 순서로 디스크 파일로 출력한다.<br>② 매출액 순으로 디스크 파일로 출력한다.<br>[예시]<br>냉장고 2120000 <┘<br>김치냉장고 598000 <┘<br>청소기 644000 <┘<br>세탁기 366900 <┘<br>...<br>세탁기 2 <┘<br>청소기 5 <┘<br>냉장고 1 <┘<br>김치냉장고 3 <┘<br><table><tr><th>번호</th><th>품명</th><th>단가</th><th>수량</th><th>금액</th></tr><tr><td>1</td><td>청소기</td><td>644,000</td><td>5</td><td>3,220,000</td></tr><tr><td>2</td><td>냉장고</td><td>2,120,000</td><td>1</td><td>2,120,000</td></tr><tr><td>3</td><td>김치냉장고</td><td>598,000</td><td>3</td><td>1,794,000</td></tr><tr><td>4</td><td>세탁기</td><td>366,900</td><td>2</td><td>733,800</td></tr><tr><td>...</td></tr></table>", GetProblemCode(), "ST0009");


DELIMITER //

CREATE FUNCTION GetMenteeCodeByEmailAddress(emailAddress VARCHAR(250)) RETURNS CHAR(9)
BEGIN
DECLARE menteeCode CHAR(9);
SELECT Mentee.menteeCode INTO menteeCode FROM Mentee WHERE Mentee.emailAddress = emailAddress;
RETURN menteeCode;
END//

CREATE FUNCTION GetCourseCodeByName(name VARCHAR(32)) RETURNS CHAR(4)
BEGIN
DECLARE courseCode CHAR(4);
SELECT Course.courseCode INTO courseCode FROM Course WHERE Course.name = name;
RETURN courseCode;
END//

CREATE FUNCTION GetStepCodeByCourseCodeAndNumber(courseCode CHAR(4), number INT) RETURNS CHAR(6)
BEGIN
DECLARE stepCode CHAR(6);
SELECT Step.stepCode INTO stepCode FROM Step WHERE Step.courseCode = courseCode AND Step.number = number;
RETURN stepCode;
END//

CREATE FUNCTION GetApplyCodeByMenteeCodeAndStepCode(menteeCode CHAR(9), stepCode CHAR(6)) RETURNS CHAR(18)
BEGIN
DECLARE applyCode CHAR(18);
SELECT Apply.applyCode INTO applyCode FROM Apply WHERE Apply.menteeCode = menteeCode AND Apply.stepCode = stepCode;
RETURN applyCode;
END//

CREATE FUNCTION GetSolutionNumber(applyCode CHAR(18), chapterNumber INT, problemNumber INT) RETURNS INT
BEGIN
DECLARE newNumber INT;
DECLARE oldNumber INT;
SELECT Solution.number INTO oldNumber FROM Solution WHERE Solution.applyCode = applyCode AND Solution.chapterNumber = chapterNumber AND Solution.problemNumber = problemNumber ORDER BY Solution.number DESC LIMIT 1;
SET newNumber = 1;
IF (oldNumber IS NOT NULL) THEN
SET newNumber = oldNumber + 1;
END IF;
RETURN newNumber;
END//

CREATE FUNCTION GetSolutionCodeByNumbersAndApplyCode(chapterNumber INT, problemNumber INT, number INT, applyCode CHAR(18)) RETURNS CHAR(18)
BEGIN
DECLARE solutionCode CHAR(18);
SELECT Solution.solutionCode INTO solutionCode FROM Solution 
WHERE Solution.chapterNumber = chapterNumber AND 
Solution.problemNumber = problemNumber AND
Solution.number = number AND
Solution.applyCode = applyCode;
RETURN solutionCode;
END//

CREATE FUNCTION GetMentoCodeByEmailAddress(emailAddress VARCHAR(250)) RETURNS CHAR(9)
BEGIN
DECLARE mentoCode CHAR(9);
SELECT Mento.mentoCode INTO mentoCode FROM Mento WHERE Mento.emailAddress = emailAddress;
RETURN mentoCode;
END//

CREATE FUNCTION GetQuestionCodeByNumbersAndApplyCode(chapterNumber INT, problemNumber INT, solutionNumber INT, questionNumber INT, applyCode CHAR(18)) RETURNS CHAR(18)
BEGIN
DECLARE questionCode CHAR(18);
DECLARE i INT;
SET i = questionNumber - 1;
SELECT Question.questionCode INTO questionCode FROM Question 
WHERE Question.chapterNumber = chapterNumber AND
Question.problemNumber = problemNumber AND
Question.solutionNumber = solutionNumber AND
Question.applyCode = applyCode
ORDER BY Question.time LIMIT i, 1;
RETURN questionCode;
END//

CREATE FUNCTION GetProblemCodeByNumbersAndStepCode(chapterNumber INT, number INT, stepCode CHAR(6)) RETURNS CHAR(7)
BEGIN
DECLARE problemCode CHAR(7);
SELECT Problem.problemCode INTO problemCode FROM Problem 
WHERE Problem.chapterNumber = chapterNumber AND 
Problem.number = number AND
Problem.stepCode = stepCode;
RETURN problemCode;
END//

CREATE FUNCTION MakeEvaluate(evaluate INT, solutionCode CHAR(18)) RETURNS CHAR(18)
BEGIN
DECLARE evaluateCode CHAR(18);
DECLARE i INT;
DECLARE value INT;
DECLARE result INT;
SELECT Evaluate.evaluateCode INTO evaluateCode FROM Evaluate WHERE Evaluate.solutionCode = solutionCode;
SET value = 1;
SET result = evaluate & value;
if(result > 0) THEN
UPDATE Evaluate SET Evaluate.abstract = 5 WHERE Evaluate.evaluateCode = evaluateCode;
END IF;
SET value = value << 1;
SET result = evaluate & value;
if(result > 0) THEN
UPDATE Evaluate SET Evaluate.logical = 5 WHERE Evaluate.evaluateCode = evaluateCode;
END IF;
SET value = value << 1;
SET result = evaluate & value;
if(result > 0) THEN
UPDATE Evaluate SET Evaluate.solve = 5 WHERE Evaluate.evaluateCode = evaluateCode;
END IF;
SET value = value << 1;
SET result = evaluate & value;
if(result > 0) THEN
UPDATE Evaluate SET Evaluate.critical = 5 WHERE Evaluate.evaluateCode = evaluateCode;
END IF;
SET value = value << 1;
SET result = evaluate & value;
if(result > 0) THEN
UPDATE Evaluate SET Evaluate.language = 5 WHERE Evaluate.evaluateCode = evaluateCode;
END IF;
SET value = value << 1;
SET result = evaluate & value;
if(result > 0) THEN
UPDATE Evaluate SET Evaluate.debugging = 5 WHERE Evaluate.evaluateCode = evaluateCode;
END IF;
RETURN evaluateCode;
END//

DELIMITER ;




DELIMITER //

CREATE PROCEDURE InsertToAuthentication(IN emailAddress VARCHAR(250), OUT authenticationCode CHAR(6))
BEGIN
SET authenticationCode = GetAuthenticationCode();
INSERT INTO Authentication (time, emailAddress, authenticationCode) VALUES (NOW(), emailAddress, authenticationCode);
END//

CREATE PROCEDURE CheckInAuthentication(IN emailAddress VARCHAR(250), IN authenticationCode CHAR(6), OUT result INT)
BEGIN
DECLARE recentAuthenticationCode CHAR(6);
SET result = 0;
SELECT Authentication.authenticationCode INTO recentAuthenticationCode FROM Authentication WHERE Authentication.emailAddress = emailAddress ORDER BY Authentication.time DESC LIMIT 1;
IF (recentAuthenticationCode = authenticationCode) THEN
SET result = 1;
END IF;
END//

CREATE PROCEDURE IsExistEmailAddress(IN emailAddress VARCHAR(250),  OUT result INT)
BEGIN
DECLARE count INT;
SET result = 0;
SELECT COUNT(*) INTO count FROM Mentee
INNER JOIN Apply ON Apply.menteeCode = Mentee.menteeCode 
INNER JOIN Payment ON Payment.applyCode = Apply.applyCode 
WHERE Mentee.emailAddress = emailAddress;
IF (count < 1) THEN
DELETE Apply FROM Apply
INNER JOIN Mentee ON Mentee.menteeCode = Apply.menteeCode
WHERE Mentee.emailAddress = emailAddress;
DELETE FROM Mentee WHERE Mentee.emailAddress = emailAddress;
END IF;
SELECT COUNT(*) INTO count FROM Mentee WHERE Mentee.emailAddress = emailAddress;
IF (count > 0) THEN
SET result = 1;
END IF;
END//

CREATE PROCEDURE ClearEmptyFromMentee()
BEGIN
DELETE Apply FROM Apply 
INNER JOIN Mentee ON Mentee.menteeCode = Apply.menteeCode
WHERE 
NOT EXISTS (SELECT * FROM Payment WHERE Payment.applyCode = Apply.applyCode)
AND TIMESTAMPDIFF(DAY, Mentee.time, NOW()) >= 1;
DELETE FROM Mentee WHERE 
(SELECT COUNT(*) FROM Apply 
INNER JOIN Payment ON Payment.applyCode = Apply.applyCode 
WHERE Apply.menteeCode = Mentee.menteeCode) = 0 AND TIMESTAMPDIFF(DAY, Mentee.time, NOW()) >= 1;
END//

CREATE PROCEDURE InsertToMentee(IN name VARCHAR(10), IN emailAddress VARCHAR(250), IN password VARCHAR(128))
BEGIN
INSERT INTO Mentee (name, emailAddress, password, time, menteeCode) VALUES (name, emailAddress, password, NOW(), GetMenteeCode());
END//

CREATE PROCEDURE ClearFromAuthentication(IN minute INT)
BEGIN
DELETE FROM Authentication WHERE TIMESTAMPDIFF(MINUTE, Authentication.time, NOW()) > minute;
END//

CREATE PROCEDURE CheckInMentee(IN emailAddress VARCHAR(250), IN password VARCHAR(128), OUT result INT)
BEGIN
DECLARE count INT;
SELECT COUNT(*) INTO count FROM Mentee WHERE Mentee.emailAddress = emailAddress AND Mentee.password = password;
SET result = 0;
IF (count = 1) THEN
SET result = 1;
END IF;
END//

CREATE PROCEDURE GetFromMentee(IN _emailAddress VARCHAR(250), OUT name VARCHAR(10), OUT emailAddress VARCHAR(250), OUT time DATETIME)
BEGIN
SELECT Mentee.name, Mentee.emailAddress, NOW() INTO name, emailAddress, time FROM Mentee WHERE Mentee.emailAddress = _emailAddress;
END//

CREATE PROCEDURE InsertToApply(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
INSERT INTO Apply (time, applyCode, menteeCode, stepCode) VALUES (NOW(), GetApplyCode(), menteeCode, stepCode);
END//

CREATE PROCEDURE InsertToPayment(IN emailAddress VARCHAR(250), IN orderId VARCHAR(64), IN orderName VARCHAR(64), IN price DECIMAL(15, 2))
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE applyCode CHAR(18);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SELECT Apply.applyCode INTO applyCode FROM Apply WHERE Apply.menteeCode = menteeCode ORDER BY Apply.time DESC LIMIT 1;
UPDATE Apply 
INNER JOIN Step ON Step.stepCode = Apply.stepCode 
SET Apply.state = "ALIVE", Apply.start = NOW(), Apply.end = DATE_ADD(NOW(), INTERVAL Step.period DAY) 
WHERE Apply.applyCode = applyCode;
INSERT INTO Payment (orderId, orderName, price, time, paymentCode, applyCode)
VALUES (orderId, orderName, price, NOW(), GetPaymentCode(), applyCode);
END//

CREATE PROCEDURE GetCodeFromStepByCourseNameAndStepNumber(IN courseName VARCHAR(32), IN stepNumber INT, OUT stepCode CHAR(6))
BEGIN
DECLARE courseCode CHAR(4);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
END//

CREATE PROCEDURE GetCodeFromApplyByEmailAddressAndCourseNameAndStepNumber(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, OUT applyCode CHAR(18))
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SELECT Apply.applyCode INTO applyCode FROM Apply WHERE Apply.menteeCode = menteeCode AND Apply.stepCode = stepCode;
END//

CREATE PROCEDURE GetCodeFromCurrentApply(IN emailAddress VARCHAR(250), OUT applyCode CHAR(18))
BEGIN
DECLARE menteeCode CHAR(9);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SELECT Payment.applyCode INTO applyCode FROM Payment
INNER JOIN Apply ON Apply.applyCode = Payment.applyCode
WHERE Apply.menteeCode = menteeCode ORDER BY Apply.time DESC LIMIT 1;
END//

CREATE PROCEDURE InsertToSolution(
IN emailAddress VARCHAR(250),
IN courseName VARCHAR(32),
IN stepNumber INT,
IN chapterNumber INT,
IN problemNumber INT,
IN number INT,
IN content TEXT,
IN image MEDIUMBLOB,
OUT time DATETIME
)
BEGIN
    DECLARE menteeCode CHAR(9);
    DECLARE courseCode CHAR(4);
    DECLARE stepCode CHAR(6);
    DECLARE applyCode CHAR(18);
    DECLARE solutionCode CHAR(18);

    SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
    SET courseCode = GetCourseCodeByName(courseName);
    SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
    SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
    SET solutionCode = GetSolutionCode();
    SET time = NOW();

    INSERT INTO Solution(chapterNumber, problemNumber, number, time, content, image, solutionCode, applyCode)
    VALUES(chapterNumber, problemNumber, number, NOW(), content, image, solutionCode, applyCode);
    INSERT INTO Evaluate(evaluateCode, solutionCode) VALUES(GetEvaluateCode(), solutionCode);
END//

CREATE PROCEDURE GetFromSolution(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN number INT, OUT time DATETIME, OUT state VARCHAR(16), OUT content TEXT, OUT abstract INT, OUT logical INT, OUT solve INT, OUT critical INT, OUT language INT, OUT debugging INT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
DECLARE solutionCode CHAR(18);
DECLARE problemCode CHAR(7);
DECLARE problemEvaluate INT;
DECLARE value INT;
DECLARE result INT;
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
SET solutionCode = GetSolutionCodeByNumbersAndApplyCode(chapterNumber, problemNumber, number, applyCode);
SELECT Solution.time, Solution.state, Solution.content INTO time, state, content FROM Solution WHERE Solution.solutionCode = solutionCode;
SET problemCode = GetProblemCodeByNumbersAndStepCode(chapterNumber, problemNumber, stepCode);
SELECT Problem.evaluate INTO problemEvaluate FROM Problem WHERE Problem.problemCode = problemCode;
SET value = 1;
SET result = problemEvaluate & value;
SET abstract = -1;
if(result > 0) THEN
SET abstract = 5;
END IF;
SET value = value << 1;
SET result = problemEvaluate & value;
SET logical = -1;
if(result > 0) THEN
SET logical = 5;
END IF;
SET value = value << 1;
SET result = problemEvaluate & value;
SET solve = -1;
if(result > 0) THEN
SET solve = 5;
END IF;
SET value = value << 1;
SET result = problemEvaluate & value;
SET critical = -1;
if(result > 0) THEN
SET critical = 5;
END IF;
SET value = value << 1;
SET result = problemEvaluate & value;
SET language = -1;
if(result > 0) THEN
SET language = 5;
END IF;
SET value = value << 1;
SET result = problemEvaluate & value;
SET debugging = -1;
if(result > 0) THEN
SET debugging = 5;
END IF;
END//

CREATE PROCEDURE GetImageFromSolution(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN number INT, OUT image MEDIUMBLOB)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
DECLARE solutionCode CHAR(18);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
SET solutionCode = GetSolutionCodeByNumbersAndApplyCode(chapterNumber, problemNumber, number, applyCode);
SELECT Solution.image INTO image FROM Solution WHERE Solution.solutionCode = solutionCode;
END//

CREATE PROCEDURE CheckInMento(IN emailAddress VARCHAR(250), IN password VARCHAR(128), OUT result INT)
BEGIN
DECLARE count INT;
SET result = 0;
SELECT COUNT(*) INTO count FROM Mento Where Mento.emailAddress = emailAddress AND Mento.password = password;
IF(count = 1) THEN
SET result = 1;
END IF;
END//

CREATE PROCEDURE GetFromMento(IN _emailAddress VARCHAR(250), OUT name VARCHAR(10), OUT emailAddress VARCHAR(250))
BEGIN
SELECT Mento.name, Mento.emailAddress INTO name, emailAddress From Mento Where Mento.emailAddress = _emailAddress;
END//

CREATE PROCEDURE InsertToFeedback(IN mentoEmailAddress VARCHAR(250), IN menteeEmailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN solutionNumber INT, IN evaluate INT, IN content TEXT)
BEGIN
DECLARE mentoCode CHAR(9);
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
DECLARE solutionCode CHAR(18);
DECLARE problemCode CHAR(7);
DECLARE evaluateCode CHAR(18);
DECLARE feedbackCount INT;
DECLARE problemEvaluate INT;
DECLARE lastChapterNumber INT;
DECLARE lastProblemNumber INT;
SET mentoCode = GetMentoCodeByEmailAddress(mentoEmailAddress);
SET menteeCode = GetMenteeCodeByEmailAddress(menteeEmailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
SET solutionCode = GetSolutionCodeByNumbersAndApplyCode(chapterNumber, problemNumber, solutionNumber, applyCode);
SELECT COUNT(*) INTO feedbackCount FROM Feedback WHERE Feedback.solutionCode = solutionCode;
IF(feedbackCount < 1) THEN
SET problemCode = GetProblemCodeByNumbersAndStepCode(chapterNumber, problemNumber, stepCode);
SELECT Problem.evaluate INTO problemEvaluate FROM Problem WHERE Problem.problemCode = problemCode;
SET evaluateCode = MakeEvaluate(problemEvaluate, solutionCode);
END IF;
INSERT INTO Feedback(time, evaluate, content, feedbackCode, mentoCode, solutionCode)
VALUES(NOW(), evaluate, content, GetFeedbackCode(), mentoCode, solutionCode);
IF(evaluate = -1) THEN
UPDATE Solution SET Solution.state = "FINISH" WHERE Solution.solutionCode = solutionCode;
SELECT Problem.chapterNumber INTO lastChapterNumber FROM Problem WHERE Problem.stepCode = stepCode ORDER BY Problem.chapterNumber DESC LIMIT 1;
SELECT Problem.number INTO lastProblemNumber FROM Problem WHERE Problem.stepCode = stepCode AND Problem.chapterNumber = lastChapterNumber ORDER BY Problem.number DESC LIMIT 1;
IF(chapterNumber = lastChapterNumber AND problemNumber = lastProblemNumber) THEN
UPDATE Apply SET Apply.state = "DEAD" WHERE Apply.applyCode = applyCode;
UPDATE Apply SET Apply.end = NOW() WHERE Apply.applyCode = applyCode;
END IF;
ELSEIF(evaluate = 0) THEN
IF((SELECT Solution.state FROM Solution WHERE Solution.solutionCode = solutionCode) = "WAIT") THEN
UPDATE Solution SET Solution.state = "PASS" WHERE Solution.solutionCode = solutionCode;
END IF;
ELSE
UPDATE Solution SET Solution.state = "FAIL" WHERE Solution.solutionCode = solutionCode;
IF(evaluate = 1) THEN
UPDATE Evaluate SET Evaluate.abstract = Evaluate.abstract - 1 WHERE Evaluate.solutionCode = solutionCode;
ELSEIF(evaluate = 2) THEN
UPDATE Evaluate SET Evaluate.logical = Evaluate.logical - 1 WHERE Evaluate.solutionCode = solutionCode;
ELSEIF(evaluate = 3) THEN
UPDATE Evaluate SET Evaluate.solve = Evaluate.solve - 1 WHERE Evaluate.solutionCode = solutionCode;
ELSEIF(evaluate = 4) THEN
UPDATE Evaluate SET Evaluate.critical = Evaluate.critical - 1 WHERE Evaluate.solutionCode = solutionCode;
ELSEIF(evaluate = 5) THEN
UPDATE Evaluate SET Evaluate.language = Evaluate.language - 1 WHERE Evaluate.solutionCode = solutionCode;
ELSEIF(evaluate = 6) THEN
UPDATE Evaluate SET Evaluate.debugging = Evaluate.debugging - 1 WHERE Evaluate.solutionCode = solutionCode;
ELSEIF(evaluate = -2) THEN
IF((SELECT Evaluate.abstract FROM Evaluate WHERE Evaluate.solutionCode = solutionCode) != -1) THEN
UPDATE Evaluate SET Evaluate.abstract = 0 WHERE Evaluate.solutionCode = solutionCode;
END IF;
IF((SELECT Evaluate.logical FROM Evaluate WHERE Evaluate.solutionCode = solutionCode) != -1) THEN
UPDATE Evaluate SET Evaluate.logical = 0 WHERE Evaluate.solutionCode = solutionCode;
END IF;
IF((SELECT Evaluate.solve FROM Evaluate WHERE Evaluate.solutionCode = solutionCode) != -1) THEN
UPDATE Evaluate SET Evaluate.solve = 0 WHERE Evaluate.solutionCode = solutionCode;
END IF;
IF((SELECT Evaluate.critical FROM Evaluate WHERE Evaluate.solutionCode = solutionCode) != -1) THEN
UPDATE Evaluate SET Evaluate.critical = 0 WHERE Evaluate.solutionCode = solutionCode;
END IF;
IF((SELECT Evaluate.language FROM Evaluate WHERE Evaluate.solutionCode = solutionCode) != -1) THEN
UPDATE Evaluate SET Evaluate.language = 0 WHERE Evaluate.solutionCode = solutionCode;
END IF;
IF((SELECT Evaluate.debugging FROM Evaluate WHERE Evaluate.solutionCode = solutionCode) != -1) THEN
UPDATE Evaluate SET Evaluate.debugging = 0 WHERE Evaluate.solutionCode = solutionCode;
END IF;
END IF;
END IF;
END//

CREATE PROCEDURE GetCodeFromSolutionSpecified(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN number INT, OUT solutionCode CHAR(18))
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
SELECT Solution.solutionCode INTO solutionCode FROM Solution
WHERE Solution.applyCode = applyCode AND Solution.chapterNumber = chapterNumber AND Solution.problemNumber = problemNumber AND Solution.number = number;
END//

CREATE PROCEDURE CheckToFeedback(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN solutionNumber INT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
DECLARE solutionCode CHAR(18);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
SELECT Solution.solutionCode INTO solutionCode FROM Solution
WHERE Solution.applyCode = applyCode AND Solution.chapterNumber = chapterNumber AND Solution.problemNumber = problemNumber AND Solution.number = solutionNumber;
UPDATE Feedback SET Feedback.state = "CHECKED"
WHERE Feedback.solutionCode = solutionCode;
END//

CREATE PROCEDURE InsertToQuestion(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN solutionNumber INT, IN number INT, IN content TEXT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
INSERT INTO Question(chapterNumber, problemNumber, solutionNumber, number, time, content, questionCode, applyCode)
VALUES(chapterNumber, problemNumber, solutionNumber, number, NOW(), content, GetQuestionCode(), applyCode);
END//

CREATE PROCEDURE CheckToQuestion(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN solutionNumber INT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
UPDATE Question SET Question.state = "CHECKED"
WHERE Question.applyCode = applyCode AND Question.chapterNumber = chapterNumber AND Question.problemNumber = problemNumber AND Question.solutionNumber = solutionNumber;
END//

CREATE PROCEDURE InsertToAnswer(IN mentoEmailAddress VARCHAR(250), IN menteeEmailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN solutionNumber INT, IN questionNumber INT ,IN content TEXT)
BEGIN
DECLARE mentoCode CHAR(9);
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
DECLARE questionCode CHAR(18);
SET mentoCode = GetMentoCodeByEmailAddress(mentoEmailAddress);
SET menteeCode = GetMenteeCodeByEmailAddress(menteeEmailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
SET questionCode = GetQuestionCodeByNumbersAndApplyCode(chapterNumber, problemNumber, solutionNumber, questionNumber, applyCode);
INSERT INTO Answer(time, content, answerCode, mentoCode, questionCode)
VALUES(NOW(), content, GetAnswerCode(), mentoCode, questionCode);
UPDATE Question SET Question.state = "CHECKED" WHERE Question.questionCode = questionCode;
END//

CREATE PROCEDURE CheckToAnswer(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN solutionNumber INT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
UPDATE Answer
INNER JOIN Question ON Question.applyCode = applyCode AND Question.chapterNumber = chapterNumber AND Question.problemNumber = problemNumber AND Question.solutionNumber = solutionNumber
SET Answer.state = "CHECKED"
WHERE Answer.questionCode = Question.questionCode;
END//

CREATE PROCEDURE ApplyAndPaymentTest(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT)
BEGIN
DECLARE i INT;
DECLARE orderName VARCHAR(64);
DECLARE price DECIMAL(15, 2);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
DECLARE menteeCode CHAR(9);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET i = 1;
WHILE(i < stepNumber) DO
SET orderName = CONCAT(courseName, CAST(i AS CHAR(2)));
SET orderName = CONCAT(orderName, "단계");
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, i);
SELECT Step.price INTO price FROM Step WHERE Step.stepCode = stepCode;
SET applyCode = GetApplyCode();
INSERT INTO Apply (time, applyCode, menteeCode, stepCode) VALUES (NOW(), applyCode, menteeCode, stepCode);
UPDATE Apply SET Apply.state = "ALIVE" WHERE Apply.applyCode = applyCode;
INSERT INTO Payment (orderId, orderName, price, time, paymentCode, applyCode)
VALUES (GetOrderId(), orderName, price, NOW(), GetPaymentCode(), applyCode);
UPDATE Apply SET Apply.state = "DEAD" WHERE Apply.applyCode = applyCode;
DO SLEEP(1);
SET i = i + 1;
END WHILE;
END//

CREATE PROCEDURE GetAbstractAverageFromEvaluate(IN emailAddress VARCHAR(250), OUT second FLOAT, OUT first FLOAT, OUT now FLOAT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE applyCode CHAR(18);
DECLARE count INT;
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SELECT Payment.applyCode INTO applyCode FROM Payment
INNER JOIN Apply ON Apply.applyCode = Payment.applyCode
WHERE Apply.menteeCode = menteeCode ORDER BY Apply.time DESC LIMIT 1;
SELECT COUNT(Evaluate.abstract) - 2 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.abstract != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.abstract) INTO second FROM (SELECT Evaluate.abstract FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.abstract != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.abstract) - 1 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.abstract != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.abstract) INTO first FROM (SELECT Evaluate.abstract FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.abstract != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.abstract) INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.abstract != -1 AND Solution.applyCode = applyCode;
SELECT AVG(Items.abstract) INTO now FROM (SELECT Evaluate.abstract FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.abstract != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
END//

CREATE PROCEDURE GetLogicalAverageFromEvaluate(IN emailAddress VARCHAR(250), OUT second FLOAT, OUT first FLOAT, OUT now FLOAT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE applyCode CHAR(18);
DECLARE count INT;
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SELECT Payment.applyCode INTO applyCode FROM Payment
INNER JOIN Apply ON Apply.applyCode = Payment.applyCode
WHERE Apply.menteeCode = menteeCode ORDER BY Apply.time DESC LIMIT 1;
SELECT COUNT(Evaluate.logical) - 2 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.logical != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.logical) INTO second FROM (SELECT Evaluate.logical FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.logical != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.logical) - 1 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.logical != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.logical) INTO first FROM (SELECT Evaluate.logical FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.logical != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.logical) INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.logical != -1 AND Solution.applyCode = applyCode;
SELECT AVG(Items.logical) INTO now FROM (SELECT Evaluate.logical FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.logical != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
END//

CREATE PROCEDURE GetSolveAverageFromEvaluate(IN emailAddress VARCHAR(250), OUT second FLOAT, OUT first FLOAT, OUT now FLOAT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE applyCode CHAR(18);
DECLARE count INT;
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SELECT Payment.applyCode INTO applyCode FROM Payment
INNER JOIN Apply ON Apply.applyCode = Payment.applyCode
WHERE Apply.menteeCode = menteeCode ORDER BY Apply.time DESC LIMIT 1;
SELECT COUNT(Evaluate.solve) - 2 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.solve != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.solve) INTO second FROM (SELECT Evaluate.solve FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.solve != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.solve) - 1 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.solve != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.solve) INTO first FROM (SELECT Evaluate.solve FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.solve != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.solve) INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.solve != -1 AND Solution.applyCode = applyCode;
SELECT AVG(Items.solve) INTO now FROM (SELECT Evaluate.solve FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.solve != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
END//

CREATE PROCEDURE GetCriticalAverageFromEvaluate(IN emailAddress VARCHAR(250), OUT second FLOAT, OUT first FLOAT, OUT now FLOAT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE applyCode CHAR(18);
DECLARE count INT;
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SELECT Payment.applyCode INTO applyCode FROM Payment
INNER JOIN Apply ON Apply.applyCode = Payment.applyCode
WHERE Apply.menteeCode = menteeCode ORDER BY Apply.time DESC LIMIT 1;
SELECT COUNT(Evaluate.critical) - 2 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.critical != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.critical) INTO second FROM (SELECT Evaluate.critical FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.critical != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.critical) - 1 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.critical != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.critical) INTO first FROM (SELECT Evaluate.critical FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.critical != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.critical) INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.critical != -1 AND Solution.applyCode = applyCode;
SELECT AVG(Items.critical) INTO now FROM (SELECT Evaluate.critical FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.critical != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
END//

CREATE PROCEDURE GetLanguageAverageFromEvaluate(IN emailAddress VARCHAR(250), OUT second FLOAT, OUT first FLOAT, OUT now FLOAT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE applyCode CHAR(18);
DECLARE count INT;
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SELECT Payment.applyCode INTO applyCode FROM Payment
INNER JOIN Apply ON Apply.applyCode = Payment.applyCode
WHERE Apply.menteeCode = menteeCode ORDER BY Apply.time DESC LIMIT 1;
SELECT COUNT(Evaluate.language) - 2 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.language != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.language) INTO second FROM (SELECT Evaluate.language FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.language != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.language) - 1 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.language != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.language) INTO first FROM (SELECT Evaluate.language FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.language != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.language) INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.language != -1 AND Solution.applyCode = applyCode;
SELECT AVG(Items.language) INTO now FROM (SELECT Evaluate.language FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.language != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
END//

CREATE PROCEDURE GetDebuggingAverageFromEvaluate(IN emailAddress VARCHAR(250), OUT second FLOAT, OUT first FLOAT, OUT now FLOAT)
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE applyCode CHAR(18);
DECLARE count INT;
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SELECT Payment.applyCode INTO applyCode FROM Payment
INNER JOIN Apply ON Apply.applyCode = Payment.applyCode
WHERE Apply.menteeCode = menteeCode ORDER BY Apply.time DESC LIMIT 1;
SELECT COUNT(Evaluate.debugging) - 2 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.debugging != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.debugging) INTO second FROM (SELECT Evaluate.debugging FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.debugging != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.debugging) - 1 INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.debugging != -1 AND Solution.applyCode = applyCode;
IF(count < 0) THEN
SET count = 0;
END IF;
SELECT AVG(Items.debugging) INTO first FROM (SELECT Evaluate.debugging FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.debugging != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
SELECT COUNT(Evaluate.debugging) INTO count FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode WHERE Evaluate.debugging != -1 AND Solution.applyCode = applyCode;
SELECT AVG(Items.debugging) INTO now FROM (SELECT Evaluate.debugging FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Evaluate.debugging != -1 AND Solution.applyCode = applyCode ORDER BY Evaluate.evaluateCode ASC LIMIT count) Items;
END//

CREATE PROCEDURE LeaveFromMentee(IN emailAddress VARCHAR(250), OUT result INT)
BEGIN
UPDATE Mentee SET Mentee.name = "퇴거자", Mentee.emailAddress = GetRandomString16(), Mentee.password = GetRandomString16() WHERE Mentee.emailAddress = emailAddress;
SET result = 1;
END//

CREATE PROCEDURE ClearAboutMentee(IN emailAddress VARCHAR(250))
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE countApply INT;
DECLARE i INT;
DECLARE applyCode CHAR(18);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SELECT COUNT(*) INTO countApply FROM Apply WHERE Apply.menteeCode = menteeCode;
SET i = countApply - 1;
WHILE(i >= 0) DO
SELECT Apply.applyCode INTO applyCode FROM Apply WHERE Apply.menteeCode = menteeCode
ORDER BY Apply.applyCode ASC LIMIT i, 1;
DELETE Answer FROM Answer INNER JOIN Question ON Question.questionCode = Answer.questionCode
WHERE Question.applyCode = applyCode;
DELETE FROM Question WHERE Question.applyCode = applyCode;
DELETE Feedback FROM Feedback INNER JOIN Solution ON Solution.solutionCode = Feedback.solutionCode
WHERE Solution.applyCode = applyCode;
DELETE Evaluate FROM Evaluate INNER JOIN Solution ON Solution.solutionCode = Evaluate.solutionCode
WHERE Solution.applyCode = applyCode;
DELETE FROM Solution WHERE Solution.applyCode = applyCode;
DELETE FROM Payment WHERE Payment.applyCode = applyCode;
DELETE FROM Apply WHERE Apply.applyCode = applyCode;
SET i = i - 1;
END WHILE;
DELETE FROM Mentee WHERE Mentee.menteeCode = menteeCode;
END//

CREATE PROCEDURE MakeTestMentee(IN name VARCHAR(10), IN emailAddress VARCHAR(250), IN password VARCHAR(128))
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
DECLARE period INT;
DECLARE price DECIMAL(15, 2);
SET menteeCode = GetMenteeCode();
INSERT INTO Mentee(name, emailAddress, password, time, menteeCode)
VALUES(name, emailAddress, password, NOW(), menteeCode);
SET stepCode = "ST0001";
SET applyCode = GetApplyCode();
SELECT Step.period, Step.price INTO period, price FROM Step WHERE Step.stepCode = stepCode;
INSERT INTO Apply(time, state, start, end, applyCode, menteeCode, stepCode)
VALUES(NOW(), "ALIVE", NOW(), DATE_ADD(NOW(), INTERVAL period DAY), applyCode, menteeCode, stepCode);
INSERT INTO Payment(orderId, orderName, price, time, paymentCode, applyCode)
VALUES(GetOrderId(), "1단계", price, NOW(), GetPaymentCode(), applyCode);
END//

CREATE PROCEDURE GetStateFromSolution(IN emailAddress VARCHAR(250), IN courseName VARCHAR(32), IN stepNumber INT, IN chapterNumber INT, IN problemNumber INT, IN number INT, OUT state VARCHAR(16))
BEGIN
DECLARE menteeCode CHAR(9);
DECLARE courseCode CHAR(4);
DECLARE stepCode CHAR(6);
DECLARE applyCode CHAR(18);
DECLARE solutionCode CHAR(18);
SET menteeCode = GetMenteeCodeByEmailAddress(emailAddress);
SET courseCode = GetCourseCodeByName(courseName);
SET stepCode = GetStepCodeByCourseCodeAndNumber(courseCode, stepNumber);
SET applyCode = GetApplyCodeByMenteeCodeAndStepCode(menteeCode, stepCode);
SET solutionCode = GetSolutionCodeByNumbersAndApplyCode(chapterNumber, problemNumber, number, applyCode);
SELECT Solution.state INTO state FROM Solution WHERE Solution.solutionCode = solutionCode;
END//

DELIMITER ;





CREATE VIEW ViewSolutionWork AS
SELECT Solution.time AS SolutionTime, Mentee.name AS MenteeName, Mentee.emailAddress AS MenteeEmailAddress, Course.name AS CourseName, Step.number AS StepNumber, Solution.chapterNumber AS SolutionChapterNumber, Solution.problemNumber AS SolutionProblemNumber, Solution.number AS SolutionNumber
FROM Solution
INNER JOIN Apply ON Apply.applyCode = Solution.applyCode
INNER JOIN Mentee ON Mentee.menteeCode = Apply.menteeCode
INNER JOIN Step ON Step.stepCode = Apply.stepCode
INNER JOIN Course ON Course.courseCode = Step.courseCode
WHERE Solution.state = "WAIT" ORDER BY Solution.time ASC;

CREATE VIEW ViewQuestionWork AS
SELECT Question.time AS QuestionTime, Mentee.name AS MenteeName, Mentee.emailAddress AS MenteeEmailAddress, Course.name AS CourseName, Step.number AS StepNumber, Question.chapterNumber AS QuestionChapterNumber, Question.problemNumber AS QuestionProblemNumber, Question.solutionNumber AS QuestionSolutionNumber
FROM Question
INNER JOIN Apply ON Apply.applyCode = Question.applyCode
INNER JOIN Mentee ON Mentee.menteeCode = Apply.menteeCode
INNER JOIN Step ON Step.stepCode = Apply.stepCode
INNER JOIN Course ON Course.courseCode = Step.courseCode
WHERE Question.state = "UNCHECKED" ORDER BY Question.time ASC;

CREATE VIEW ViewMentee AS
SELECT Mentee.name AS MenteeName, Mentee.emailAddress AS MenteeEmailAddress, 
Course.name AS CourseName, Step.number AS StepNumber
FROM Mentee
LEFT JOIN (SELECT MAX(Apply.time) AS time, Apply.menteeCode AS menteeCode, MAX(Apply.stepCode) AS stepCode FROM Apply GROUP BY Apply.menteeCode) LastApply ON LastApply.menteeCode = Mentee.menteeCode
LEFT JOIN Step ON Step.stepCode = LastApply.stepCode
LEFT JOIN Course ON Course.courseCode = Step.courseCode
ORDER BY Mentee.name ASC;

CREATE VIEW ViewSolutionExceptImage AS
SELECT Solution.chapterNumber AS chapterNumber, Solution.problemNumber AS problemNumber, Solution.number AS number,
Solution.time AS time, Solution.state AS state, Solution.content AS content, Solution.solutionCode AS solutionCode, Solution.applyCode AS applyCode
FROM Solution;

CREATE VIEW ViewTableSize AS
SELECT table_schema AS 'DatabaseName', TABLE_NAME,
ROUND(SUM(data_length + index_length)/ 1024 / 1024 , 2) AS 'total_Size(MB)',
ROUND(SUM(data_length)/ 1024 / 1024, 2) AS 'data_Size(MB)',
ROUND(SUM(index_length)/ 1024 / 1024, 2) AS 'index_Size(MB)',
ROUND(SUM(data_free)/ 1024 / 1024, 2) AS 'free space(MB)'
FROM information_schema.tables
WHERE table_schema = "naamentoring"
GROUP BY table_schema, TABLE_NAME;

CREATE VIEW ViewTableSize AS SELECT table_schema AS 'DatabaseName', TABLE_NAME, ROUND(SUM(data_length + index_length)/ 1024 / 1024 , 2) AS 'total_Size(MB)', ROUND(SUM(data_length)/ 1024 / 1024, 2) AS 'data_Size(MB)', ROUND(SUM(index_length)/ 1024 / 1024, 2) AS 'index_Size(MB)' FROM information_schema.TABLES WHERE table_schema = "naasofttest" GROUP BY table_schema, TABLE_NAME;