import { FormControl } from '@angular/forms';

/**
 * worst-top form component validator 
 */
export function worstTopValidator(form: FormControl) {
    let valid: boolean = true;
    let invalidMessage: string;

    if (!form.value && form.dirty === true) {
        valid = false;
        invalidMessage = 'Please enter a value';
    } else if(form.value){
        let value = form.value;

        if (!form.value.match(/^[0-9]+$/gm) || form.value.split("")[0] === '0') {
            valid = false;
            invalidMessage = 'Please enter only integers greater than 0.';
        } else if (form.value > 999) {
            valid = false;
            invalidMessage = 'Please enter a value less than 999.';
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