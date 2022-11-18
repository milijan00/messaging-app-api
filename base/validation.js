
class Validator{
	static result = {
		errors: {},
		invalid : function() { return Object.keys(this.errors).length > 0}
	}

	static regexes = {
		name : {
			value: /^[A-Z][a-z\s]{2,30}$/,
			message : "Must contain only letters and spaces. Minimum is 3 and maximum is 30."
		},
		firstnameLastname : {
			value : /^[A-Z][a-z\s]{2,29}$/,
			message : "No number, no special characters, minimum characters 3 and maximum is 30."
		},
		email : {
			value : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
			message : "Email is not in correct format."
		},
		password : {
			value : /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
			message : "Minimum 8 characters, at least one letter and number"
		},
		path : {
			value : /^[a-z\-]{3,30}$/,
			message : "lowercase letters and - are allowed. Minimum characters 3 and maximum is 30."
		}
	}

	static validateName(value){
		const invalid =  value.match(Validator.regexes.name.value)  == null;
		if(invalid ){
			// add error message
			Validator.result.errors.name = Validator.regexes.name.message;
		}
	}

	static validateFirstname(value){
		const invalid =  value.match(Validator.regexes.firstnameLastname.value) == null;
		if(invalid){
			Validator.result.errors.firstname = Validator.regexes.firstnameLastname.message;
		}
	}

	static validateLastname(value){
		const invalid =  value.match(Validator.regexes.firstnameLastname.value) == null;
		if(invalid){
			Validator.result.errors.lastname = Validator.regexes.firstnameLastname.message;
		}
	}

	static validateEmail(value){
		const invalid = value.match(Validator.regexes.email.value) == null;
		if(invalid){
			Validator.result.errors.email = Validator.regexes.email.message;
		}
	}

	static validatePassword(value){
		const invalid =   value.match(Validator.regexes.password.value) == null;
		if(invalid){
			Validator.result.errors.password = Validator.regexes.password.message;
		}
	}
	
	static validatePasswordAgain(value){
		const invalid =   value.match(Validator.regexes.password.value) == null;
		if(invalid){
			Validator.result.errors.passwordAgain = Validator.regexes.password.message;
		}
	}

	static validatePath(value)	{
		const invalid =   value.match(Validator.regexes.path.value) == null;
		if(invalid){

		}
	}

}

module.exports = Validator;
/**
 * users
 * /users
 * /messages
 * /chats
 */