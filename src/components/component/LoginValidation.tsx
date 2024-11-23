export interface ValidationErrors {
    email?: string;
    password?: string;
}

function Validation(values: { email: string; password: string }): ValidationErrors {
    let error: ValidationErrors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/;

    if (values.email === "") {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email didn't match";
    }

    if (values.password === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password didn't match";
    }else{
        error.password = ""
    }
    return error;
}

export default Validation;