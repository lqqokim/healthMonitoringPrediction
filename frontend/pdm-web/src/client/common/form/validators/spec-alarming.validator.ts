import { FormControl } from '@angular/forms';

/**
 * spec-alarming form component validator 
 */
export function specAlarmingValidator(form: FormControl) {
    let valid: boolean = true;
    let invalidMessage: string;

    // Todo : widget configuration이 생성되지 전에 validator 로직이 타는 문제 검토 해야함
    // if (!form.value || form.value === '' || _.isEmpty(form.value)) {
    //     valid = false;
    //     invalidMessage = 'Please input ucl & usl value';
    // }
    // else if (form.value.ucl > form.value.usl || form.value.ucl === form.value.usl ) {
    //     valid = false;
    //     invalidMessage = 'Please let ucl less value than usl';
    // }
    // else if (isNaN(form.value.ucl)) {
    //     valid = false;
    //     invalidMessage = 'Please input number for value of ucl';
    // }
    // else if (isNaN(form.value.usl)) {
    //     valid = false;
    //     invalidMessage = 'Please input number for value of usl';
    // }

    if (!form.value || form.value === '' || _.isEmpty(form.value)) {
        return null;
    }
    else if (form.value.ucl > form.value.usl || form.value.ucl === form.value.usl ) {
        valid = false;
        invalidMessage = 'The UCL should not be greater than USL';
    }
    else if (isNaN(form.value.ucl)) {
        valid = false;
        invalidMessage = 'Please input number for value of ucl';
    }
    else if (isNaN(form.value.usl)) {
        valid = false;
        invalidMessage = 'Please input number for value of usl';
    }

    if (valid) {
        return null;
    } else {
        return {
            valid,
            invalidMessage
        };
    }
};