export class PasswordChecker {
    constructor() {
        this.alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        this.numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        this.specialChars = ['!', '\"', '#', '$', '%', '&', '\'', '(', ')', '*',
            '+', ',', '-', '.', '/', ':', ';', '<', '=', '>',
            '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|',
            '}', '~'];
    }

    /** @return {Boolean} */
    CheckLength(password) {
        let ret = true;

        if (password.length < 8 || password.length > 16) {
            ret = false;
        }

        return ret;
    }

    /** @return {Boolean} */
    CheckAlphabet(password) {
        let i = 0;
        let j;
        let alphabet = false;

        while (i < password.length && alphabet === false) {
            j = 0;
            while (j < this.alphabet.length && alphabet === false) {
                if (password[i] === this.alphabet[j]) {
                    alphabet = true;
                }
                j++;
            }
            i++;
        }

        return alphabet;
    }

    /** @return {Boolean} */
    CheckNumber(password) {
        let i = 0;
        let j;
        let number = false;

        while (i < password.length && number === false) {
            j = 0;
            while (j < this.numbers.length && number === false) {
                if (password[i] === this.numbers[j]) {
                    number = true;
                }
                j++;
            }
            i++;
        }

        return number;
    }

    /** @return {Boolean} */
    CheckSpecialChar(password) {
        let i = 0;
        let j;
        let specialChar = false;

        while (i < password.length && specialChar === false) {
            j = 0;
            while (j < this.specialChars.length && specialChar === false) {
                if (password[i] === this.specialChars[j]) {
                    specialChar = true;
                }
                j++;
            }
            i++;
        }

        return specialChar;
    }

    /** @return {Boolean} */
    CheckSequentialNumber(password) {
        let i;
        let j;
        let isNumber = false;
        let sequentialNumber = true;

        i = 0;
        while (i <= password.length - 3 && sequentialNumber === true) {
            j = 0;
            while (j <= this.numbers.length - 3 && isNumber === false) {
                if (password[i] === this.numbers[j]) {
                    isNumber = true;
                }
                j++;
            }
            // console.log("password[i + 1] = ", password[i + 1], " / password[i] + 1 = ", parseInt(password[i]) + 1,
            //     "\npassword[i + 2] = ", password[i + 2], " / password[i + 1] + 1 = ", parseInt(password[i + 1]) + 1);
            if (isNumber === true &&
                password[i + 1] == parseInt(password[i]) + 1 &&
                password[i + 2] == parseInt(password[i + 1]) + 1) {
                sequentialNumber = false;
            }
            i++;
        }

        isNumber = false;
        i = password.length - 1;
        while (i >= 2 && sequentialNumber === true) {
            j = 0;
            while (j <= this.numbers.length - 3 && isNumber === false) {
                if (password[i] === this.numbers[j]) {
                    isNumber = true;
                }
                j++;
            }
            // console.log("password[i - 1] = ", password[i - 1], " / password[i] - 1 = ", parseInt(password[i]) + 1,
            //     "\npassword[i - 2] = ", password[i - 2], " / password[i - 1] - 1 = ", parseInt(password[i - 1]) + 1);
            if (isNumber === true &&
                password[i - 1] == parseInt(password[i]) + 1 &&
                password[i - 2] == parseInt(password[i - 1]) + 1) {
                sequentialNumber = false;
            }
            i--;
        }

        return sequentialNumber;
    }

    /** @return {Boolean} */
    CheckVaildChar(password) {
        let i = 0;
        let j;
        let vaildChar = true;
        let isPassed = false;

        while (i < password.length && vaildChar === true) {
            j = 0;
            while (j < this.alphabet.length && isPassed === false) {
                if (password[i] === this.alphabet[j]) {
                    isPassed = true;
                }
                j++;
            }

            j = 0;
            while (j < this.numbers.length && isPassed === false) {
                if (password[i] === this.numbers[j]) {
                    isPassed = true;
                }
                j++;
            }

            j = 0;
            while (j < this.specialChars.length && isPassed === false) {
                if (password[i] === this.specialChars[j]) {
                    isPassed = true;
                }
                j++;
            }
            if (isPassed === false) {
                vaildChar = false;
            }
            i++;
        }

        return vaildChar;
    }
}