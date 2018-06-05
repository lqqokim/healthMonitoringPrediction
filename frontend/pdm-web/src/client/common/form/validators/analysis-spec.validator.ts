import { FormControl } from '@angular/forms';

/**
 * worst-top form component validator 
 */
export function analysisSpecValidator(form: FormControl) {
    let valid: boolean = true;
    let invalidMessage: string;

    if (!form.value && form.dirty === true) {
        valid = false;
        invalidMessage = 'Please enter a value';
    } else if (form.value) {
        if (form.value.match(/^-?\d*(\.\d+)?$/)) {
            if (form.value < 0 || form.value.split("")[0] === '0') {
                valid = false;
                invalidMessage = 'Please enter a number greater than 0.';
            }
        } else if(!form.value.match(/^-?\d*(\.\d+)?$/)) {
            valid = false;
            invalidMessage = 'Please enter a number.';
        }
    }

    if (valid) {
        return null;
    } else {
        return {
            valid,
            invalidMessage
        };
    }
}